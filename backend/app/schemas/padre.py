from pydantic import BaseModel, Field
from typing import Optional


class PadreCreate(BaseModel):
    nombres: str = Field(..., min_length=1, max_length=100)
    primer_apellido: str = Field(..., min_length=1, max_length=100)
    segundo_apellido: Optional[str] = Field(None, max_length=100)
    documento_identidad: Optional[str] = Field(None, max_length=30)
    tiene_cedula: bool = False
    tiene_pasaporte: bool = False
    tiene_otro: bool = False
    edad: Optional[int] = Field(None, ge=0, le=150)
    nacionalidad: Optional[str] = Field(None, max_length=50)
    profesion_ocupacion: Optional[str] = Field(None, max_length=150)
    comunidad_indigena: Optional[str] = Field(None, max_length=150)
    residencia: Optional[str] = Field(None, max_length=300)
    es_declarante: bool = False


class PadreResponse(PadreCreate):
    id: int
    acta_id: int

    class Config:
        from_attributes = True
