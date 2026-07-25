from app.routers.auth import router as auth_router
from app.routers.actas import router as actas_router
from app.routers.registradores import router as registradores_router
from app.routers.familiares import router as familiares_router
from app.routers.health import router as health_router

__all__ = [
    "auth_router",
    "actas_router",
    "registradores_router",
    "familiares_router",
    "health_router",
]
