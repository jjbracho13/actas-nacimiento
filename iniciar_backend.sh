#!/bin/bash
# Script de inicio - Backend
cd "$(dirname "$0")/backend"
echo "Iniciando Backend en http://localhost:8000"
echo "API Docs: http://localhost:8000/api/docs"
echo "Credenciales: admin/admin123 o operator/operator123"
echo ""
../backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
