FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY web/ ./web/
COPY shared/ ./shared/
COPY backend/ ./backend/

RUN cd web && npm ci && npm run build && cd .. && \
    rm -rf backend/static && \
    cp -r web/dist backend/static

WORKDIR /app/backend

EXPOSE 8000

CMD python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
