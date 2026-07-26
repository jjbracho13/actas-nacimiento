from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class RegistradorCivil(Base):
    __tablename__ = "registradores_civil"
    __table_args__ = {"schema": "actas"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    documento_identidad = Column(String(30), nullable=False)
    oficina_registro_civil = Column(String(150), nullable=False)

    actas = relationship("ActaNacimiento", back_populates="registrador")
