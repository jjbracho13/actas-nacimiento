from pydantic import BaseModel, Field
from typing import Optional


class CertificadoMedicoBase(BaseModel):
    numero_certificado: str = Field(..., min_length=1, max_length=30)
    dia_expedicion: str = Field(..., pattern=r"^\d{1,2}$")
    mes_expedicion: str = Field(..., pattern=r"^\d{1,2}$")
    anio_expedicion: str = Field(..., pattern=r"^\d{4}$")
    nombre_centro_salud: str = Field(..., min_length=1, max_length=200)
    autoridad_expide: str = Field(..., min_length=1, max_length=150)
    numero_mpps: Optional[str] = Field(None, max_length=30)
    direccion_centro: Optional[str] = Field(None, max_length=300)


class CertificadoMedicoCreate(CertificadoMedicoBase):
    pass


class CertificadoMedicoResponse(CertificadoMedicoBase):
    id: int
    acta_id: int

    class Config:
        from_attributes = True
