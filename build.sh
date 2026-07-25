#!/bin/bash
# Build script for Render
set -e

echo "=== Installing system dependencies for WeasyPrint ==="
apt-get update
apt-get install -y --no-install-recommends \
  libpango1.0-dev \
  libpangocairo-1.0-0 \
  libcairo2 \
  libgdk-pixbuf2.0-dev \
  libffi-dev \
  shared-mime-info \
  nodejs \
  npm

echo "=== Installing backend dependencies ==="
pip install -r backend/requirements.txt

echo "=== Installing frontend dependencies ==="
cd frontend
npm install

echo "=== Building frontend ==="
npm run build

echo "=== Copying frontend build to backend/static ==="
mkdir -p ../backend/static
cp -r dist/* ../backend/static/

echo "=== Build complete ==="
