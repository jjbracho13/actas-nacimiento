import os
from io import BytesIO
from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa
from app.services import texto_nota_marginal


TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")


def render_acta_html(acta) -> str:
    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    template = env.get_template("acta_nacimiento.html")

    presentado = acta.presentado
    registrador = acta.registrador
    certificado = acta.certificado
    madre = acta.madre
    padre = acta.padre
    declarante = acta.declarante
    testigos = acta.testigos or []
    nota = acta.notas_marginales[0] if acta.notas_marginales else None

    nota_texto = ""
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

    return template.render(context)


def generate_acta_pdf(acta) -> bytes:
    html_content = render_acta_html(acta)
    output = BytesIO()
    logo_path = os.path.join(TEMPLATE_DIR, "cne_logo.png")
    html_content = html_content.replace('src="cne_logo.png"', f'src="{logo_path}"')
    pisa_status = pisa.CreatePDF(html_content, dest=output, path=TEMPLATE_DIR)
    if pisa_status.err:
        raise RuntimeError("Error generating PDF")
    return output.getvalue()
