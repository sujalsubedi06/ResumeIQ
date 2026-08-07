from fastapi.testclient import TestClient

from app.core.rate_limit import rate_limiter
from app.main import app
from tests.conftest import create_sample_pdf_bytes

client = TestClient(app)

PDF = create_sample_pdf_bytes("Rate limit test resume")


def _analyze():
    return client.post(
        "/api/v1/analyze",
        files={"resume": ("resume.pdf", PDF, "application/pdf")},
    )


def test_rate_limit_allows_requests_within_budget():
    for _ in range(rate_limiter.max_requests):
        response = _analyze()
        assert response.status_code == 200


def test_rate_limit_rejects_request_over_budget_with_429():
    for _ in range(rate_limiter.max_requests):
        assert _analyze().status_code == 200

    blocked = _analyze()
    assert blocked.status_code == 429
    body = blocked.json()
    assert body["success"] is False
    assert body["error"]["code"] == "RATE_LIMITED"
    # Retry-After tells the client when the window resets
    assert int(blocked.headers["retry-after"]) >= 1


def test_rate_limit_does_not_affect_other_endpoints():
    # Exhaust the analyze budget, then confirm unrelated routes are untouched
    for _ in range(rate_limiter.max_requests):
        _analyze()

    health = client.get("/api/v1/health")
    assert health.status_code == 200
