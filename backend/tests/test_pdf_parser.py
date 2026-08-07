import pytest
from app.core.exceptions import ParseFailedError
from app.parsers.pdf_parser import PDFParser
from tests.conftest import create_sample_pdf_bytes

def test_pdf_parser_success():
    parser = PDFParser()
    sample_bytes = create_sample_pdf_bytes("Sujal Subedi\nCybersecurity Student\nPython, Linux")
    result = parser.parse(sample_bytes, "test_resume.pdf")

    assert result.metadata.fileName == "test_resume.pdf"
    assert result.metadata.fileType == "pdf"
    assert result.metadata.pageCount == 1
    assert "Sujal Subedi" in result.text
    assert "Cybersecurity Student" in result.text
    assert result.metadata.wordCount > 0

def test_pdf_parser_invalid_bytes():
    parser = PDFParser()
    invalid_bytes = b"This is not a PDF file"
    with pytest.raises(ParseFailedError) as exc_info:
        parser.parse(invalid_bytes, "invalid.pdf")
    assert "Failed to parse PDF document" in str(exc_info.value)
