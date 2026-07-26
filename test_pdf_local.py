#!/usr/bin/env python3
"""Genera PDF localmente para pruebas rápidas sin deploy."""
import sys, os
sys.path.insert(0, 'backend')
os.environ['DATABASE_URL'] = 'sqlite+aiosqlite:///test.db'

from app.pdf.generator import render_acta_html, generate_acta_pdf

class MockObj:
    def __init__(self, **kw):
        for k,v in kw.items():
            setattr(self, k, v)

# ---- DATOS DE PRUEBA ----
# Cámbialos para probar diferentes escenarios
presentado = MockObj(
    nombres='AARON DAVID', primer_apellido='BRACHO', segundo_apellido='COLINA',
    dia_nac='22', mes_nac='04', anio_nac='2015', sexo='M',
    hora_nacimiento='06:35', am_pm='PM',
    estado='FALCÓN', municipio='CARIRUBANA', parroquia='CARIRUBANA',
    direccion='PUNTO FIJO ESTADO FALCÓN'
)
registrador = MockObj(
    nombres='YUSLEY ROSALIA', apellidos='BRACHO DE JORDAN',
    documento_identidad='7524322', oficina_registro_civil='ADAURE'
)
certificado = MockObj(
    numero_certificado='6439403', dia_expedicion='24', mes_expedicion='04', anio_expedicion='2015',
    nombre_centro_salud='CENTRO CLINICO LA SAGRADA FAMILIA',
    autoridad_expide='DR. ALFREDO ALFARO', numero_mpps='214213',
    direccion_centro='PUNTO FIJO EDO. FALCÓN'
)
madre = MockObj(
    nombres='FRANCIREE DEL VALLE', primer_apellido='COLINA', segundo_apellido='DE BRACHO',
    documento_identidad='25605366', tiene_cedula=True, tiene_pasaporte=False, tiene_otro=False,
    edad='22', nacionalidad='VENEZOLANA', profesion_ocupacion='OFICIOS DEL HOGAR',
    comunidad_indigena='N/A', residencia='ADAURE VIA PRINCIPAL ADAURE ARRIBA, EDO. FALCÓN',
    es_declarante=True
)
padre = MockObj(
    nombres='JAVIER JOSE', primer_apellido='BRACHO', segundo_apellido='CHIRINO',
    documento_identidad='18155001', tiene_cedula=True, tiene_pasaporte=False, tiene_otro=False,
    edad='28', nacionalidad='VENEZOLANO', profesion_ocupacion='OBRERO',
    comunidad_indigena='N/A', residencia='ADAURE VIA PRINCIPAL ADAURE ARRIBA, EDO FALCÓN',
    es_declarante=True
)
declarante = MockObj(
    nombres_apellidos='', caracter_actua='', documento_identidad='',
    tiene_cedula=False, tiene_pasaporte=False, tiene_otro=False,
    edad='', nacionalidad='', profesion_ocupacion='', comunidad_indigena='', residencia=''
)
testigo1 = MockObj(
    nombres_apellidos='CARMEN ATACHO', cedula_identidad='11764359', edad='42',
    profesion_ocupacion='LICENCIADA EN GENTION AMBIENTAL', nacionalidad='VENEZOLANA',
    comunidad_indigena='N/A', residencia='ADAURE VIA PRINCIPAL ADAURE ARRIBA EDO. FALCÓN'
)
testigo2 = MockObj(
    nombres_apellidos='MARGARITA COLINA GUANIPA', cedula_identidad='7527127', edad='53',
    profesion_ocupacion='OFICIOS DEL HOGAR', nacionalidad='VENEZOLANA',
    comunidad_indigena='N/A', residencia='ADAURE CALLE PRINCIPAL ADAURE ARRIBA ESDO. FALÓN'
)
acta = MockObj(
    numero_acta='60', fecha_dia='02', fecha_mes='12', fecha_anio='2015',
    es_reconocimiento=False, es_insercion=False,
    resolucion_numero='046-15', resolucion_dia='05', resolucion_mes='01', resolucion_anio='2015',
    gaceta_municipal='N/A', gaceta_dia='', gaceta_mes='', gaceta_anio='',
    circunstancias_especiales='',
    documentos_presentados='EV-25 COPIA DE LA C.I DE LOS PADRES Y LOS TESTIGOS',
    presentado=presentado, registrador=registrador, certificado=certificado,
    madre=madre, padre=padre, declarante=declarante,
    testigos=[testigo1, testigo2], notas_marginales=[MockObj(
        dia='05', mes='ENERO', anio='2023',
        quien_suscribe='YUSLEY ROSALIA BRACHO DE JORDAN',
        cedula_suscriptor='V-7524322',
        resolucion_numero='046-15', articulo_numero='45',
        gaceta_numero='1234', gaceta_dia='01', gaceta_mes='ENERO', gaceta_anio='2020'
    )]
)

# ---- GENERAR ----
html = render_acta_html(acta)
with open('/tmp/test_acta.html', 'w') as f:
    f.write(html)

pdf = generate_acta_pdf(acta)
with open('/tmp/test_acta.pdf', 'wb') as f:
    f.write(pdf)

print(f"OK: /tmp/test_acta.pdf ({len(pdf)} bytes)")
print("Edita backend/app/pdf/templates/acta_nacimiento.html y vuelve a ejecutar este script para ver cambios.")
