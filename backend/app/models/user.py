from sqlalchemy import Column, Integer, Text, CheckConstraint
from app.database import Base


class User(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(Text, nullable=False)
    email = Column(Text, nullable=False, unique=True)
    password_hash = Column(Text, nullable=False)
    cedula = Column(Text, default="")
    cargo = Column(Text, default="")
    rol = Column(Text, default="user")
    foto_perfil = Column(Text, default="")
    activo = Column(Integer, default=1)
