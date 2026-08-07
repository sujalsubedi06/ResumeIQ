from fastapi import HTTPException, status

class ResumeIQException(HTTPException):
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
    ):
        self.code = code
        self.message = message
        super().__init__(
            status_code=status_code,
            detail={"success": False, "error": {"code": code, "message": message}},
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
