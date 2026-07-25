import os
import sys
import traceback

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print(f"Python path: {sys.path[0]}", flush=True)
    print(f"DATABASE_URL set: {'DATABASE_URL' in os.environ}", flush=True)
    print(f"SECRET_KEY set: {'SECRET_KEY' in os.environ}", flush=True)
    print(f"CORS_ORIGINS: {os.environ.get('CORS_ORIGINS', 'NOT SET')}", flush=True)
    print(f"PORT: {os.environ.get('PORT', 'NOT SET')}", flush=True)
    print(f"Working dir: {os.getcwd()}", flush=True)
    print(f"Files: {os.listdir('.')}", flush=True)

    from app.config import settings
    print(f"Config loaded. DB: {settings.DATABASE_URL[:30]}...", flush=True)

    from app.main import app
    print("App loaded successfully", flush=True)
except Exception as e:
    print(f"FATAL ERROR: {e}", flush=True)
    traceback.print_exc()
    sys.exit(1)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "8000"))
    print(f"Starting on port {port}", flush=True)
    uvicorn.run(app, host="0.0.0.0", port=port)
