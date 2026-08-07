from app.core.config import settings
from app.core.exceptions import EmptyFileError, FileTooLargeError, InvalidFileTypeError, ParseFailedError
from app.core.logging import logger
from app.parsers.factory import ParserFactory
from app.schemas.parser import ParsedDocument

class ParserService:
    @staticmethod
    def parse_resume(file_bytes: bytes, filename: str) -> ParsedDocument:
        """
        Validate raw upload bytes and parse into a ParsedDocument without disk persistence.
        """
        if not file_bytes or len(file_bytes) == 0:
            raise EmptyFileError("Uploaded resume file is empty.")

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
