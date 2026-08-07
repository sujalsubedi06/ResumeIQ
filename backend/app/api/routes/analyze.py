import os
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.core.config import settings
from app.core.exceptions import (
    AnalysisFailedError,
    FileTooLargeError,
    ResumeIQException,
)
from app.core.logging import logger
from app.core.rate_limit import enforce_rate_limit
from app.schemas.analysis import AnalysisReport
from app.services.analysis_service import AnalysisService
from app.services.parser_service import ParserService

router = APIRouter()

# Hard cap on the bytes buffered from a single upload. UploadFile.read(size)
# stops at `size`, so a client streaming more than this is rejected without
# the payload ever being fully read into memory (prevents memory-exhaustion
# DoS from unbounded uploads).
MAX_UPLOAD_BYTES = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024


def _safe_filename(filename: str) -> str:
    """Return a log/error-safe basename for a user-supplied filename.

    Strips directory components (defends against path-traversal attempts in
    filenames), removes control characters (defends against log injection),
    and truncates so log lines stay bounded.
    """
    basename = os.path.basename(filename.replace("\\", "/")).strip()
    safe = "".join(ch for ch in basename if ch.isprintable())[:120]
    return safe or "resume"


@router.post("/analyze", tags=["Analysis"])
async def analyze_resume(
    resume: UploadFile = File(..., description="Uploaded resume file (PDF or DOCX)"),
    job_description: Optional[str] = Form(None, description="Optional target job description text"),
    _rate_limit: None = Depends(enforce_rate_limit),
):
    filename = _safe_filename(resume.filename or "resume.pdf")
    file_bytes = await resume.read(MAX_UPLOAD_BYTES + 1)

    if len(file_bytes) > MAX_UPLOAD_BYTES:
        raise FileTooLargeError(
            f"File size exceeds maximum allowed limit of {settings.MAX_UPLOAD_SIZE_MB} MB."
        )

    try:
        # 1. Parse Document (in-memory, no persistence)
        parsed_doc = ParserService.parse_resume(
            file_bytes=file_bytes,
            filename=filename,
            content_type=resume.content_type,
        )

        # 2. Run Analysis Engine
        report: AnalysisReport = AnalysisService.analyze_document(
            parsed_doc=parsed_doc,
            job_description=job_description,
        )

        return {
            "success": True,
            "data": report.model_dump(),
        }
    except ResumeIQException:
        raise
    except Exception as e:
        logger.error(f"Analysis failed for '{filename}': {e}", exc_info=True)
        # Never surface internal exception details to clients — log them above
        # and return a generic, actionable message instead.
        raise AnalysisFailedError(
            "Failed to analyze resume. Please ensure the file is a valid PDF or DOCX and try again."
        )
