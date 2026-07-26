from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class CertificadoMedico(Base):
    __tablename__ = "certificados_medicos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    acta_id = Column(Integer, ForeignKey("actas.actas_nacimiento.id"), unique=True, nullable=False)

    numero_certificado = Column(String(30), nullable=False)
    dia_expedicion = Column(String(5), nullable=False)
    mes_expedicion = Column(String(5), nullable=False)
    anio_expedicion = Column(String(5), nullable=False)
    nombre_centro_salud = Column(String(200), nullable=False)
    autoridad_expide = Column(String(150), nullable=False)
    numero_mpps = Column(String(30))
    direccion_centro = Column(String(300))

    acta = relationship("ActaNacimiento", back_populates="certificado")
