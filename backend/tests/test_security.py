from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_security_headers_present_on_api_responses():
    response = client.get("/api/v1/health")

    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["referrer-policy"] == "strict-origin-when-cross-origin"
    assert "permissions-policy" in response.headers
    assert response.headers["x-xss-protection"] == "0"


def test_strict_csp_on_json_api_responses():
    response = client.get("/api/v1/health")
    csp = response.headers["content-security-policy"]
    assert "default-src 'none'" in csp
    assert "frame-ancestors 'none'" in csp


def test_swagger_ui_gets_a_permissive_csp():
    response = client.get("/docs")
    csp = response.headers["content-security-policy"]
    assert "default-src 'self'" in csp
    # The stylesheet + JS bundles load from jsdelivr — both must be allowed
    assert "https://cdn.jsdelivr.net" in csp
    assert "style-src" in csp


def test_coop_header_present():
    response = client.get("/api/v1/health")
    assert response.headers["cross-origin-opener-policy"] == "same-origin"


def test_cors_preflight_wildcard_does_not_allow_credentials():
    response = client.options(
        "/api/v1/analyze",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
        },
    )

    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "*"
    # `*` + credentials is invalid per the CORS spec — must never be emitted
    assert "access-control-allow-credentials" not in response.headers
