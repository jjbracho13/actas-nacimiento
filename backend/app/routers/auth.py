import secrets
import string
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.security.auth import USERS_DB, verify_password, create_access_token, get_current_user, get_password_hash

router = APIRouter(prefix="/api/auth", tags=["Autenticacion"])


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = USERS_DB.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contrasena incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["username"], "role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer", "role": user["role"]}


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {"username": current_user["username"], "role": current_user["role"]}


@router.post("/forgot-password")
async def forgot_password(data: dict):
    username = data.get("username", "")
    user = USERS_DB.get(username)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    new_password = "".join(secrets.choice(string.ascii_letters + string.digits) for _ in range(10))
    user["hashed_password"] = get_password_hash(new_password)
    return {"username": username, "new_password": new_password}


@router.post("/register")
async def register(data: dict):
    username = data.get("username", "")
    password = data.get("password", "")
    role = data.get("role", "operator")
    if not username or not password:
        raise HTTPException(status_code=400, detail="Usuario y contraseña requeridos")
    if username in USERS_DB:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    USERS_DB[username] = {
        "username": username,
        "hashed_password": get_password_hash(password),
        "role": role,
    }
    return {"username": username, "role": role, "message": "Usuario creado"}
