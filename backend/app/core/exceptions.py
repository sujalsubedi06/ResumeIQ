from typing import Dict, Optional

from fastapi import HTTPException, status

class ResumeIQException(HTTPException):
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        headers: Optional[Dict[str, str]] = None,
    ):
        self.code = code
        self.message = message
        self.headers = headers
        super().__init__(
            status_code=status_code,
            detail={"success": False, "error": {"code": code, "message": message}},
            headers=headers,
        )

class InvalidFileTypeError(ResumeIQException):
    def __init__(self, message: str = "Only PDF and DOCX files are supported."):
        super().__init__(
            code="INVALID_FILE_TYPE",
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

class FileTooLargeError(ResumeIQException):
    def __init__(self, message: str = "File size exceeds the 10 MB limit."):
        super().__init__(
            code="FILE_TOO_LARGE",
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

class EmptyFileError(ResumeIQException):
    def __init__(self, message: str = "Uploaded file is empty."):
        super().__init__(
            code="EMPTY_FILE",
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

class ParseFailedError(ResumeIQException):
    def __init__(self, message: str = "Failed to extract text from document."):
        super().__init__(
            code="PARSE_FAILED",
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        )

class AnalysisFailedError(ResumeIQException):
    def __init__(self, message: str = "Resume analysis processing failed."):
        super().__init__(
            code="ANALYSIS_FAILED",
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

class RateLimitExceededError(ResumeIQException):
    def __init__(
        self,
        message: str = "Too many requests. Please wait a moment and try again.",
        retry_after_seconds: int = 60,
    ):
        super().__init__(
            code="RATE_LIMITED",
            message=message,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            headers={"Retry-After": str(retry_after_seconds)},
        )
