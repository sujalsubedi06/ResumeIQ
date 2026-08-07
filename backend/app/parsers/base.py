from abc import ABC, abstractmethod
from app.schemas.parser import ParsedDocument

class BaseParser(ABC):
    """
    Abstract base interface for all document parsers.
    All parsers must operate strictly in-memory on raw file bytes.
    """

    @abstractmethod
    def parse(self, file_bytes: bytes, filename: str) -> ParsedDocument:
        """
        Parse raw file bytes and return a structured ParsedDocument.
        """
        pass
