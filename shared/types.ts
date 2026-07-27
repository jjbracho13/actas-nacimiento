export interface User {
  username: string;
  email?: string;
  role: 'admin' | 'operator' | string;
}

export interface ActaNacimiento {
  id: number;
  numero_acta: string;
  fecha_dia: string;
  fecha_mes: string;
  fecha_anio: string;
  tipo_inscripcion?: string;
  es_reconocimiento?: boolean;
  es_insercion?: boolean;
  registrador_id?: number;
  resolucion_numero?: string;
  resolucion_dia?: string;
  resolucion_mes?: string;
  resolucion_anio?: string;
  gaceta_municipal?: string;
  gaceta_dia?: string;
  gaceta_mes?: string;
  gaceta_anio?: string;
  circunstancias_especiales?: string;
  documentos_presentados?: string;
  created_at?: string;
  updated_at?: string;
  registrador?: Registrador;
  presentado?: Presentado;
  certificado?: CertificadoMedico;
  madre?: Persona;
  padre?: Persona;
  declarante?: Declarante;
  testigos?: Testigo[];
  notas_marginales?: NotaMarginal[];
}

export interface Registrador {
  id: number;
  nombres: string;
  apellidos: string;
  documento_identidad: string;
  oficina_registro_civil: string;
}

export interface Presentado {
  id: number;
  acta_id?: number;
  nombres: string;
  primer_apellido: string;
  segundo_apellido?: string;
  dia_nac: string;
  mes_nac: string;
  anio_nac: string;
  sexo: string;
  hora_nacimiento?: string;
  am_pm?: string;
  lugar_nacimiento?: string;
  estado?: string;
  municipio?: string;
  parroquia?: string;
  direccion?: string;
}

export interface CertificadoMedico {
  id: number;
  acta_id?: number;
  numero_certificado: string;
  dia_expedicion: string;
  mes_expedicion: string;
  anio_expedicion: string;
  nombre_centro_salud: string;
  autoridad_expide: string;
  numero_mpps?: string;
  direccion_centro?: string;
}

export interface Persona {
  id: number;
  acta_id?: number;
  nombres: string;
  primer_apellido: string;
  segundo_apellido?: string;
  documento_identidad?: string;
  tiene_cedula?: boolean;
  tiene_pasaporte?: boolean;
  tiene_otro?: boolean;
  edad?: number | string;
  nacionalidad?: string;
  profesion_ocupacion?: string;
  comunidad_indigena?: string;
  residencia?: string;
  es_declarante?: boolean;
}

export interface Declarante {
  id: number;
  acta_id?: number;
  nombres_apellidos?: string;
  caracter_actua?: string;
  documento_identidad?: string;
  tiene_cedula?: boolean;
  tiene_pasaporte?: boolean;
  tiene_otro?: boolean;
  edad?: number | string;
  nacionalidad?: string;
  profesion_ocupacion?: string;
  residencia?: string;
}

export interface Testigo {
  id: number;
  acta_id?: number;
  numero_testigo?: number | string;
  nombres_apellidos: string;
  cedula_identidad?: string;
  edad?: number | string;
  profesion_ocupacion?: string;
  nacionalidad?: string;
  residencia?: string;
}

export interface NotaMarginal {
  id: number;
  acta_id?: number;
  dia?: string;
  mes?: string;
  anio?: string;
  oficina_registro_civil?: string;
  quien_suscribe?: string;
  cedula_suscriptor?: string;
  resolucion_numero?: string;
  articulo_numero?: string;
  gaceta_numero?: string;
  gaceta_dia?: string;
  gaceta_mes?: string;
  gaceta_anio?: string;
}

export interface Familiar {
  id: number;
  nombre_completo: string;
  cedula?: string;
  telefono?: string;
  fecha_nacimiento: string;
  hora_nacimiento?: string;
  edad_anos?: number;
  edad_meses?: number;
  edad_dias?: number;
  dias_para_cumple?: number;
  fecha_proximo_cumple?: string;
  emoji_estado?: string;
}

export interface DashboardStats {
  total_actas: number;
  actas_hoy: number;
  total_registradores: number;
  ultimas_actas: ActaNacimiento[];
}
