"""initial migration

Revision ID: 001
Revises: 
Create Date: 2026-07-25
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'registradores_civil',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('nombres', sa.String(100), nullable=False),
        sa.Column('apellidos', sa.String(100), nullable=False),
        sa.Column('documento_identidad', sa.String(30), nullable=False),
        sa.Column('oficina_registro_civil', sa.String(150), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table(
        'actas_nacimiento',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('numero_acta', sa.String(20), nullable=False),
        sa.Column('fecha_dia', sa.String(5), nullable=False),
        sa.Column('fecha_mes', sa.String(5), nullable=False),
        sa.Column('fecha_anio', sa.String(5), nullable=False),
        sa.Column('tipo_inscripcion', sa.String(50), server_default='REGISTRO DE NACIMIENTO'),
        sa.Column('es_reconocimiento', sa.Boolean(), server_default='false'),
        sa.Column('es_insercion', sa.Boolean(), server_default='false'),
        sa.Column('registrador_id', sa.Integer(), nullable=False),
        sa.Column('resolucion_numero', sa.String(50)),
        sa.Column('resolucion_dia', sa.String(5)),
        sa.Column('resolucion_mes', sa.String(5)),
        sa.Column('resolucion_anio', sa.String(5)),
        sa.Column('gaceta_municipal', sa.String(50)),
        sa.Column('gaceta_dia', sa.String(5)),
        sa.Column('gaceta_mes', sa.String(5)),
        sa.Column('gaceta_anio', sa.String(5)),
        sa.Column('circunstancias_especiales', sa.Text),
        sa.Column('documentos_presentados', sa.Text),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.ForeignKeyConstraint(['registrador_id'], ['registradores_civil.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('numero_acta'),
    )
    op.create_index('ix_actas_numero_acta', 'actas_nacimiento', ['numero_acta'])

    op.create_table(
        'presentados',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('acta_id', sa.Integer(), nullable=False),
        sa.Column('nombres', sa.String(100), nullable=False),
        sa.Column('primer_apellido', sa.String(100), nullable=False),
        sa.Column('segundo_apellido', sa.String(100)),
        sa.Column('dia_nac', sa.String(5), nullable=False),
        sa.Column('mes_nac', sa.String(5), nullable=False),
        sa.Column('anio_nac', sa.String(5), nullable=False),
        sa.Column('sexo', sa.String(2), nullable=False),
        sa.Column('hora_nacimiento', sa.Time()),
        sa.Column('am_pm', sa.String(2)),
        sa.Column('lugar_nacimiento', sa.String(200)),
        sa.Column('estado', sa.String(100)),
        sa.Column('municipio', sa.String(100)),
        sa.Column('parroquia', sa.String(100)),
        sa.Column('direccion', sa.String(300)),
        sa.ForeignKeyConstraint(['acta_id'], ['actas_nacimiento.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('acta_id'),
    )

    op.create_table(
        'certificados_medicos',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('acta_id', sa.Integer(), nullable=False),
        sa.Column('numero_certificado', sa.String(30), nullable=False),
        sa.Column('dia_expedicion', sa.String(5), nullable=False),
        sa.Column('mes_expedicion', sa.String(5), nullable=False),
        sa.Column('anio_expedicion', sa.String(5), nullable=False),
        sa.Column('nombre_centro_salud', sa.String(200), nullable=False),
        sa.Column('autoridad_expide', sa.String(150), nullable=False),
        sa.Column('numero_mpps', sa.String(30)),
        sa.Column('direccion_centro', sa.String(300)),
        sa.ForeignKeyConstraint(['acta_id'], ['actas_nacimiento.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('acta_id'),
    )

    op.create_table(
        'madres',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('acta_id', sa.Integer(), nullable=False),
        sa.Column('nombres', sa.String(100), nullable=False),
        sa.Column('primer_apellido', sa.String(100), nullable=False),
        sa.Column('segundo_apellido', sa.String(100)),
        sa.Column('documento_identidad', sa.String(30)),
        sa.Column('tiene_cedula', sa.Boolean(), server_default='false'),
        sa.Column('tiene_pasaporte', sa.Boolean(), server_default='false'),
        sa.Column('tiene_otro', sa.Boolean(), server_default='false'),
        sa.Column('edad', sa.Integer),
        sa.Column('nacionalidad', sa.String(50)),
        sa.Column('profesion_ocupacion', sa.String(150)),
        sa.Column('comunidad_indigena', sa.String(150)),
        sa.Column('residencia', sa.String(300)),
        sa.Column('es_declarante', sa.Boolean(), server_default='false'),
        sa.ForeignKeyConstraint(['acta_id'], ['actas_nacimiento.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('acta_id'),
    )

    op.create_table(
        'padres',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('acta_id', sa.Integer(), nullable=False),
        sa.Column('nombres', sa.String(100), nullable=False),
        sa.Column('primer_apellido', sa.String(100), nullable=False),
        sa.Column('segundo_apellido', sa.String(100)),
        sa.Column('documento_identidad', sa.String(30)),
        sa.Column('tiene_cedula', sa.Boolean(), server_default='false'),
        sa.Column('tiene_pasaporte', sa.Boolean(), server_default='false'),
        sa.Column('tiene_otro', sa.Boolean(), server_default='false'),
        sa.Column('edad', sa.Integer),
        sa.Column('nacionalidad', sa.String(50)),
        sa.Column('profesion_ocupacion', sa.String(150)),
        sa.Column('comunidad_indigena', sa.String(150)),
        sa.Column('residencia', sa.String(300)),
        sa.Column('es_declarante', sa.Boolean(), server_default='false'),
        sa.ForeignKeyConstraint(['acta_id'], ['actas_nacimiento.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('acta_id'),
    )

    op.create_table(
        'declarantes',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('acta_id', sa.Integer(), nullable=False),
        sa.Column('nombres_apellidos', sa.String(200)),
        sa.Column('caracter_actua', sa.String(100)),
        sa.Column('documento_identidad', sa.String(30)),
        sa.Column('tiene_cedula', sa.Boolean(), server_default='false'),
        sa.Column('tiene_pasaporte', sa.Boolean(), server_default='false'),
        sa.Column('tiene_otro', sa.Boolean(), server_default='false'),
        sa.Column('edad', sa.Integer),
        sa.Column('nacionalidad', sa.String(50)),
        sa.Column('profesion_ocupacion', sa.String(150)),
        sa.Column('comunidad_indigena', sa.String(150)),
        sa.Column('residencia', sa.String(300)),
        sa.ForeignKeyConstraint(['acta_id'], ['actas_nacimiento.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('acta_id'),
    )

    op.create_table(
        'testigos',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('acta_id', sa.Integer(), nullable=False),
        sa.Column('numero_testigo', sa.Integer(), nullable=False),
        sa.Column('nombres_apellidos', sa.String(200), nullable=False),
        sa.Column('cedula_identidad', sa.String(30)),
        sa.Column('edad', sa.Integer),
        sa.Column('profesion_ocupacion', sa.String(150)),
        sa.Column('nacionalidad', sa.String(50)),
        sa.Column('comunidad_indigena', sa.String(150)),
        sa.Column('residencia', sa.String(300)),
        sa.ForeignKeyConstraint(['acta_id'], ['actas_nacimiento.id']),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table(
        'notas_marginales',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('acta_id', sa.Integer(), nullable=False),
        sa.Column('dia', sa.String(5)),
        sa.Column('mes', sa.String(20)),
        sa.Column('anio', sa.String(5)),
        sa.Column('oficina_registro_civil', sa.String(200)),
        sa.Column('quien_suscribe', sa.String(200)),
        sa.Column('cedula_suscriptor', sa.String(30)),
        sa.Column('resolucion_numero', sa.String(50)),
        sa.Column('articulo_numero', sa.String(10)),
        sa.Column('gaceta_numero', sa.String(20)),
        sa.Column('gaceta_dia', sa.String(5)),
        sa.Column('gaceta_mes', sa.String(20)),
        sa.Column('gaceta_anio', sa.String(5)),
        sa.ForeignKeyConstraint(['acta_id'], ['actas_nacimiento.id']),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table(
        'familiares',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('nombre_completo', sa.String(200), nullable=False),
        sa.Column('cedula', sa.String(30)),
        sa.Column('telefono', sa.String(20)),
        sa.Column('fecha_nacimiento', sa.Date(), nullable=False),
        sa.Column('hora_nacimiento', sa.String(10)),
        sa.Column('activo', sa.Integer(), server_default='1'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade() -> None:
    op.drop_table('familiares')
    op.drop_table('notas_marginales')
    op.drop_table('testigos')
    op.drop_table('declarantes')
    op.drop_table('padres')
    op.drop_table('madres')
    op.drop_table('certificados_medicos')
    op.drop_table('presentados')
    op.drop_index('ix_actas_numero_acta', 'actas_nacimiento')
    op.drop_table('actas_nacimiento')
    op.drop_table('registradores_civil')
