#!/bin/bash

# --- CONFIGURATION: GPU SERVER ---
HOST="REPLACE_WITH_GPU_SERVER_IP" # <--- USER MUST UPDATE THIS
USER="root"
# PASS="..." 
WHISPER_DIR="whisper-service"

echo "=========================================="
echo " DEPLOYING EARS (WHISPER) TO GPU SERVER"
echo " Target: $USER@$HOST"
echo "=========================================="

# 1. Upload Whisper Service Code
echo "[LOCAL] Syncing Whisper code..."
rsync -avz --progress \
    --exclude '__pycache__' \
    --exclude '.git' \
    --exclude '.DS_Store' \
    "$WHISPER_DIR" $USER@$HOST:/root/

# 2. Upload Dockerfile & Requirements
# (Already included in rsync above)

# 3. Setup & Build on Remote GPU Server
echo "[LOCAL] Building & Running on Remote GPU..."
ssh -o StrictHostKeyChecking=no $USER@$HOST << 'EOF'
    # Check if Docker/NVIDIA Runtime is installed
    if ! command -v docker &> /dev/null; then
        echo "Docker not found! installing..."
        curl -fsSL https://get.docker.com | sh
        # Note: You must also install nvidia-container-toolkit manually if not present
    fi

    cd /root/whisper-service

    # Build the 'Ears' Container
    echo "🏗️ Building Whisper Container (This may take a while)..."
    docker build -t sentinel-whisper .

    # Stop old container
    docker stop sentinel-ears || true
    docker rm sentinel-ears || true

    # Run new container with GPU access
    echo "🚀 Starting Whisper Engine..."
    docker run -d \
        --name sentinel-ears \
        --gpus all \
        -p 8001:8001 \
        --restart unless-stopped \
        sentinel-whisper

    echo "✅ Whisper (Ears) Deployed on Port 8001"
EOF

echo "=========================================="
echo " EARS DEPLOYMENT COMPLETE"
echo "=========================================="
