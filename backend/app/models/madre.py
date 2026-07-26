from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Madre(Base):
    __tablename__ = "madres"
    __table_args__ = {"schema": "actas"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    acta_id = Column(Integer, ForeignKey("actas_nacimiento.id"), unique=True, nullable=False)

    nombres = Column(String(100), nullable=False)
    primer_apellido = Column(String(100), nullable=False)
    segundo_apellido = Column(String(100))
    documento_identidad = Column(String(30))
    tiene_cedula = Column(Boolean, default=False)
    tiene_pasaporte = Column(Boolean, default=False)
    tiene_otro = Column(Boolean, default=False)
    edad = Column(Integer)
    nacionalidad = Column(String(50))
    profesion_ocupacion = Column(String(150))
    comunidad_indigena = Column(String(150))
    residencia = Column(String(300))
    es_declarante = Column(Boolean, default=False)

    acta = relationship("ActaNacimiento", back_populates="madre")
