#!/bin/bash
# Build script for Render Python runtime
set -e

echo "=== Installing Node.js ==="
curl -fsSL https://nodejs.org/dist/v20.18.0/node-v20.18.0-linux-x64.tar.xz | tar -xJ -C /usr/local --strip-components=1

echo "=== Verifying Node ==="
node --version
npm --version

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
