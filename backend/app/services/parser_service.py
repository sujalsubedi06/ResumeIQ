from typing import Optional

from app.core.config import settings
from app.core.exceptions import EmptyFileError, FileTooLargeError, InvalidFileTypeError, ParseFailedError
from app.core.logging import logger
from app.parsers.factory import ParserFactory
from app.schemas.parser import ParsedDocument

# Content types that are ambiguous over the wire. Some clients send
# application/octet-stream or application/zip for DOCX files (a zip archive),
# so these are accepted — the file extension remains authoritative.
_AMBIGUOUS_MIME_TYPES = {
    "application/octet-stream",
    "application/zip",
    "binary/octet-stream",
    "",
}


class ParserService:
    @staticmethod
    def parse_resume(
        file_bytes: bytes,
        filename: str,
        content_type: Optional[str] = None,
    ) -> ParsedDocument:
        """
        Validate raw upload bytes and parse into a ParsedDocument without disk persistence.
        """
        if not file_bytes or len(file_bytes) == 0:
            raise EmptyFileError("Uploaded resume file is empty.")

        # Defense in depth: reject obviously mismatched content types while
        # allowing ambiguous ones, since the extension drives the parser.
        if content_type is not None:
            # Strip parameters (e.g. "application/pdf; charset=binary") so a
            # valid file sent with extra header params is never rejected.
            base_type = content_type.split(";")[0].strip().lower()
            if base_type not in _AMBIGUOUS_MIME_TYPES and base_type not in settings.ALLOWED_MIME_TYPES:
                raise InvalidFileTypeError(
                    f"Unsupported content type '{content_type}'. Only PDF and DOCX files are allowed."
                )

        max_size_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if len(file_bytes) > max_size_bytes:
            raise FileTooLargeError(
                f"File size ({len(file_bytes) / (1024 * 1024):.2f} MB) exceeds maximum allowed limit of {settings.MAX_UPLOAD_SIZE_MB} MB."
            )

        parser = ParserFactory.get_parser(filename)
        parsed_doc = parser.parse(file_bytes, filename)

        if not parsed_doc.text or len(parsed_doc.text.strip()) == 0:
            raise ParseFailedError(f"No extractable text found in resume document '{filename}'.")

        logger.info(
            f"Successfully parsed resume '{filename}' ({parsed_doc.metadata.fileType.upper()}): "
            f"{parsed_doc.metadata.wordCount} words extracted, size {parsed_doc.metadata.fileSizeBytes} bytes."
        )

        return parsed_doc
