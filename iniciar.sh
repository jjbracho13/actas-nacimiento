#!/bin/bash
# Script de inicio completo - Backend + Frontend
BASEDIR="$(dirname "$0")"

echo "=== ACTAS DE NACIMIENTO ==="
echo ""
echo "1. Iniciando Backend (puerto 8000)..."
cd "$BASEDIR/backend"
../backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
sleep 2

echo "2. Iniciando Frontend (puerto 5173)..."
cd "$BASEDIR/web"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=== TODO LISTO ==="
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:8000/api/docs"
echo ""
echo "Credenciales:"
echo "  admin / admin123 (administrador)"
echo "  operator / operator123 (operador)"
echo ""
echo "Presiona Ctrl+C para detener todo"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
