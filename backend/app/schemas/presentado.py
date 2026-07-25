from pydantic import BaseModel, Field
from typing import Optional
from datetime import time


class PresentadoBase(BaseModel):
    nombres: str = Field(..., min_length=1, max_length=100)
    primer_apellido: str = Field(..., min_length=1, max_length=100)
    segundo_apellido: Optional[str] = Field(None, max_length=100)
    dia_nac: str = Field(..., pattern=r"^\d{1,2}$")
    mes_nac: str = Field(..., pattern=r"^\d{1,2}$")
    anio_nac: str = Field(..., pattern=r"^\d{4}$")
    sexo: str = Field(..., pattern=r"^[MF]$")
    hora_nacimiento: Optional[time] = None
    am_pm: Optional[str] = Field(None, pattern=r"^(AM|PM)$")
    lugar_nacimiento: Optional[str] = Field(None, max_length=200)
    estado: Optional[str] = Field(None, max_length=100)
    municipio: Optional[str] = Field(None, max_length=100)
    parroquia: Optional[str] = Field(None, max_length=100)
    direccion: Optional[str] = Field(None, max_length=300)


class PresentadoCreate(PresentadoBase):
    pass


class PresentadoResponse(PresentadoBase):
    id: int
    acta_id: int

    class Config:
        from_attributes = True
