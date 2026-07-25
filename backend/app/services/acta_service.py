from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from app.models.acta import ActaNacimiento
from app.models.registrador import RegistradorCivil
from app.models.presentado import Presentado
from app.models.certificado_medico import CertificadoMedico
from app.models.madre import Madre
from app.models.padre import Padre
from app.models.declarante import Declarante
from app.models.testigo import Testigo
from app.models.nota_marginal import NotaMarginal
from app.schemas.acta import ActaNacimientoCreate


async def get_all_actas(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(ActaNacimiento)
        .options(
            selectinload(ActaNacimiento.registrador),
            selectinload(ActaNacimiento.presentado),
        )
        .order_by(ActaNacimiento.id.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


async def get_acta_by_id(db: AsyncSession, acta_id: int):
    result = await db.execute(
        select(ActaNacimiento)
        .options(
            selectinload(ActaNacimiento.registrador),
            selectinload(ActaNacimiento.presentado),
            selectinload(ActaNacimiento.certificado),
            selectinload(ActaNacimiento.madre),
            selectinload(ActaNacimiento.padre),
            selectinload(ActaNacimiento.declarante),
            selectinload(ActaNacimiento.testigos),
            selectinload(ActaNacimiento.notas_marginales),
        )
        .where(ActaNacimiento.id == acta_id)
    )
    return result.scalar_one_or_none()


async def get_acta_by_numero(db: AsyncSession, numero_acta: str):
    result = await db.execute(
        select(ActaNacimiento)
        .options(
            selectinload(ActaNacimiento.registrador),
            selectinload(ActaNacimiento.presentado),
            selectinload(ActaNacimiento.certificado),
            selectinload(ActaNacimiento.madre),
            selectinload(ActaNacimiento.padre),
            selectinload(ActaNacimiento.declarante),
            selectinload(ActaNacimiento.testigos),
            selectinload(ActaNacimiento.notas_marginales),
        )
        .where(ActaNacimiento.numero_acta == numero_acta)
    )
    return result.scalar_one_or_none()


async def search_actas(db: AsyncSession, query: str):
    result = await db.execute(
        select(ActaNacimiento)
        .options(
            selectinload(ActaNacimiento.registrador),
            selectinload(ActaNacimiento.presentado),
        )
        .join(Presentado, ActaNacimiento.id == Presentado.acta_id)
        .where(
            or_(
                ActaNacimiento.numero_acta.ilike(f"%{query}%"),
                Presentado.nombres.ilike(f"%{query}%"),
                Presentado.primer_apellido.ilike(f"%{query}%"),
                Presentado.segundo_apellido.ilike(f"%{query}%"),
            )
        )
        .order_by(ActaNacimiento.id.desc())
    )
    return result.scalars().all()


async def create_acta_completa(db: AsyncSession, data: dict):
    acta_data = data["acta"]
    registrador_data = data.get("registrador")
    presentado_data = data.get("presentado")
    certificado_data = data.get("certificado")
    madre_data = data.get("madre")
    padre_data = data.get("padre")
    declarante_data = data.get("declarante")
    testigos_data = data.get("testigos", [])
    notas_data = data.get("notas_marginales", [])

    if registrador_data:
        reg = RegistradorCivil(**registrador_data)
        db.add(reg)
        await db.flush()
        acta_data["registrador_id"] = reg.id
    else:
        reg = None

    acta = ActaNacimiento(**acta_data)
    db.add(acta)
    await db.flush()

    if presentado_data:
        pres = Presentado(acta_id=acta.id, **presentado_data)
        db.add(pres)

    if certificado_data:
        cert = CertificadoMedico(acta_id=acta.id, **certificado_data)
        db.add(cert)

    if madre_data:
        mad = Madre(acta_id=acta.id, **madre_data)
        db.add(mad)

    if padre_data:
        pad = Padre(acta_id=acta.id, **padre_data)
        db.add(pad)

    if declarante_data:
        decl = Declarante(acta_id=acta.id, **declarante_data)
        db.add(decl)

    for i, testigo_data in enumerate(testigos_data, 1):
        testigo_data["numero_testigo"] = i
        test = Testigo(acta_id=acta.id, **testigo_data)
        db.add(test)

    for nota_data in notas_data:
        nota = NotaMarginal(acta_id=acta.id, **nota_data)
        db.add(nota)

    await db.flush()
    await db.refresh(acta)
    return await get_acta_by_id(db, acta.id)


async def delete_acta(db: AsyncSession, acta_id: int) -> bool:
    result = await db.execute(select(ActaNacimiento).where(ActaNacimiento.id == acta_id))
    acta = result.scalar_one_or_none()
    if not acta:
        return False
    await db.delete(acta)
    await db.flush()
    return True
