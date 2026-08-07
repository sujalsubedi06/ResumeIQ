"""
Simple in-process fixed-window rate limiter for abuse hardening.

Deliberately dependency-free and per-process: with gunicorn's default 2
workers, each process tracks its own counters (so the effective budget is
multiplied by the worker count). That is acceptable for raising the bar
against casual abuse on a free, no-auth API. For strict global limits
across instances, swap this for a Redis-backed limiter instead.
"""

import threading
import time
from typing import Dict, Tuple

from fastapi import Request

from app.core.config import settings
from app.core.exceptions import RateLimitExceededError


class RateLimiter:
    """Fixed-window counter per key (e.g. client IP)."""

    def __init__(self, max_requests: int, window_seconds: int) -> None:
        # Guard against misconfigured env values (e.g. RATE_LIMIT_MAX_REQUESTS=0
        # would otherwise reject every request).
        self.max_requests = max(1, max_requests)
        self.window_seconds = max(1, window_seconds)
        # key -> (window_start_timestamp, request_count)
        self._buckets: Dict[str, Tuple[float, int]] = {}
        self._lock = threading.Lock()
        self._checks_since_cleanup = 0

    def _purge_expired(self, now: float) -> None:
        expired = [
            key
            for key, (start, _) in self._buckets.items()
            if now - start >= self.window_seconds
        ]
        for key in expired:
            del self._buckets[key]

    def check(self, key: str) -> Tuple[bool, int]:
        """
        Record a request for `key` and return (allowed, retry_after_seconds).

        `retry_after_seconds` is only meaningful when `allowed` is False.
        """
        now = time.monotonic()
        with self._lock:
            self._checks_since_cleanup += 1
            # Opportunistic cleanup keeps memory bounded for many unique keys
            if self._checks_since_cleanup >= 100:
                self._checks_since_cleanup = 0
                self._purge_expired(now)

            window_start, count = self._buckets.get(key, (now, 0))
            if now - window_start >= self.window_seconds:
                window_start, count = now, 0

            if count >= self.max_requests:
                retry_after = (
                    max(1, int(self.window_seconds - (now - window_start)) + 1)
                )
                return False, retry_after

            self._buckets[key] = (window_start, count + 1)
            return True, 0

    def clear(self) -> None:
        """Reset all counters (used by tests)."""
        with self._lock:
            self._buckets.clear()


# Default limiter used by the rate-limit dependency.
rate_limiter = RateLimiter(
    max_requests=settings.RATE_LIMIT_MAX_REQUESTS,
    window_seconds=settings.RATE_LIMIT_WINDOW_SECONDS,
)


def _client_ip(request: Request) -> str:
    """Best-effort client IP, honoring the first X-Forwarded-For hop.

    The first hop is only trustworthy because Render's reverse proxy sets
    (and prepends the real client IP to) X-Forwarded-For. Do NOT replace this
    with request.client.host — behind the proxy that is the proxy's own IP,
    which would lump every user into a single rate-limit bucket. If the API
    were ever reachable directly, the header could be spoofed and rotated to
    bypass the limiter; a trusted-proxy setup is part of the threat model.
    """
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        first = forwarded.split(",")[0].strip()
        if first:
            return first
    return request.client.host if request.client else "unknown"


async def enforce_rate_limit(request: Request) -> None:
    """FastAPI dependency: reject requests over the per-IP budget with 429."""
    allowed, retry_after = rate_limiter.check(_client_ip(request))
    if not allowed:
        raise RateLimitExceededError(retry_after_seconds=retry_after)
