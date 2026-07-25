from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.familiar import Familiar
from app.schemas.familiar import FamiliarCreate, FamiliarUpdate, FamiliarResponse
from app.services import (
    calcular_edad_completa,
    calcular_dias_para_cumple,
    obtener_emoji_estado,
    formatear_edad_texto,
)


def enrich_familiar(fam: Familiar) -> dict:
    edad = calcular_edad_completa(fam.fecha_nacimiento)
    cumple = calcular_dias_para_cumple(fam.fecha_nacimiento)
    return {
        "id": fam.id,
        "nombre_completo": fam.nombre_completo,
        "cedula": fam.cedula,
        "telefono": fam.telefono,
        "fecha_nacimiento": fam.fecha_nacimiento,
        "hora_nacimiento": fam.hora_nacimiento,
        "activo": fam.activo,
        "edad_anos": edad["anios"],
        "edad_meses": edad["meses"],
        "edad_dias": edad["dias"],
        "dias_para_cumple": cumple["dias_faltan"],
        "fecha_proximo_cumple": cumple["fecha_proximo_cumple"],
        "emoji_estado": obtener_emoji_estado(cumple["dias_faltan"]),
    }


async def get_all_familiares(db: AsyncSession) -> list:
    result = await db.execute(select(Familiar).where(Familiar.activo == 1).order_by(Familiar.id))
    familiares = result.scalars().all()
    return [enrich_familiar(f) for f in familiares]


async def get_familiar_by_id(db: AsyncSession, familiar_id: int) -> dict | None:
    result = await db.execute(select(Familiar).where(Familiar.id == familiar_id))
    fam = result.scalar_one_or_none()
    if fam:
        return enrich_familiar(fam)
    return None


async def create_familiar(db: AsyncSession, data: FamiliarCreate) -> dict:
    familiar = Familiar(**data.model_dump())
    db.add(familiar)
    await db.flush()
    await db.refresh(familiar)
    return enrich_familiar(familiar)


async def update_familiar(db: AsyncSession, familiar_id: int, data: FamiliarUpdate) -> dict | None:
    result = await db.execute(select(Familiar).where(Familiar.id == familiar_id))
    familiar = result.scalar_one_or_none()
    if not familiar:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(familiar, key, value)
    await db.flush()
    await db.refresh(familiar)
    return enrich_familiar(familiar)


async def delete_familiar(db: AsyncSession, familiar_id: int) -> bool:
    result = await db.execute(select(Familiar).where(Familiar.id == familiar_id))
    familiar = result.scalar_one_or_none()
    if not familiar:
        return False
    familiar.activo = 0
    await db.flush()
    return True
