import os
import ssl
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
elif "asyncpg" in settings.DATABASE_URL:
    connect_args = {"ssl": "require"}

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args=connect_args,
)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    async with engine.begin() as conn:
        from app.models import (
            ActaNacimiento, RegistradorCivil, Presentado,
            CertificadoMedico, Madre, Padre, Declarante,
            Testigo, NotaMarginal, Familiar,
        )
        await conn.run_sync(Base.metadata.create_all)
