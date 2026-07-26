from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.security.auth import get_current_user
from app.services.familiar_service import (
    get_all_familiares,
    get_familiar_by_id,
    create_familiar,
    update_familiar,
    delete_familiar,
)
from app.schemas.familiar import FamiliarCreate, FamiliarUpdate

router = APIRouter(prefix="/api/familiares", tags=["Familiares"])


@router.get("/")
async def list_familiares(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return await get_all_familiares(db)


@router.get("/{familiar_id}")
async def get_familiar(
    familiar_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    familiar = await get_familiar_by_id(db, familiar_id)
    if not familiar:
        raise HTTPException(status_code=404, detail="Familiar no encontrado")
    return familiar


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create(
    data: FamiliarCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden crear familiares")
    return await create_familiar(db, data)


@router.put("/{familiar_id}")
async def update(
    familiar_id: int,
    data: FamiliarUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden editar familiares")
    familiar = await update_familiar(db, familiar_id, data)
    if not familiar:
        raise HTTPException(status_code=404, detail="Familiar no encontrado")
    return familiar


@router.delete("/{familiar_id}")
async def delete(
    familiar_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden eliminar familiares")
    deleted = await delete_familiar(db, familiar_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Familiar no encontrado")
    return {"detail": "Familiar eliminado"}
