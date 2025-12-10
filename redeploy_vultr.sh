#!/bin/bash
HOST="104.238.179.59"
USER="root"
PASS="@i3Ae_q2mCnU=!LS"

echo "=========================================="
echo " 🚀 DEPLOYING FULL STACK TO VULTR ($HOST)"
echo "=========================================="

# 1. Cleaning Remote (Optional, but good for fresh start)
echo "[LOCAL] Cleaning up remote artifacts..."
# We don't want to kill the server if it's the first run, but pkill/docker stop is good safety
# sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $USER@$HOST "docker compose down || true"

# 2. Upload Codebase
echo "[LOCAL] Uploading codebase..."
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $USER@$HOST "mkdir -p /root/app"

sshpass -p "$PASS" rsync -av --progress \
    --exclude 'node_modules' \
    --exclude '__pycache__' \
    --exclude 'venv' \
    --exclude '.git' \
    --exclude '.DS_Store' \
    --exclude 'frontend' \
    ./ $USER@$HOST:/root/app/

# 3. Setup & Launch on Remote
echo "[LOCAL] Launching on remote..."
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $USER@$HOST << 'EOF'
    # 1. Install Docker if missing
    if ! command -v docker &> /dev/null; then
        echo "Installing Docker..."
        apt-get update
        apt-get install -y ca-certificates curl gnupg
        install -m 0755 -d /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        chmod a+r /etc/apt/keyrings/docker.gpg
        echo \
          "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
          "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
          tee /etc/apt/sources.list.d/docker.list > /dev/null
        apt-get update
        apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    fi

    cd /root/app

    # 2. Launch Stack
    echo "Building and Starting Docker Containers..."
    docker compose down
    docker compose up -d --build

    # 3. Prune to save space
    docker system prune -f
EOF

echo "=========================================="
echo " ✅ DEPLOYMENT COMPLETE"
echo "=========================================="
