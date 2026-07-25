from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime


class FamiliarCreate(BaseModel):
    nombre_completo: str = Field(..., min_length=1, max_length=200)
    cedula: Optional[str] = Field(None, max_length=30)
    telefono: Optional[str] = Field(None, max_length=20)
    fecha_nacimiento: date
    hora_nacimiento: Optional[str] = Field(None, max_length=10)


class FamiliarUpdate(BaseModel):
    nombre_completo: Optional[str] = Field(None, min_length=1, max_length=200)
    cedula: Optional[str] = Field(None, max_length=30)
    telefono: Optional[str] = Field(None, max_length=20)
    fecha_nacimiento: Optional[date]
    hora_nacimiento: Optional[str] = Field(None, max_length=10)
    activo: Optional[int] = Field(None, ge=0, le=1)


class FamiliarResponse(BaseModel):
    id: int
    nombre_completo: str
    cedula: Optional[str]
    telefono: Optional[str]
    fecha_nacimiento: date
    hora_nacimiento: Optional[str]
    activo: int
    edad_anos: int = 0
    edad_meses: int = 0
    edad_dias: int = 0
    dias_para_cumple: int = 0
    fecha_proximo_cumple: Optional[date] = None
    emoji_estado: str = ""

    class Config:
        from_attributes = True
