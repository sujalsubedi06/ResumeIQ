from typing import Literal, Optional
from pydantic import BaseModel, Field

class ResumeMetadata(BaseModel):
    fileName: str = Field(..., description="Original name of the uploaded file")
    fileType: Literal["pdf", "docx"] = Field(..., description="Validated type of the file")
    pageCount: Optional[int] = Field(default=None, description="Number of pages if available")
    wordCount: int = Field(..., description="Total word count extracted")
    fileSizeBytes: int = Field(..., description="Size of the file in bytes")

class ParsedDocument(BaseModel):
    text: str = Field(..., description="Extracted plain text content")
    metadata: ResumeMetadata = Field(..., description="Extracted resume metadata")
