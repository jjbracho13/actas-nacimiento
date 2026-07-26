from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args=connect_args,
)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass

Base.metadata.schema = "actas"


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
    try:
        async with engine.begin() as conn:
            await conn.execute(text("CREATE SCHEMA IF NOT EXISTS actas"))
            await conn.commit()
    except Exception as e:
        import traceback
        print(f"[init_db] schema error: {e}")
        traceback.print_exc()

    try:
        async with engine.begin() as conn:
            from app.models import (
                ActaNacimiento, RegistradorCivil, Presentado,
                CertificadoMedico, Madre, Padre, Declarante,
                Testigo, NotaMarginal, Familiar, User,
            )
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        import traceback
        print(f"[init_db] create_all error: {e}")
        traceback.print_exc()
        return

    try:
        async with async_session() as session:
            from app.security.auth import get_password_hash
            result = await session.execute(select(func.count()).select_from(User))
            count = result.scalar()
            if count == 0:
                users = [
                    User(
                        nombre="Admin",
                        email="javierbracho13@hotmail.com",
                        password_hash=get_password_hash("Proagro21."),
                        role="admin",
                        activo=1,
                    ),
                    User(
                        nombre="Operator",
                        email="javierbracho13@gmail.com",
                        password_hash=get_password_hash("Proagro21."),
                        role="user",
                        activo=1,
                    ),
                ]
                session.add_all(users)
                await session.commit()
    except Exception as e:
        import traceback
        print(f"[init_db] seed error: {e}")
        traceback.print_exc()
