from sqlalchemy import Column, Integer, String, Time, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Presentado(Base):
    __tablename__ = "presentados"
    __table_args__ = {"schema": "actas"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    acta_id = Column(Integer, ForeignKey("actas_nacimiento.id"), unique=True, nullable=False)

    nombres = Column(String(100), nullable=False)
    primer_apellido = Column(String(100), nullable=False)
    segundo_apellido = Column(String(100))
    dia_nac = Column(String(5), nullable=False)
    mes_nac = Column(String(5), nullable=False)
    anio_nac = Column(String(5), nullable=False)
    sexo = Column(String(2), nullable=False)
    hora_nacimiento = Column(Time)
    am_pm = Column(String(2))

    lugar_nacimiento = Column(String(200))
    estado = Column(String(100))
    municipio = Column(String(100))
    parroquia = Column(String(100))
    direccion = Column(String(300))

    acta = relationship("ActaNacimiento", back_populates="presentado")
