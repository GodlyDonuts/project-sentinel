# 🚀 Project Sentinel: Dual-Server Deployment Guide

This guide explains how to deploy Project Sentinel across your **CPU Server** (The Brain) and **GPU Server** (The Ears).

## 🌍 Architecture
*   **Server A (CPU)**: Runs the Python/FastAPI Backend.
    *   *Role*: Auth, Payment, Threat Logic, WebSocket Hub.
    *   *IP*: `45.76.254.160` (Example)
*   **Server B (GPU)**: Runs the Whisper Inference Service (Dockerized).
    *   *Role*: Heavy Audio Transcription.
    *   *IP*: `GPU_SERVER_IP` (You must configure this).

---

## 🛠️ Step 1: Configure Environment (`.env`)

In your local project root (`.env`), you must tell the Brain where the Ears are.

```ini
# Add this line to your .env
WHISPER_URL=http://<GPU_SERVER_IP>:8001/transcribe
```
*Replace `<GPU_SERVER_IP>` with the actual public IP address of your GPU server.*

---

## 🧠 Step 2: Deploy The Brain (CPU Server)

1.  Open `deploy_backend.sh`.
2.  Update the `HOST` variable at the top with your CPU Server IP.
3.  Run the deployment:
    ```bash
    ./deploy_backend.sh
    ```
    *This uploads your backend code and `.env` file, restarts the minimal backend service.*

---

## 👂 Step 3: Deploy The Ears (GPU Server)

1.  Open `deploy_whisper.sh`.
2.  Update the `HOST` variable at the top with your GPU Server IP.
3.  Run the deployment:
    ```bash
    ./deploy_whisper.sh
    ```
    *This uploads the `whisper-service` folder, builds the Docker container with NVIDIA drivers, and exposes port 8001.*

---

## ✅ Verification
1.  **Check GPU Service**: Open `http://<GPU_SERVER_IP>:8001/docs` in your browser. You should see the FastAPI Swagger UI.
2.  **Check Backend**: Open `http://<CPU_SERVER_IP>:8000/health`.
3.  **Test Integration**: Use the Sentinel Dashboard. Speak deeply. The logs on the CPU server (`/root/backend/app.log`) should show:
    ```text
    INFO: Sending audio to Whisper...
    INFO: 🎤 Transcript: "This is a test..."
    ```
