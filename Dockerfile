FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY backend/ /app/backend/

COPY frontend/ /app/frontend/
WORKDIR /app/frontend
RUN npm install && npm run build

RUN mkdir -p /app/backend/static && cp -r dist/* /app/backend/static/

WORKDIR /app/backend
EXPOSE 8000

CMD python3 run.py
