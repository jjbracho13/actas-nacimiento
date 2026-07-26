from sqlalchemy import Column, Integer, Text
from app.database import Base


class User(Base):
    __tablename__ = "usuarios"
    __table_args__ = {"schema": "actas"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(Text, nullable=False, unique=True)
    nombre = Column(Text, nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(Text, nullable=False, default="user")
    activo = Column(Integer, default=1)
