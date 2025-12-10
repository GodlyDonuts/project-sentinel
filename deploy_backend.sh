#!/bin/bash

# --- CONFIGURATION: CPU SERVER ---
HOST="45.76.254.160" # Replace with your CPU Server IP if different
USER="root"
PASS='5m?G@5Fg}kpd!Jo)'
BACKEND_DIR="backend"

echo "=========================================="
echo " DEPLOYING BRAIN (BACKEND) TO CPU SERVER"
echo " Target: $USER@$HOST"
echo "=========================================="

# 1. Clean up old code (Optional, safe to keep for logs)
# ssh -o StrictHostKeyChecking=no $USER@$HOST "rm -rf /root/backend"

# 2. Upload Backend Code
echo "[LOCAL] Syncing backend code..."
sshpass -p "$PASS" rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '__pycache__' \
    --exclude 'venv' \
    --exclude '.git' \
    --exclude '.DS_Store' \
    "$BACKEND_DIR" $USER@$HOST:/root/

# 3. Upload .env (Crucial for linking to Whisper)
echo "[LOCAL] Uploading .env..."
sshpass -p "$PASS" scp -o StrictHostKeyChecking=no .env $USER@$HOST:/root/backend/.env

# 4. Upload & Run Setup Script for Backend
echo "[LOCAL] Configuring remote server..."
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $USER@$HOST << 'EOF'
    # Ensure Python & Pip are installed (Ubuntu 24.04 uses python3 which is 3.12)
    apt-get update && apt-get install -y python3 python3-pip python3-venv python3-full
    
    cd /root/backend
    
    # Create Venv if not exists
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Kill existing Uvicorn process (simple restart)
    pkill -f "uvicorn main:app" || true
    
    # Start Backend in Background (Screen or Nohup recommended for prod, but this works for quick dev)
    # Ideally use systemd (see systemd setup below)
    nohup uvicorn main:app --host 0.0.0.0 --port 8000 > app.log 2>&1 &
    
    echo "✅ Backend (Brain) Deployed & Restarted on Port 8000"
EOF

echo "=========================================="
echo " BRAIN DEPLOYMENT COMPLETE"
echo "=========================================="
