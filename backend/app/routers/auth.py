import secrets
import string
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.security.auth import (
    verify_password,
    create_access_token,
    get_current_user,
    get_password_hash,
    get_user_by_email,
    create_user,
)

router = APIRouter(prefix="/api/auth", tags=["Autenticacion"])


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contrasena incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario desactivado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    role = user.role if user.role == "admin" else "operator"
    access_token = create_access_token(data={"sub": user.email, "role": role})
    return {"access_token": access_token, "token_type": "bearer", "role": role}


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.post("/forgot-password")
async def forgot_password(data: dict, db: AsyncSession = Depends(get_db)):
    email = data.get("email", "")
    user = await get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="Correo no encontrado")
    new_password = "".join(secrets.choice(string.ascii_letters + string.digits) for _ in range(10))
    user.password_hash = get_password_hash(new_password)
    await db.flush()
    return {"email": email, "new_password": new_password}


@router.post("/register")
async def register(data: dict, db: AsyncSession = Depends(get_db)):
    email = data.get("email", "")
    password = data.get("password", "")
    nombre = data.get("nombre", email.split("@")[0])
    rol = data.get("role", "operator")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Correo y contrasena requeridos")
    existing = await get_user_by_email(db, email)
    if existing:
        raise HTTPException(status_code=400, detail="El correo ya esta registrado")
    db_role = "admin" if rol == "admin" else "user"
    user = await create_user(db, email, password, nombre, db_role)
    return {
        "id": user.id,
        "email": user.email,
        "nombre": user.nombre,
        "role": user.role,
        "message": "Usuario creado exitosamente",
    }
