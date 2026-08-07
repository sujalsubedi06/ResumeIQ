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
    }

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
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
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs",
    }
