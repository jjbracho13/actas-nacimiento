import os
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
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
    pdf = HTML(string=html_content, base_url=TEMPLATE_DIR).write_pdf()
    return pdf
