from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class NotaMarginal(Base):
    __tablename__ = "notas_marginales"

    id = Column(Integer, primary_key=True, autoincrement=True)
    acta_id = Column(Integer, ForeignKey("actas_nacimiento.id"), nullable=False)

    dia = Column(String(5))
    mes = Column(String(20))
    anio = Column(String(5))
    oficina_registro_civil = Column(String(200))
    quien_suscribe = Column(String(200))
    cedula_suscriptor = Column(String(30))
    resolucion_numero = Column(String(50))
    articulo_numero = Column(String(10))
    gaceta_numero = Column(String(20))
    gaceta_dia = Column(String(5))
    gaceta_mes = Column(String(20))
    gaceta_anio = Column(String(5))

    acta = relationship("ActaNacimiento", back_populates="notas_marginales")
