import os
import time
from io import BytesIO
from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa
from app.services import texto_nota_marginal


TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")
CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache")

_jinja_env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
_template = _jinja_env.get_template("acta_nacimiento.html")

CACHE_TTL = 3600


def _ensure_cache_dir():
    os.makedirs(CACHE_DIR, exist_ok=True)


def _cache_path(acta_id: int) -> str:
    return os.path.join(CACHE_DIR, f"acta_{acta_id}.pdf")


def get_cached_pdf(acta_id: int) -> bytes | None:
    path = _cache_path(acta_id)
    if not os.path.isfile(path):
        return None
    age = time.time() - os.path.getmtime(path)
    if age > CACHE_TTL:
        return None
    with open(path, "rb") as f:
        return f.read()


def save_pdf_cache(acta_id: int, pdf_bytes: bytes):
    _ensure_cache_dir()
    with open(_cache_path(acta_id), "wb") as f:
        f.write(pdf_bytes)


def invalidate_pdf_cache(acta_id: int):
    path = _cache_path(acta_id)
    if os.path.isfile(path):
        os.remove(path)


def render_acta_html(acta) -> str:

    presentado = acta.presentado
    registrador = acta.registrador
    certificado = acta.certificado
    madre = acta.madre
    padre = acta.padre
    declarante = acta.declarante
    testigos = acta.testigos or []
    nota = acta.notas_marginales[0] if acta.notas_marginales else None

    if nota:
        nota_texto = texto_nota_marginal({
            "dia": nota.dia,
            "mes": nota.mes,
            "anio": nota.anio,
            "suscriptor": nota.quien_suscribe,
            "cedula_suscriptor": nota.cedula_suscriptor,
            "resolucion": nota.resolucion_numero,
            "articulo": nota.articulo_numero,
            "gaceta": nota.gaceta_numero,
            "dia_gaceta": nota.gaceta_dia,
            "mes_gaceta": nota.gaceta_mes,
            "anio_gaceta": nota.gaceta_anio,
        })
    else:
        nota_texto = texto_nota_marginal({
            "dia": acta.fecha_dia or "",
            "mes": acta.fecha_mes or "",
            "anio": acta.fecha_anio or "",
            "suscriptor": f"{registrador.nombres or ''} {registrador.apellidos or ''}".strip(),
            "cedula_suscriptor": registrador.documento_identidad or "",
            "resolucion": acta.resolucion_numero or "",
            "articulo": "45",
            "gaceta": acta.gaceta_municipal or "",
            "dia_gaceta": acta.gaceta_dia or "",
            "mes_gaceta": acta.gaceta_mes or "",
            "anio_gaceta": acta.gaceta_anio or "",
        })

    context = {
        "acta": acta,
        "presentado": presentado,
        "registrador": registrador,
        "certificado": certificado,
        "madre": madre,
        "padre": padre,
        "declarante": declarante,
        "testigos": testigos,
        "nota_texto": nota_texto,
    }

    return _template.render(context)


def generate_acta_pdf(acta) -> bytes:
    cached = get_cached_pdf(acta.id)
    if cached:
        return cached

    html_content = render_acta_html(acta)
    output = BytesIO()
    logo_path = os.path.join(TEMPLATE_DIR, "cne_logo.png")
    html_content = html_content.replace('src="cne_logo.png"', f'src="{logo_path}"')
    pisa_status = pisa.CreatePDF(html_content, dest=output, path=TEMPLATE_DIR)
    if pisa_status.err:
        raise RuntimeError("Error generating PDF")
    pdf_bytes = output.getvalue()
    save_pdf_cache(acta.id, pdf_bytes)
    return pdf_bytes
