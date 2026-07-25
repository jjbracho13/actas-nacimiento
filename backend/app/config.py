import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./actas_nacimiento.db",
)
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Parse CORS_ORIGINS
cors_raw = os.getenv("CORS_ORIGINS", "")
if cors_raw:
    import json
    try:
        CORS_ORIGINS = json.loads(cors_raw)
    except json.JSONDecodeError:
        CORS_ORIGINS = [u.strip() for u in cors_raw.split(",")]
else:
    CORS_ORIGINS = ["http://localhost:3000", "http://localhost:5173"]

# Fix Render PostgreSQL URL
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgresql://") and "asyncpg" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)


class _Settings:
    DATABASE_URL = DATABASE_URL
    SECRET_KEY = SECRET_KEY
    ALGORITHM = ALGORITHM
    ACCESS_TOKEN_EXPIRE_MINUTES = ACCESS_TOKEN_EXPIRE_MINUTES
    CORS_ORIGINS = CORS_ORIGINS


settings = _Settings()
