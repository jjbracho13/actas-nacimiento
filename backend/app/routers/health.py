from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import HTTPException, status
from app.security.auth import USERS_DB, verify_password, create_access_token

router = APIRouter(tags=["Health"])


@router.get("/api/health")
async def health():
    return {"status": "ok", "service": "actas-nacimiento-api"}
