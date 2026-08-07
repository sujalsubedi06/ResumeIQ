from app.core.exceptions import InvalidFileTypeError
from app.parsers.base import BaseParser
from app.parsers.docx_parser import DOCXParser
from app.parsers.pdf_parser import PDFParser

class ParserFactory:
    @staticmethod
    def get_parser(filename: str) -> BaseParser:
        ext = filename.split(".")[-1].lower() if "." in filename else ""
        if ext == "pdf":
            return PDFParser()
        elif ext == "docx":
            return DOCXParser()
        else:
            raise InvalidFileTypeError(f"Unsupported file format '.{ext}'. Only PDF and DOCX files are allowed.")
