import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    app_name: str = "EcoSort Backend API"
    app_version: str = "1.0.0"
    app_env: str = "development"
    database_url: Optional[str] = None
    frontend_origin: str = "http://localhost:5173"
    admin_secret_key: str = "dev-admin-secret-change-in-production"
    allow_demo_admin: bool = True
    max_upload_size_bytes: int = 5 * 1024 * 1024  # 5 MB

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() in ("production", "prod")

    @property
    def resolved_database_url(self) -> str:
        url = self.database_url or os.getenv("DATABASE_URL", "")
        if url:
            # Fix legacy Heroku/Render/Supabase style url 'postgres://' -> 'postgresql://'
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql://", 1)
            return url

        # If production and no database url is specified, fail explicitly as required
        if self.is_production:
            raise ValueError(
                "DATABASE_URL must be set in production. EcoSort requires a hosted PostgreSQL database (e.g. Neon or Supabase)."
            )

        # Development fallback
        return "sqlite:///./ecosort_dev.db"


settings = Settings()
