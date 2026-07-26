from app.models.acta import ActaNacimiento
from app.models.registrador import RegistradorCivil
from app.models.presentado import Presentado
from app.models.certificado_medico import CertificadoMedico
from app.models.madre import Madre
from app.models.padre import Padre
from app.models.declarante import Declarante
from app.models.testigo import Testigo
from app.models.nota_marginal import NotaMarginal
from app.models.familiar import Familiar
from app.models.user import User

__all__ = [
    "ActaNacimiento",
    "RegistradorCivil",
    "Presentado",
    "CertificadoMedico",
    "Madre",
    "Padre",
    "Declarante",
    "Testigo",
    "NotaMarginal",
    "Familiar",
    "User",
]
