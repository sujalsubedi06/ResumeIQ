import pytest

from app.core.rate_limit import rate_limiter


@pytest.fixture(autouse=True)
def _reset_rate_limiter():
    """Give every test a fresh rate-limit budget (shared module-level limiter)."""
    rate_limiter.clear()
    yield
    rate_limiter.clear()


def create_sample_pdf_bytes(content: str = "John Doe\nSoftware Developer\nSkills: Python, FastAPI") -> bytes:
    """Create a sample PDF file in-memory for testing."""
    import fitz
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), content)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes
