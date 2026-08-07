from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "ResumeIQ API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: set[str] = {"pdf", "docx"}
    ALLOWED_MIME_TYPES: set[str] = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }

    # Comma-separated list of allowed CORS origins (production)
    CORS_ORIGINS: str = "*"

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS env into a list of allowed origins."""
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
