from pydantic import BaseModel, Field
from typing import Optional


class TestigoCreate(BaseModel):
    numero_testigo: int = Field(..., ge=1, le=2)
    nombres_apellidos: str = Field(..., min_length=1, max_length=200)
    cedula_identidad: Optional[str] = Field(None, max_length=30)
    edad: Optional[int] = Field(None, ge=0, le=150)
    profesion_ocupacion: Optional[str] = Field(None, max_length=150)
    nacionalidad: Optional[str] = Field(None, max_length=50)
    comunidad_indigena: Optional[str] = Field(None, max_length=150)
    residencia: Optional[str] = Field(None, max_length=300)


class TestigoResponse(TestigoCreate):
    id: int
    acta_id: int

    class Config:
        from_attributes = True
