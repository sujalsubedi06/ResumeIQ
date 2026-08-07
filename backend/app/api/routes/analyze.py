from typing import Optional
from fastapi import APIRouter, File, Form, UploadFile
from app.core.exceptions import AnalysisFailedError, ResumeIQException
from app.core.logging import logger
from app.schemas.analysis import AnalysisReport
from app.services.analysis_service import AnalysisService
from app.services.parser_service import ParserService

router = APIRouter()

@router.post("/analyze", tags=["Analysis"])
async def analyze_resume(
    resume: UploadFile = File(..., description="Uploaded resume file (PDF or DOCX)"),
    job_description: Optional[str] = Form(None, description="Optional target job description text"),
):
    filename = resume.filename or "resume.pdf"
    file_bytes = await resume.read()

    # 1. Parse Document (in-memory, no persistence)
    parsed_doc = ParserService.parse_resume(file_bytes=file_bytes, filename=filename)

    # 2. Run Analysis Engine
    report: AnalysisReport = AnalysisService.analyze_document(
        parsed_doc=parsed_doc,
        job_description=job_description,
    )

    return {
        "success": True,
        "data": report.model_dump(),
    }
