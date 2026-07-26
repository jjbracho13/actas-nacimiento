from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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
    except Exception as e:
        print(f"[startup] init_db error: {e}")


@app.on_event("shutdown")
async def shutdown():
    pass


STATIC_DIRS = [
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "static"),
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist"),
]
FRONTEND_DIR = None
for d in STATIC_DIRS:
    if os.path.isdir(d) and os.path.isfile(os.path.join(d, "index.html")):
        FRONTEND_DIR = d
        break
if FRONTEND_DIR:
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="static")
