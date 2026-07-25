from datetime import date, datetime


def calcular_edad_completa(fecha_nacimiento: date) -> dict:
    hoy = date.today()
    anios = hoy.year - fecha_nacimiento.year
    meses = hoy.month - fecha_nacimiento.month
    dias = hoy.day - fecha_nacimiento.day

    if dias < 0:
        meses -= 1
        mes_anterior = hoy.month - 1 if hoy.month > 1 else 12
        anio_anterior = hoy.year if hoy.month > 1 else hoy.year - 1
        import calendar
        dias += calendar.monthrange(anio_anterior, mes_anterior)[1]

    if meses < 0:
        anios -= 1
        meses += 12

    return {"anios": anios, "meses": meses, "dias": dias}


def calcular_dias_para_cumple(fecha_nacimiento: date) -> dict:
    hoy = date.today()
    proximo_cumple = fecha_nacimiento.replace(year=hoy.year)
    if proximo_cumple < hoy:
        proximo_cumple = fecha_nacimiento.replace(year=hoy.year + 1)

    dias_faltan = (proximo_cumple - hoy).days

    return {
        "dias_faltan": dias_faltan,
        "fecha_proximo_cumple": proximo_cumple,
    }


def obtener_emoji_estado(dias_faltan: int) -> str:
    if dias_faltan == 0:
        return "\U0001f382"
    elif dias_faltan < 31:
        return "\U0001f929"
    elif dias_faltan < 61:
        return "\U0001f60a"
    elif dias_faltan < 91:
        return "\U0001f970"
    elif dias_faltan < 121:
        return "\U0001f60d"
    elif dias_faltan < 151:
        return "\U0001f61c"
    elif dias_faltan < 181:
        return "\U0001f62e"
    elif dias_faltan < 211:
        return "\U0001f60f"
    elif dias_faltan < 241:
        return "\U0001f643"
    elif dias_faltan < 271:
        return "\U0001f614"
    elif dias_faltan < 301:
        return "\U0001f971"
    else:
        return "\U0001f612"


def formatear_edad_texto(edad: dict) -> str:
    partes = []
    if edad["anios"] > 0:
        partes.append(f"{edad['anios']} Ano{'s' if edad['anios'] != 1 else ''}")
    if edad["meses"] > 0:
        partes.append(f"{edad['meses']} Mes{'es' if edad['meses'] != 1 else ''}")
    if edad["dias"] > 0:
        partes.append(f"{edad['dias']} Dia{'s' if edad['dias'] != 1 else ''}")
    return ", ".join(partes) if partes else "0 Dias"


def texto_nota_marginal(datos: dict) -> str:
    return (
        f"Hoy {datos.get('dia', '')} DE {datos.get('mes', '')} "
        f"{datos.get('anio', '')} EN LA OFICINA O UNIDAD DE REGISTRO CIVIL "
        f"DE LA PARROQUIA ADAURE, MUNICIPIO FALCON ESTADO FALCON "
        f"QUIEN SUSCRIBE {datos.get('suscriptor', '')} "
        f"TITULAR DE LA CEDULA DE IDENTIDAD {datos.get('cedula_suscriptor', '')} "
        f"REGISTRADORA, CIVIL DE LA PARROQUIA ADAURE, MUNICIPIO FALCON, "
        f"ESTADO FALCON, EN SUS ATRIBUCIONES CONFERIDAS POR EL CIUDADANO "
        f"ALCALDE DEL MUNICIPIO FALCON, MEDIANTE RESOLUCION NUMERO "
        f"{datos.get('resolucion', '')} Y DE CONFORMIDAD CON LO ESTABLECIDO "
        f"EN EL ARTICULO {datos.get('articulo', '')} DE LA LEY ORGANICA DE "
        f"REGISTRO CIVIL, PUBLICADA EN GACETA OFICIAL NUMERO "
        f"{datos.get('gaceta', '')} DE FECHA {datos.get('dia_gaceta', '')} "
        f"{datos.get('mes_gaceta', '')} {datos.get('anio_gaceta', '')} "
        f"CERTIFICO QUE EL CONTENIDO DEL PRESENTE DOCUMENTO ES COPIA FIEL "
        f"Y EXACTA DEL ORIGINAL QUE REPOSA EN LOS ARCHIVOS DE ESTE "
        f"REGISTRO CIVIL"
    )
