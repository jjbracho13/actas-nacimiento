FROM python:3.12-slim

# Install system dependencies for WeasyPrint + Node.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpango1.0-dev \
    libpangocairo-1.0-0 \
    libcairo2 \
    libgdk-pixbuf2.0-dev \
    libffi-dev \
    shared-mime-info \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend source
COPY backend/ /app/backend/

# Install and build frontend
COPY frontend/ /app/frontend/
WORKDIR /app/frontend
RUN npm install && npm run build

# Copy frontend build into backend static folder
RUN mkdir -p /app/backend/static && cp -r dist/* /app/backend/static/

WORKDIR /app/backend
EXPOSE 8000

CMD ["python3", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
