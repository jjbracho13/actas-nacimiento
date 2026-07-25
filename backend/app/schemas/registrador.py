from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime


class RegistradorCivilBase(BaseModel):
    nombres: str = Field(..., min_length=1, max_length=100)
    apellidos: str = Field(..., min_length=1, max_length=100)
    documento_identidad: str = Field(..., min_length=1, max_length=30)
    oficina_registro_civil: str = Field(..., min_length=1, max_length=150)


class RegistradorCivilCreate(RegistradorCivilBase):
    pass


class RegistradorCivilResponse(RegistradorCivilBase):
    id: int

    class Config:
        from_attributes = True
