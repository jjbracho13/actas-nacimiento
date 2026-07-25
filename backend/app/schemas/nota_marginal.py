from pydantic import BaseModel, Field
from typing import Optional


class NotaMarginalCreate(BaseModel):
    dia: Optional[str] = Field(None, max_length=5)
    mes: Optional[str] = Field(None, max_length=20)
    anio: Optional[str] = Field(None, max_length=5)
    oficina_registro_civil: Optional[str] = Field(None, max_length=200)
    quien_suscribe: Optional[str] = Field(None, max_length=200)
    cedula_suscriptor: Optional[str] = Field(None, max_length=30)
    resolucion_numero: Optional[str] = Field(None, max_length=50)
    articulo_numero: Optional[str] = Field(None, max_length=10)
    gaceta_numero: Optional[str] = Field(None, max_length=20)
    gaceta_dia: Optional[str] = Field(None, max_length=5)
    gaceta_mes: Optional[str] = Field(None, max_length=20)
    gaceta_anio: Optional[str] = Field(None, max_length=5)


class NotaMarginalResponse(NotaMarginalCreate):
    id: int
    acta_id: int

    class Config:
        from_attributes = True
