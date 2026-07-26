from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ActaNacimiento(Base):
    __tablename__ = "actas_nacimiento"
    __table_args__ = {"schema": "actas"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    numero_acta = Column(String(20), unique=True, nullable=False, index=True)
    fecha_dia = Column(String(5), nullable=False)
    fecha_mes = Column(String(5), nullable=False)
    fecha_anio = Column(String(5), nullable=False)

    tipo_inscripcion = Column(String(50), default="REGISTRO DE NACIMIENTO")
    es_reconocimiento = Column(Boolean, default=False)
    es_insercion = Column(Boolean, default=False)

    registrador_id = Column(Integer, ForeignKey("registradores_civil.id"), nullable=False)
    resolucion_numero = Column(String(50))
    resolucion_dia = Column(String(5))
    resolucion_mes = Column(String(5))
    resolucion_anio = Column(String(5))
    gaceta_municipal = Column(String(50))
    gaceta_dia = Column(String(5))
    gaceta_mes = Column(String(5))
    gaceta_anio = Column(String(5))

    circunstancias_especiales = Column(Text)
    documentos_presentados = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    registrador = relationship("RegistradorCivil", back_populates="actas")
    presentado = relationship("Presentado", back_populates="acta", uselist=False)
    certificado = relationship("CertificadoMedico", back_populates="acta", uselist=False)
    madre = relationship("Madre", back_populates="acta", uselist=False)
    padre = relationship("Padre", back_populates="acta", uselist=False)
    declarante = relationship("Declarante", back_populates="acta", uselist=False)
    testigos = relationship("Testigo", back_populates="acta")
    notas_marginales = relationship("NotaMarginal", back_populates="acta")
