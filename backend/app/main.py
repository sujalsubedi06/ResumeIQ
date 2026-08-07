from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.gzip import GZipMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.exceptions import ResumeIQException
from app.core.logging import logger


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Apply hardening headers to every API response."""

    SECURITY_HEADERS = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        # Legacy browsers' XSS filter is broken; modern browsers ignore it.
        # We opt out explicitly and rely on strict parsing instead.
        "X-XSS-Protection": "0",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "Cross-Origin-Opener-Policy": "same-origin",
    }

    # FastAPI's interactive docs are real HTML pages that load their CSS/JS
    # from the jsdelivr CDN and use inline scripts — they need their own, more
    # permissive CSP (scoped to those exact paths only). The stylesheet link
    # must be allowed in style-src or Swagger renders unstyled.
    _SWAGGER_PATHS = ("/docs", "/redoc", f"{settings.API_V1_STR}/openapi.json")
    _SWAGGER_CSP = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
        "img-src 'self' data: https://fastapi.tiangolo.com; "
        "font-src 'self' data: https://cdn.jsdelivr.net; "
        "connect-src 'self'; "
        "frame-ancestors 'none'; "
        "base-uri 'self'; "
        "form-action 'self'"
    )
    # Pure JSON API responses should never render content — deny everything.
    _API_CSP = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        csp = (
            self._SWAGGER_CSP
            if request.url.path in self._SWAGGER_PATHS
            else self._API_CSP
        )
        response.headers.setdefault("Content-Security-Policy", csp)
        for header, value in self.SECURITY_HEADERS.items():
            response.headers.setdefault(header, value)
        return response


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# CORS Middleware — locked down to configured origins in production
cors_origins = settings.cors_origins_list
# `*` combined with allow_credentials=True is invalid per the CORS spec and is
# rejected by browsers. The API uses no cookies, so credentials are only
# enabled when origins are explicitly restricted.
allow_credentials = cors_origins != ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)
if cors_origins == ["*"]:
    logger.info("CORS: All origins allowed (development mode, credentials disabled)")
else:
    logger.info(f"CORS: Restricted to {cors_origins}")

# GZip compression — shrink JSON analysis responses on the wire (≥1 KB)
app.add_middleware(GZipMiddleware, minimum_size=1024)

# Security headers — added last so they wrap every response, including
# compressed ones (GZip copies response headers through).
app.add_middleware(SecurityHeadersMiddleware)

# Custom Exception Handler
@app.exception_handler(ResumeIQException)
async def resumeiq_exception_handler(request: Request, exc: ResumeIQException):
    logger.warning(f"ResumeIQ Exception [{exc.code}]: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": {"code": exc.code, "message": exc.message}},
        headers=exc.headers,
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
    }
