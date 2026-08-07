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
