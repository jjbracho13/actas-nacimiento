#!/bin/bash
# Build script for Render
set -e

echo "=== Installing backend dependencies ==="
pip install -r backend/requirements.txt

echo "=== Copying pre-built frontend to backend/static ==="
mkdir -p backend/static
cp -r frontend/dist/* backend/static/

echo "=== Build complete ==="
