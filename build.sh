#!/usr/bin/env bash
set -e

echo "Installing Python dependencies..."
pip install --no-cache-dir -r backend/requirements.txt

echo "Building frontend..."
cd frontend
npm ci
npm run build
cd ..

echo "Copying frontend dist to backend/static..."
rm -rf backend/static
cp -r frontend/dist backend/static

echo "Build complete"
