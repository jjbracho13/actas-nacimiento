# Actas de Nacimiento - CNE

Sistema de gestion de actas de nacimiento - Consejo Nacional Electoral

## Estructura del Proyecto

```
actas-nacimiento/
├── backend/           # API FastAPI + PostgreSQL
├── web/               # Frontend web (React 18 + Vite 5)
├── mobile/            # App movil (Capacitor + React 19)
├── shared/            # Codigo compartido (tipos y API client)
├── render.yaml        # Configuracion de deploy en Render
├── Dockerfile         # Contenedor Docker
└── build.sh           # Script de build
```

## Inicio Rapido

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Web
```bash
cd web
npm install
npm run dev
```

### App Movil
```bash
cd mobile
npm install
npm run build
npx cap sync
npx cap open android
```

## Deploy en Render

El proyecto se despliega automaticamente en Render cada vez que se hace push a la rama `main`.

- **API**: https://actas-nacimiento.onrender.com
- **Web**: https://actas-nacimiento.onrender.com (servida desde el backend)

## Credenciales

- **Admin**: admin / admin123
- **Operador**: operator / operator123

## Tecnologias

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Python 3.12
- **Frontend Web**: React 18, Vite 5, Tailwind CSS 3
- **App Movil**: React 19, Vite 8, Capacitor 8, Tailwind CSS 4
- **Deploy**: Render (free tier)
