#!/bin/bash
set -e

echo ">>> [REMOTE] Starting setup..."

# 1. System Updates & Dependencies
export DEBIAN_FRONTEND=noninteractive
echo ">>> [REMOTE] Updating apt and installing system dependencies..."
apt-get update -y
apt-get install -y python3-pip python3-venv python3-dev build-essential

# 2. Virtual Environment
echo ">>> [REMOTE] Setting up virtual environment..."
if [ -d "/root/venv" ]; then
    echo ">>> [REMOTE] Existing venv found. Reusing..."
else
    python3 -m venv /root/venv
fi

source /root/venv/bin/activate

# 3. Python Dependencies
echo ">>> [REMOTE] Installing Python requirements..."
pip install --upgrade pip
pip install -r /root/backend/requirements.txt

# 4. Start Application
echo ">>> [REMOTE] Starting Uvicorn server..."
cd /root/backend

# Kill any existing uvicorn processes just in case
pkill -f uvicorn || true

# Start in background
# nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > /root/backend.log 2>&1 &
# Using 'setsid' or just nohup and disown to ensure it stays alive after SSH disconnect
nohup /root/venv/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > /root/backend.log 2>&1 &

echo ">>> [REMOTE] Server started! Logs are at /root/backend.log"
sleep 2
pgrep -f uvicorn
