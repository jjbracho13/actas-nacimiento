import sys
import os
import traceback
import logging

logging.basicConfig(level=logging.INFO, stream=sys.stderr)
logger = logging.getLogger("startup")

try:
    logger.info(f"Python: {sys.version}")
    logger.info(f"CWD: {os.getcwd()}")
    logger.info(f"PORT: {os.environ.get('PORT', 'NOT SET')}")
    logger.info(f"DATABASE_URL: {'SET' if os.environ.get('DATABASE_URL') else 'NOT SET'}")
    logger.info(f"SECRET_KEY: {'SET' if os.environ.get('SECRET_KEY') else 'NOT SET'}")
    logger.info(f"CORS_ORIGINS: {os.environ.get('CORS_ORIGINS', 'NOT SET')}")

    from app.config import settings
    logger.info(f"Config loaded OK. CORS: {settings.CORS_ORIGINS}")

    from app.main import app
    logger.info("App loaded OK")
except Exception as e:
    logger.error(f"FATAL: {e}")
    traceback.print_exc()
    sys.exit(1)

import uvicorn
port = int(os.environ.get("PORT", "8000"))
logger.info(f"Starting uvicorn on port {port}")
uvicorn.run(app, host="0.0.0.0", port=port)
