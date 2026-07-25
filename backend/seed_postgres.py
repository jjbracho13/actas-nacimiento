"""
Seed script for PostgreSQL production database.
Reads data from the Excel file and inserts into PostgreSQL.

Usage:
    cd actas-nacimiento
    source backend/venv/bin/activate
    python backend/seed_postgres.py
"""
import asyncio
import os
import sys
from datetime import datetime, date

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+asyncpg://rolpay:nRudxktTIGGYRN7900WE38nNL97VonPI@dpg-d9hvm6fabvsc73a63tf0-a.oregon-postgres.render.com/rolpay"
)

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.models import (
    ActaNacimiento, RegistradorCivil, Presentado,
    CertificadoMedico, Madre, Padre, Declarante,
    Testigo, NotaMarginal, Familiar,
)
from app.database import Base


async def seed():
    from app.config import settings
    url = settings.DATABASE_URL
    print(f"Connecting to: {url[:50]}...")

    engine = create_async_engine(url, echo=False)
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created/verified.")

    async with async_session() as db:
        # Check if already seeded
        from sqlalchemy import select
        result = await db.execute(select(ActaNacimiento).limit(1))
        if result.scalar():
            print("Database already seeded. Skipping.")
            return

        # --- REGISTRADORES ---
        registradores = [
            RegistradorCivil(
                nombres="YUSLEY ROSALIA",
                apellidos="BRACHO DE JORDAN",
                documento_identidad="7524322",
                oficina_registro_civil="ADAURE",
            ),
        ]
        db.add_all(registradores)
        await db.flush()
        reg_id = registradores[0].id
        print(f"Registrador inserted: id={reg_id}")

        # --- ACTA 1: Acta 60 ---
        acta1 = ActaNacimiento(
            numero_acta="60",
            fecha_dia="02", fecha_mes="12", fecha_anio="2015",
            tipo_inscripcion="REGISTRO DE NACIMIENTO",
            registrador_id=reg_id,
            resolucion_numero="046-15",
            resolucion_dia="05", resolucion_mes="01", resolucion_anio="2015",
            circunstancias_especiales=None,
            documentos_presentados=None,
        )
        db.add(acta1)
        await db.flush()

        presentado1 = Presentado(
            acta_id=acta1.id,
            nombres="AARON DAVID", primer_apellido="BRACHO", segundo_apellido="COLINA",
            dia_nac="22", mes_nac="04", anio_nac="2015", sexo="M",
            hora_nacimiento=datetime.strptime("18:35", "%H:%M").time(),
            am_pm="PM",
            lugar_nacimiento="PAIS: VENEZUELA", estado="FALCÓN", municipio="CARIRUBANA",
            parroquia="CARIRUBANA", direccion="PUNTO FIJO ESTADO FALCÓN",
        )
        certificado1 = CertificadoMedico(
            acta_id=acta1.id,
            numero_certificado="6439403",
            dia_expedicion="24", mes_expedicion="04", anio_expedicion="2015",
            nombre_centro_salud="CENTRO CLINICO LA SAGRADA FAMILIA",
            autoridad_expide="DR. ALFREDO ALFARO",
            numero_mpps="214213",
            direccion_centro="PUNTO FIJO EDO. FALCÓN",
        )
        madre1 = Madre(
            acta_id=acta1.id,
            nombres="FRANCIREE DEL VALLE", primer_apellido="COLINA", segundo_apellido="DE BRACHO",
            documento_identidad="25605366",
            tiene_cedula=True, tiene_pasaporte=False, tiene_otro=False,
            edad=22, nacionalidad="VENEZOLANA",
            profesion_ocupacion="OFICIOS DEL HOGAR",
            residencia="ADAURE VIA PRINCIPAL ADAURE ARRIBA,EDO. FALCÓN",
            es_declarante=True,
        )
        padre1 = Padre(
            acta_id=acta1.id,
            nombres="JAVIER JOSE", primer_apellido="BRACHO", segundo_apellido="CHIRINO",
            documento_identidad="18155001",
            tiene_cedula=True, tiene_pasaporte=False, tiene_otro=False,
            edad=28, nacionalidad="VENEZOLANO",
            profesion_ocupacion="OBRERO",
            residencia="ADAURE VIA PRINCIPAL ADAURE ARRIBA,EDO FALCÓN",
            es_declarante=True,
        )
        testigo1a = Testigo(
            acta_id=acta1.id, numero_testigo=1,
            nombres_apellidos="CARMEN ATACHO",
            cedula_identidad="11764359",
            edad=42, profesion_ocupacion="LICENCIADA EN GESTION AMBIENTAL",
            nacionalidad="VENEZOLANA",
            residencia="ADAURE VIA PRINCIPAL ADAURE ARRIBA EDO. FALCÓN",
        )
        testigo1b = Testigo(
            acta_id=acta1.id, numero_testigo=2,
            nombres_apellidos="MARGARITA COLINA GUANIPA",
            cedula_identidad="7527127",
            edad=53, profesion_ocupacion="OFICIOS DEL HOGAR",
            nacionalidad="VENEZOLANA",
            residencia="ADAURE CALLE PRINCIPAL ADAURE ARRIBA ESDO. FALÓN",
        )
        nota1 = NotaMarginal(
            acta_id=acta1.id,
            dia="1", mes="SEPTIEMBRE", anio="2022",
            oficina_registro_civil="OFICINA O UNIDAD DE REGITRO CIVIL DE LA PARROQUIA ADAURE",
            quien_suscribe="T.S.U JENNY CAROLINA MARTINEZ GONZALES",
            cedula_suscriptor="14074887",
            resolucion_numero="034-2022",
            articulo_numero="155",
            gaceta_numero="39264",
            gaceta_dia="15", gaceta_mes="SEPTIEMBRE", gaceta_anio="2009",
        )
        db.add_all([presentado1, certificado1, madre1, padre1, testigo1a, testigo1b, nota1])

        # --- ACTA 2: Acta 6 ---
        acta2 = ActaNacimiento(
            numero_acta="6",
            fecha_dia="25", fecha_mes="08", fecha_anio="2017",
            tipo_inscripcion="REGISTRO DE NACIMIENTO",
            registrador_id=reg_id,
            resolucion_numero="035-17",
            resolucion_dia="03", resolucion_mes="01", resolucion_anio="2017",
        )
        db.add(acta2)
        await db.flush()

        presentado2 = Presentado(
            acta_id=acta2.id,
            nombres="ALONZO GABRIEL", primer_apellido="BRACHO", segundo_apellido="COLINA",
            dia_nac="27", mes_nac="06", anio_nac="2017", sexo="M",
            hora_nacimiento=datetime.strptime("23:39", "%H:%M").time(),
            am_pm="PM",
            lugar_nacimiento="VENEZUELA", estado="FALCÓN", municipio="MIRANDA",
            parroquia="SAN GABRIEL",
            direccion="AVENIDA, LOS MEDANOS PARROQUIA SAN GABRIEL, MUNICIPIO MIRANDA",
        )
        certificado2 = CertificadoMedico(
            acta_id=acta2.id,
            numero_certificado="8976236",
            dia_expedicion="27", mes_expedicion="06", anio_expedicion="2017",
            nombre_centro_salud="HOSPITAL DR. JOSE MARIA ESPINOZA",
            autoridad_expide="DR. LIRIS M BRAVO",
            numero_mpps="78057",
            direccion_centro="CORO EDO. FALCÓN",
        )
        madre2 = Madre(
            acta_id=acta2.id,
            nombres="FRANCIREE DEL VALLE", primer_apellido="COLINA", segundo_apellido="DE BRACHO",
            documento_identidad="25605366",
            tiene_cedula=True,
            edad=24, nacionalidad="VENEZOLANA",
            profesion_ocupacion="OFICIOS DEL HOGAR",
            residencia="ADAURE VIA PRINCIPAL ADAURE ARRIBA,EDO. FALCÓN",
            es_declarante=True,
        )
        padre2 = Padre(
            acta_id=acta2.id,
            nombres="JAVIER JOSE", primer_apellido="BRACHO", segundo_apellido="CHIRINO",
            documento_identidad="18155001",
            tiene_cedula=True,
            edad=30, nacionalidad="VENEZOLANO",
            profesion_ocupacion="OBRERO",
            residencia="ADAURE VIA PRINCIPAL ADAURE ARRIBA,EDO FALCÓN",
            es_declarante=True,
        )
        testigo2a = Testigo(
            acta_id=acta2.id, numero_testigo=1,
            nombres_apellidos="GREGORIO RAMON CHIRINOS BRACHO",
            cedula_identidad="11770909",
            edad=45, profesion_ocupacion="TSU EN INFORMATICA Y DOCUMENTACIÓN",
            nacionalidad="VENEZOLANO",
            residencia="PARROQUIA ADAURE SECTOR LA MONICA MUNC FALCÓN",
        )
        testigo2b = Testigo(
            acta_id=acta2.id, numero_testigo=2,
            nombres_apellidos="FLOR MARIA BRACHO BRACHO",
            cedula_identidad="17841431",
            edad=33, profesion_ocupacion="OFICIOS DEL HOGAR",
            nacionalidad="VENEZOLANA",
            residencia="PARROQUIA ADAURE, SECTOR ADAURE ARRIBA, MUNICIPIO FALCÓN",
        )
        db.add_all([presentado2, certificado2, madre2, padre2, testigo2a, testigo2b])

        # --- ACTA 3: Acta 18 ---
        acta3 = ActaNacimiento(
            numero_acta="18",
            fecha_dia="18", fecha_mes="04", fecha_anio="2011",
            tipo_inscripcion="REGISTRO DE NACIMIENTO",
            registrador_id=reg_id,
            resolucion_numero="0002-2011",
            resolucion_dia="11", resolucion_mes="01", resolucion_anio="2011",
        )
        db.add(acta3)
        await db.flush()

        presentado3 = Presentado(
            acta_id=acta3.id,
            nombres="REIZON JAVIER", primer_apellido="BRACHO", segundo_apellido="COLINA",
            dia_nac="08", mes_nac="04", anio_nac="2011", sexo="M",
            hora_nacimiento=datetime.strptime("12:00", "%H:%M").time(),
            am_pm="PM",
            lugar_nacimiento="FALCÓN", estado="FALCÓN", municipio="CARIRUBANA",
            parroquia="PUNTO FIJO",
            direccion="PUNTO FIJO ESTADO FALCÓN",
        )
        certificado3 = CertificadoMedico(
            acta_id=acta3.id,
            numero_certificado="4654878",
            dia_expedicion="11", mes_expedicion="04", anio_expedicion="2011",
            nombre_centro_salud="CLINICA FALCÓN",
            autoridad_expide="DR. JERRY ALFARO",
            numero_mpps="24564",
            direccion_centro="PUNTO FIJO EDO. FALCÓN",
        )
        madre3 = Madre(
            acta_id=acta3.id,
            nombres="FRANCIREE DEL VALLE", primer_apellido="COLINA", segundo_apellido="DE BRACHO",
            documento_identidad="25605366",
            tiene_cedula=True,
            edad=23, nacionalidad="VENEZOLANA",
            profesion_ocupacion="OFICIOS DEL HOGAR",
            residencia="ADAURE SECTOR ADAURE ARRIBA, PARROQUIA ADAURE, MUNICIPIO Y EDO. FALCÓN",
            es_declarante=True,
        )
        padre3 = Padre(
            acta_id=acta3.id,
            nombres="JAVIER JOSE", primer_apellido="BRACHO", segundo_apellido="CHIRINO",
            documento_identidad="18155001",
            tiene_cedula=True,
            edad=23, nacionalidad="VENEZOLANO",
            profesion_ocupacion="OBRERO",
            residencia="ADAURE SETOR ADAURE ARRIBA, PARROQUIA ADAURE MUNICIPIO Y EDO FALCÓN",
            es_declarante=True,
        )
        testigo3a = Testigo(
            acta_id=acta3.id, numero_testigo=1,
            nombres_apellidos="MARIA LOURDES MORENO DE REVILLA",
            cedula_identidad="5585990",
            edad=62, profesion_ocupacion="OFICIOS DEL HOGAR",
            nacionalidad="VENEZOLANA",
            residencia="ADAURE SECTOR ADAURE CENTRO MUNICIPIO FALCON Y ESTADO FALCOM",
        )
        testigo3b = Testigo(
            acta_id=acta3.id, numero_testigo=2,
            nombres_apellidos="ROCIO ELIZABETH AULAR PEROZO",
            cedula_identidad="14227251",
            edad=30, profesion_ocupacion="OFICIOS DEL HOGAR",
            nacionalidad="VENEZOLANA",
            residencia="ADAURE SECTOR ADAURE CENTRO MUNICIPIO FALCON Y EDO FALCÓN",
        )
        db.add_all([presentado3, certificado3, madre3, padre3, testigo3a, testigo3b])

        # --- ACTA 4: Acta 19 ---
        acta4 = ActaNacimiento(
            numero_acta="19",
            fecha_dia="04", fecha_mes="11", fecha_anio="2013",
            tipo_inscripcion="REGISTRO DE NACIMIENTO",
            registrador_id=reg_id,
            resolucion_numero="0001-2012",
            resolucion_dia="03", resolucion_mes="01", resolucion_anio="2012",
        )
        db.add(acta4)
        await db.flush()

        presentado4 = Presentado(
            acta_id=acta4.id,
            nombres="SILVANA SARAY", primer_apellido="BRACHO", segundo_apellido="COLINA",
            dia_nac="17", mes_nac="09", anio_nac="2013", sexo="F",
            hora_nacimiento=datetime.strptime("17:45", "%H:%M").time(),
            am_pm="PM",
            lugar_nacimiento="VENEZUELA", estado="FALCÓN", municipio="CARIRUBANA",
            parroquia="CARIRUBANA",
            direccion="AV. PANAMA, ESQUINA CALLE GARCES,PUNTO FIJO, EDO. FALCON",
        )
        certificado4 = CertificadoMedico(
            acta_id=acta4.id,
            numero_certificado="6173002",
            dia_expedicion="27", mes_expedicion="09", anio_expedicion="2013",
            nombre_centro_salud="CLINICA LA FAMILIA",
            autoridad_expide="DR. JERRY ALFARO",
            numero_mpps="2454",
            direccion_centro="PUNTO FIJO EDO. FALCÓN",
        )
        madre4 = Madre(
            acta_id=acta4.id,
            nombres="FRANCIREE DEL VALLE", primer_apellido="COLINA", segundo_apellido="DE BRACHO",
            documento_identidad="25605366",
            tiene_cedula=True,
            edad=20, nacionalidad="VENEZOLANA",
            profesion_ocupacion="OFICIOS DEL HOGAR",
            residencia="ADAURE VIA PRINCIPAL ADAURE ARRIBA,EDO. FALCÓN",
            es_declarante=True,
        )
        padre4 = Padre(
            acta_id=acta4.id,
            nombres="JAVIER JOSE", primer_apellido="BRACHO", segundo_apellido="CHIRINO",
            documento_identidad="18155001",
            tiene_cedula=True,
            edad=26, nacionalidad="VENEZOLANO",
            profesion_ocupacion="OBRERO",
            residencia="ADAURE VIA PRINCIPAL ADAURE ARRIBA,EDO FALCÓN",
            es_declarante=True,
        )
        testigo4a = Testigo(
            acta_id=acta4.id, numero_testigo=1,
            nombres_apellidos="OSCAR REVILLA",
            cedula_identidad="2861570",
            edad=68, profesion_ocupacion="PASTOR",
            nacionalidad="VENEZOLANO",
            residencia="ADAURE CENTRO MUNICIPIO FALCON",
        )
        testigo4b = Testigo(
            acta_id=acta4.id, numero_testigo=2,
            nombres_apellidos="MARIA MORENO DE REVILLA",
            cedula_identidad="5585990",
            edad=65, profesion_ocupacion="OFICIOS DEL HOGAR",
            nacionalidad="VENEZOLANA",
            residencia="ADAURE SECTOR ADAURE CENTRO MUNICIPIO FALCON Y EDO FALCÓN",
        )
        db.add_all([presentado4, certificado4, madre4, padre4, testigo4a, testigo4b])

        # --- FAMILIARES (from Fecha De Nac) ---
        familiares = [
            Familiar(
                nombre_completo="Reizon J Bracho C",
                cedula="N/A", telefono="N/A",
                fecha_nacimiento=date(2011, 4, 8),
                hora_nacimiento="12:50",
            ),
            Familiar(
                nombre_completo="Aarón D Bracho C",
                cedula="N/A", telefono="N/A",
                fecha_nacimiento=date(2015, 4, 22),
                hora_nacimiento="18:35",
            ),
            Familiar(
                nombre_completo="Javier J Bracho Ch",
                cedula="0151877099", telefono="0989481969",
                fecha_nacimiento=date(1987, 5, 23),
                hora_nacimiento="07:00",
            ),
            Familiar(
                nombre_completo="Alonzo Gabriel Bracho C",
                cedula="N/A", telefono="N/A",
                fecha_nacimiento=date(2017, 6, 27),
                hora_nacimiento="23:39",
            ),
            Familiar(
                nombre_completo="Fracniree Colina",
                cedula="25605366", telefono="0992019440",
                fecha_nacimiento=date(1993, 7, 27),
            ),
            Familiar(
                nombre_completo="Silvana S Bracho C",
                cedula="N/A", telefono="N/A",
                fecha_nacimiento=date(2013, 9, 17),
                hora_nacimiento="17:45",
            ),
            Familiar(
                nombre_completo="Carmen Chirino",
                cedula="N/A", telefono="N/A",
                fecha_nacimiento=date(1961, 7, 18),
            ),
        ]
        db.add_all(familiares)

        await db.commit()
        print(f"Seeded: 1 registrador, 4 actas, 4 presentados, 4 certificados,")
        print(f"        4 madres, 4 padres, 0 declarantes, 8 testigos, 1 nota marginal, 7 familiares")

    await engine.dispose()
    print("Done!")


if __name__ == "__main__":
    asyncio.run(seed())
