#!/bin/bash
# Build script for Render
set -e

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
