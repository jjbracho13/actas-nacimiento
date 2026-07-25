from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Testigo(Base):
    __tablename__ = "testigos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    acta_id = Column(Integer, ForeignKey("actas_nacimiento.id"), nullable=False)
    numero_testigo = Column(Integer, nullable=False)

    nombres_apellidos = Column(String(200), nullable=False)
    cedula_identidad = Column(String(30))
    edad = Column(Integer)
    profesion_ocupacion = Column(String(150))
    nacionalidad = Column(String(50))
    comunidad_indigena = Column(String(150))
    residencia = Column(String(300))

    acta = relationship("ActaNacimiento", back_populates="testigos")
