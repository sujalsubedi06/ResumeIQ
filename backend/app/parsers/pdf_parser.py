import fitz  # PyMuPDF
from app.core.exceptions import ParseFailedError
from app.core.logging import logger
from app.parsers.base import BaseParser
from app.schemas.parser import ParsedDocument, ResumeMetadata

class PDFParser(BaseParser):
    def parse(self, file_bytes: bytes, filename: str) -> ParsedDocument:
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            page_count = len(doc)
            full_text_list = []

            for page_num in range(page_count):
                page = doc.load_page(page_num)
                page_text = page.get_text("text")
                if page_text:
                    full_text_list.append(page_text.strip())

            doc.close()

            full_text = "\n\n".join(full_text_list)
            word_count = len(full_text.split())

            metadata = ResumeMetadata(
                fileName=filename,
                fileType="pdf",
                pageCount=page_count,
                wordCount=word_count,
                fileSizeBytes=len(file_bytes),
            )

            return ParsedDocument(text=full_text, metadata=metadata)
        except Exception as e:
            logger.error(f"PDF parsing error for file {filename}: {str(e)}")
            raise ParseFailedError(f"Failed to parse PDF document '{filename}': {str(e)}")
