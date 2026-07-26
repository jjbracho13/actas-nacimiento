from sqlalchemy import Column, Integer, String, Date, DateTime, func
from app.database import Base


class Familiar(Base):
    __tablename__ = "familiares"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre_completo = Column(String(200), nullable=False)
    cedula = Column(String(30))
    telefono = Column(String(20))
    fecha_nacimiento = Column(Date, nullable=False)
    hora_nacimiento = Column(String(10))
    activo = Column(Integer, default=1)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
