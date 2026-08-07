from fastapi.testclient import TestClient
from app.main import app
from tests.conftest import create_sample_pdf_bytes

client = TestClient(app)

def test_analyze_api_pdf_success():
    pdf_bytes = create_sample_pdf_bytes(
        "John Developer\nEmail: john@dev.com\nSUMMARY\nPassionate engineer\nEXPERIENCE\nBuilt API\nEDUCATION\nCS Degree\nSKILLS\nPython, FastAPI"
    )
    response = client.post(
        "/api/v1/analyze",
        files={"resume": ("sample_resume.pdf", pdf_bytes, "application/pdf")},
        data={"job_description": "Looking for Python FastAPI developer."},
    )

    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    data = res_data["data"]
    assert data["resume"]["fileName"] == "sample_resume.pdf"
    assert data["score"]["overall"] > 0
    assert len(data["sections"]) > 0

def test_analyze_api_invalid_file_type():
    response = client.post(
        "/api/v1/analyze",
        files={"resume": ("sample.txt", b"Plain text file", "text/plain")},
    )

    assert response.status_code == 400
    res_data = response.json()
    assert res_data["success"] is False
    assert res_data["error"]["code"] == "INVALID_FILE_TYPE"

def test_analyze_api_empty_file():
    response = client.post(
        "/api/v1/analyze",
        files={"resume": ("empty.pdf", b"", "application/pdf")},
    )

    assert response.status_code == 400
    res_data = response.json()
    assert res_data["success"] is False
    assert res_data["error"]["code"] == "EMPTY_FILE"


def test_analyze_api_rejects_oversized_upload():
    """Uploads are size-capped while reading so oversized files never fully load into memory."""
    oversized_bytes = b"0" * (10 * 1024 * 1024 + 1)
    response = client.post(
        "/api/v1/analyze",
        files={"resume": ("huge.pdf", oversized_bytes, "application/pdf")},
    )

    assert response.status_code == 400
    res_data = response.json()
    assert res_data["error"]["code"] == "FILE_TOO_LARGE"


def test_analyze_api_rejects_mismatched_mime_type():
    """A PDF-named file served as an obviously wrong content type is rejected."""
    response = client.post(
        "/api/v1/analyze",
        files={"resume": ("resume.pdf", b"%PDF-1.4 fake", "text/html")},
    )

    assert response.status_code == 400
    res_data = response.json()
    assert res_data["error"]["code"] == "INVALID_FILE_TYPE"


def test_analyze_api_parse_failure_does_not_leak_internal_details():
    """Parser internals must never surface in the client-facing error message."""
    response = client.post(
        "/api/v1/analyze",
        files={"resume": ("broken.pdf", b"\x00\x01\x02 not a real pdf", "application/pdf")},
    )

    assert response.status_code == 422
    body = response.json()
    assert body["error"]["code"] == "PARSE_FAILED"
    message = body["error"]["message"].lower()
    assert "broken.pdf" in message  # sanitized filename is fine to show
    assert "traceback" not in message
    assert "fitz" not in message


def test_analyze_api_sanitizes_malicious_filename():
    """Path-traversal filenames are reduced to a safe basename in errors/logs."""
    response = client.post(
        "/api/v1/analyze",
        files={"resume": ("../../etc/passwd.pdf", b"%PDF-1.4 fake", "application/pdf")},
    )

    # Either parse fails (422) or analysis proceeds — but the client-facing
    # message must never echo the path components.
    assert response.status_code in (400, 422)
    message = response.json().get("error", {}).get("message", "")
    assert ".." not in message
    assert "etc/" not in message
    assert "\\" not in message
