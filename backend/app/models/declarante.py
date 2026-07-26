from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Declarante(Base):
    __tablename__ = "declarantes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    acta_id = Column(Integer, ForeignKey("actas.actas_nacimiento.id"), unique=True, nullable=False)

    nombres_apellidos = Column(String(200))
    caracter_actua = Column(String(100))
    documento_identidad = Column(String(30))
    tiene_cedula = Column(Boolean, default=False)
    tiene_pasaporte = Column(Boolean, default=False)
    tiene_otro = Column(Boolean, default=False)
    edad = Column(Integer)
    nacionalidad = Column(String(50))
    profesion_ocupacion = Column(String(150))
    comunidad_indigena = Column(String(150))
    residencia = Column(String(300))

    acta = relationship("ActaNacimiento", back_populates="declarante")
