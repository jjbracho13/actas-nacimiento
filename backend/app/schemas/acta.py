from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


class ActaNacimientoCreate(BaseModel):
    numero_acta: str = Field(..., min_length=1, max_length=20)
    fecha_dia: str = Field(..., pattern=r"^\d{1,2}$")
    fecha_mes: str = Field(..., pattern=r"^\d{1,2}$")
    fecha_anio: str = Field(..., pattern=r"^\d{4}$")
    tipo_inscripcion: str = "REGISTRO DE NACIMIENTO"
    es_reconocimiento: bool = False
    es_insercion: bool = False
    resolucion_numero: Optional[str] = Field(None, max_length=50)
    resolucion_dia: Optional[str] = Field(None, max_length=5)
    resolucion_mes: Optional[str] = Field(None, max_length=5)
    resolucion_anio: Optional[str] = Field(None, max_length=5)
    gaceta_municipal: Optional[str] = Field(None, max_length=50)
    gaceta_dia: Optional[str] = Field(None, max_length=5)
    gaceta_mes: Optional[str] = Field(None, max_length=5)
    gaceta_anio: Optional[str] = Field(None, max_length=5)
    circunstancias_especiales: Optional[str] = None
    documentos_presentados: Optional[str] = None

    registrador_id: int


class ActaNacimientoResponse(BaseModel):
    id: int
    numero_acta: str
    fecha_dia: str
    fecha_mes: str
    fecha_anio: str
    tipo_inscripcion: str
    es_reconocimiento: bool
    es_insercion: bool
    registrador_id: int
    resolucion_numero: Optional[str]
    resolucion_dia: Optional[str]
    resolucion_mes: Optional[str]
    resolucion_anio: Optional[str]
    gaceta_municipal: Optional[str]
    gaceta_dia: Optional[str]
    gaceta_mes: Optional[str]
    gaceta_anio: Optional[str]
    circunstancias_especiales: Optional[str]
    documentos_presentados: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ActaNacimientoCompleta(BaseModel):
    acta: ActaNacimientoResponse
    registrador: Optional["RegistradorResponse"] = None
    presentado: Optional["PresentadoResponse"] = None
    certificado: Optional["CertificadoMedicoResponse"] = None
    madre: Optional["MadreResponse"] = None
    padre: Optional["PadreResponse"] = None
    declarante: Optional["DeclaranteResponse"] = None
    testigos: List["TestigoResponse"] = []
    notas_marginales: List["NotaMarginalResponse"] = []

    class Config:
        from_attributes = True


class RegistradorResponse(BaseModel):
    id: int
    nombres: str
    apellidos: str
    documento_identidad: str
    oficina_registro_civil: str

    class Config:
        from_attributes = True


class PresentadoResponse(BaseModel):
    id: int
    nombres: str
    primer_apellido: str
    segundo_apellido: Optional[str]
    dia_nac: str
    mes_nac: str
    anio_nac: str
    sexo: str
    hora_nacimiento: Optional[datetime]
    am_pm: Optional[str]
    lugar_nacimiento: Optional[str]
    estado: Optional[str]
    municipio: Optional[str]
    parroquia: Optional[str]
    direccion: Optional[str]

    class Config:
        from_attributes = True


class CertificadoMedicoResponse(BaseModel):
    id: int
    numero_certificado: str
    dia_expedicion: str
    mes_expedicion: str
    anio_expedicion: str
    nombre_centro_salud: str
    autoridad_expide: str
    numero_mpps: Optional[str]
    direccion_centro: Optional[str]

    class Config:
        from_attributes = True


class MadreResponse(BaseModel):
    id: int
    nombres: str
    primer_apellido: str
    segundo_apellido: Optional[str]
    documento_identidad: Optional[str]
    tiene_cedula: bool
    tiene_pasaporte: bool
    tiene_otro: bool
    edad: Optional[int]
    nacionalidad: Optional[str]
    profesion_ocupacion: Optional[str]
    comunidad_indigena: Optional[str]
    residencia: Optional[str]
    es_declarante: bool

    class Config:
        from_attributes = True


class PadreResponse(BaseModel):
    id: int
    nombres: str
    primer_apellido: str
    segundo_apellido: Optional[str]
    documento_identidad: Optional[str]
    tiene_cedula: bool
    tiene_pasaporte: bool
    tiene_otro: bool
    edad: Optional[int]
    nacionalidad: Optional[str]
    profesion_ocupacion: Optional[str]
    comunidad_indigena: Optional[str]
    residencia: Optional[str]
    es_declarante: bool

    class Config:
        from_attributes = True


class DeclaranteResponse(BaseModel):
    id: int
    nombres_apellidos: Optional[str]
    caracter_actua: Optional[str]
    documento_identidad: Optional[str]
    tiene_cedula: bool
    tiene_pasaporte: bool
    tiene_otro: bool
    edad: Optional[int]
    nacionalidad: Optional[str]
    profesion_ocupacion: Optional[str]
    comunidad_indigena: Optional[str]
    residencia: Optional[str]

    class Config:
        from_attributes = True


class TestigoResponse(BaseModel):
    id: int
    numero_testigo: int
    nombres_apellidos: str
    cedula_identidad: Optional[str]
    edad: Optional[int]
    profesion_ocupacion: Optional[str]
    nacionalidad: Optional[str]
    comunidad_indigena: Optional[str]
    residencia: Optional[str]

    class Config:
        from_attributes = True


class NotaMarginalResponse(BaseModel):
    id: int
    dia: Optional[str]
    mes: Optional[str]
    anio: Optional[str]
    oficina_registro_civil: Optional[str]
    quien_suscribe: Optional[str]
    cedula_suscriptor: Optional[str]
    resolucion_numero: Optional[str]
    articulo_numero: Optional[str]
    gaceta_numero: Optional[str]
    gaceta_dia: Optional[str]
    gaceta_mes: Optional[str]
    gaceta_anio: Optional[str]

    class Config:
        from_attributes = True


ActaNacimientoCompleta.model_rebuild()
