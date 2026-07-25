import os
import json
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./actas_nacimiento.db"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    CORS_ORIGINS: str = "[]"

    class Config:
        extra = "allow"


settings = Settings()

# Override from env vars explicitly
settings.DATABASE_URL = os.getenv("DATABASE_URL", settings.DATABASE_URL)
settings.SECRET_KEY = os.getenv("SECRET_KEY", settings.SECRET_KEY)

# Parse CORS_ORIGINS from env var
cors_raw = os.getenv("CORS_ORIGINS", "")
if cors_raw:
    try:
        settings.CORS_ORIGINS = json.loads(cors_raw)
    except json.JSONDecodeError:
        settings.CORS_ORIGINS = [u.strip() for u in cors_raw.split(",")]
else:
    settings.CORS_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]

# Fix Render PostgreSQL URL (postgres:// → postgresql+asyncpg://)
if settings.DATABASE_URL.startswith("postgres://"):
    settings.DATABASE_URL = settings.DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif settings.DATABASE_URL.startswith("postgresql://") and "asyncpg" not in settings.DATABASE_URL:
    settings.DATABASE_URL = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
