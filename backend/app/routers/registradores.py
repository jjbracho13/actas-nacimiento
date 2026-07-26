from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.security.auth import get_current_user
from app.models.registrador import RegistradorCivil
from app.schemas.registrador import RegistradorCivilCreate, RegistradorCivilResponse

router = APIRouter(prefix="/api/registradores", tags=["Registradores Civiles"])


@router.get("/")
async def list_registradores(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(select(RegistradorCivil))
    return result.scalars().all()


@router.get("/{registrador_id}")
async def get_registrador(
    registrador_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(select(RegistradorCivil).where(RegistradorCivil.id == registrador_id))
    reg = result.scalar_one_or_none()
    if not reg:
        raise HTTPException(status_code=404, detail="Registrador no encontrado")
    return reg


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_registrador(
    data: RegistradorCivilCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden crear registradores")
    reg = RegistradorCivil(**data.model_dump())
    db.add(reg)
    await db.flush()
    await db.refresh(reg)
    return reg


@router.put("/{registrador_id}")
async def update_registrador(
    registrador_id: int,
    data: RegistradorCivilCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden editar registradores")
    result = await db.execute(select(RegistradorCivil).where(RegistradorCivil.id == registrador_id))
    reg = result.scalar_one_or_none()
    if not reg:
        raise HTTPException(status_code=404, detail="Registrador no encontrado")
    for key, value in data.model_dump().items():
        setattr(reg, key, value)
    await db.flush()
    await db.refresh(reg)
    return reg
