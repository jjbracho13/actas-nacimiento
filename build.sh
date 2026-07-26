#!/usr/bin/env bash
set -e

echo "Installing Python dependencies..."
pip install --no-cache-dir -r backend/requirements.txt

echo "Building frontend..."
cd frontend
if command -v npm &> /dev/null; then
  npm ci 2>/dev/null && npm run build 2>/dev/null && echo "Frontend built successfully" || echo "Frontend build skipped (using pre-built dist)"
else
  echo "npm not available, using pre-built frontend/dist"
fi
cd ..

echo "Copying frontend dist to backend/static..."
rm -rf backend/static
cp -r frontend/dist backend/static

echo "Build complete"
