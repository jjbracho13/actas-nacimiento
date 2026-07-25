from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.security.auth import get_current_user
from app.services.acta_service import (
    get_all_actas,
    get_acta_by_id,
    get_acta_by_numero,
    search_actas,
    create_acta_completa,
    delete_acta,
)
from app.pdf.generator import generate_acta_pdf
from fastapi.responses import Response

router = APIRouter(prefix="/api/actas", tags=["Actas de Nacimiento"])


@router.get("/")
async def list_actas(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    actas = await get_all_actas(db, skip=skip, limit=limit)
    return actas


@router.get("/search")
async def search(
    q: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    actas = await search_actas(db, q)
    return actas


@router.get("/numero/{numero_acta}")
async def get_by_numero(
    numero_acta: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    acta = await get_acta_by_numero(db, numero_acta)
    if not acta:
        raise HTTPException(status_code=404, detail="Acta no encontrada")
    return acta


@router.get("/{acta_id}")
async def get_acta(
    acta_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    acta = await get_acta_by_id(db, acta_id)
    if not acta:
        raise HTTPException(status_code=404, detail="Acta no encontrada")
    return acta


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_acta(
    data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    acta = await create_acta_completa(db, data)
    return acta


@router.delete("/{acta_id}")
async def delete(
    acta_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")
    deleted = await delete_acta(db, acta_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Acta no encontrada")
    return {"detail": "Acta eliminada"}


@router.get("/{acta_id}/pdf")
async def download_pdf(
    acta_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    acta = await get_acta_by_id(db, acta_id)
    if not acta:
        raise HTTPException(status_code=404, detail="Acta no encontrada")
    pdf_bytes = generate_acta_pdf(acta)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="acta_nacimiento_{acta.numero_acta}.pdf"'
        },
    )
