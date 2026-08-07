#!/bin/bash

set -e

echo "=== ResumeIQ API — Starting Production Server ==="

# Number of workers (default: 2, configurable via env)
WORKERS="${GUNICORN_WORKERS:-2}"

# Bind address (default: 0.0.0.0:8000, configurable via env)
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8000}"

echo "Workers: $WORKERS"
echo "Bind: $HOST:$PORT"

exec gunicorn app.main:app \
    --workers "$WORKERS" \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind "$HOST:$PORT" \
    --timeout 120 \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --access-logfile "-" \
    --error-logfile "-" \
    --log-level info
