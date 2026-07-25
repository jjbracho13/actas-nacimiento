from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.config import settings
from app.database import init_db
from app.routers import (
    auth_router,
    actas_router,
    registradores_router,
    familiares_router,
    health_router,
)
import os

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="API Actas de Nacimiento",
    description="Sistema de gestion de actas de nacimiento",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(actas_router)
app.include_router(registradores_router)
app.include_router(familiares_router)
app.include_router(health_router)


@app.on_event("startup")
async def startup():
    try:
        await init_db()
    except Exception:
        pass


@app.on_event("shutdown")
async def shutdown():
    pass


FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "static")
if os.path.isdir(FRONTEND_DIR):
    assets_dir = os.path.join(FRONTEND_DIR, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/spa/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(FRONTEND_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
