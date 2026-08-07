import pytest
from app.core.exceptions import EmptyFileError, FileTooLargeError, InvalidFileTypeError, ParseFailedError
from app.services.parser_service import ParserService
from tests.test_docx_parser import create_sample_docx_bytes
from tests.test_pdf_parser import create_sample_pdf_bytes

def test_parser_service_pdf():
    pdf_bytes = create_sample_pdf_bytes("John Doe Resume\nExperience: Senior Engineer")
    parsed_doc = ParserService.parse_resume(pdf_bytes, "john_resume.pdf")

    assert parsed_doc.metadata.fileName == "john_resume.pdf"
    assert parsed_doc.metadata.fileType == "pdf"
    assert "Senior Engineer" in parsed_doc.text

def test_parser_service_docx():
    docx_bytes = create_sample_docx_bytes("Jane Doe Resume\nExperience: Lead Developer")
    parsed_doc = ParserService.parse_resume(docx_bytes, "jane_resume.docx")

    assert parsed_doc.metadata.fileName == "jane_resume.docx"
    assert parsed_doc.metadata.fileType == "docx"
    assert "Lead Developer" in parsed_doc.text

def test_parser_service_empty_file():
    with pytest.raises(EmptyFileError) as exc_info:
        ParserService.parse_resume(b"", "empty.pdf")
    assert "empty" in str(exc_info.value).lower()

def test_parser_service_unsupported_format():
    with pytest.raises(InvalidFileTypeError) as exc_info:
        ParserService.parse_resume(b"Some text content", "notes.txt")
    assert "unsupported file format" in str(exc_info.value).lower()

def test_parser_service_file_too_large():
    # Construct bytes exceeding 10MB limit
    large_bytes = b"0" * (10 * 1024 * 1024 + 1)
    with pytest.raises(FileTooLargeError) as exc_info:
        ParserService.parse_resume(large_bytes, "large.pdf")
    assert "exceeds maximum allowed limit" in str(exc_info.value).lower()


def test_parser_service_rejects_disallowed_mime_type():
    with pytest.raises(InvalidFileTypeError) as exc_info:
        ParserService.parse_resume(b"Some text content", "resume.pdf", content_type="image/png")
    assert "unsupported content type" in str(exc_info.value).lower()


def test_parser_service_accepts_ambiguous_mime_type():
    # Some clients send octet-stream for DOCX; the extension remains authoritative.
    docx_bytes = create_sample_docx_bytes("Jane Doe Resume\nExperience: Lead Developer")
    parsed = ParserService.parse_resume(
        docx_bytes, "jane_resume.docx", content_type="application/octet-stream"
    )
    assert parsed.metadata.fileType == "docx"


def test_parser_service_accepts_parameterized_mime_type():
    # Content types can carry parameters (e.g. "application/pdf; charset=binary")
    # and must not be rejected on the raw header value.
    pdf_bytes = create_sample_pdf_bytes("Parameterized MIME type test")
    parsed = ParserService.parse_resume(
        pdf_bytes, "resume.pdf", content_type="application/pdf; charset=binary"
    )
    assert parsed.metadata.fileType == "pdf"
