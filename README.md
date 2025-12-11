# Project Sentinel 🛡️

**Real-time Voice Anti-Fraud Guardian**

Project Sentinel is an advanced, enterprise-grade AI application designed to protect vulnerable users from voice phishing (vishing) and social engineering scams in real-time. By leveraging high-speed LLM inference and a sophisticated event-driven architecture, Sentinel listens to live audio, analyzes conversation patterns, and provides immediate alerts upon detecting threat indicators.

This documentation is designed to provide comprehensive context for both human developers and LLM agents to understand, execute, and extend the project.

---

## 🏗️ System Architecture

Project Sentinel is built on a modern, decoupled architecture designed for scalability, low latency, and secure data handling.

### **Frontend (Client Layer)**
*   **Path**: `/frontend`
*   **Framework**: React 18 (Vite) with TypeScript.
*   **Key Libraries**:
    *   `framer-motion`: For complex UI animations and the "HoloCard" effect.
    *   `lucide-react`: For iconography.
    *   `react-router-dom`: For client-side routing.
    *   `@stripe/react-stripe-js`: For embedded payment processing.
    *   `@workos-inc/authkit-react`: For handling authentication.
*   **State Management**: Local component state + Context API for global auth/theme.
*   **Real-time Communication**: Native WebSockets for full-duplex audio streaming and alert reception.
*   **UI/UX**: Custom "Hacker-style" aesthetic using CSS Variables (`src/index.css`) and Tailwind CSS.
*   **Audio Processing**: `AudioContext` and `ScriptProcessorNode` (via `useAudioProcessing` hook) for real-time visualization and input stream management.

### **Backend (Service Layer)**
*   **Path**: `/backend`
*   **Framework**: FastAPI (Python 3.10+) for high-performance async I/O.
*   **Entry Point**: `backend/main.py`
*   **Key Services**:
    *   `backend/services/intelligence.py`: Connects to Cerebras for threat analysis.
    *   `backend/services/storage.py`: Manages Raindrop SmartBucket interactions.
    *   `backend/routers/payment.py`: Handles Stripe intent creation and webhooks.
    *   `backend/routers/websocket.py`: Manages real-time socket connections.
*   **Authentication**: WorkOS (AuthKit) for enterprise-ready user management and SSO.
*   **Infrastructure**: Dockerized services for consistent deployment.

### **Cloud & AI Infrastructure (The "Brain")**
*   **Orchestration**: **Raindrop** (LiquidMetal AI) for managing serverless resources and state.
*   **Threat Detection**: **Cerebras Inference** (Llama 3.3-70b) for sub-second semantic analysis of conversation context.
*   **Voice Synthesis**: **ElevenLabs** for generating ultra-realistic, urgent audio warnings.
*   **Storage**: **Raindrop SmartBuckets** for secure, searchable evidence storage.
    *   `sentinel-evidence-sb`: Stores JSON logs of flagged calls.
*   **Memory**: **Raindrop SmartMemory** (Vector Store) for retrieving known scam patterns and maintaining context. (Bucket: `agent-memory-sb`)
*   **Hosting**: Vultr Cloud Compute (Ubuntu 22.04), managed via deployment scripts.

---

## ⚡ Technology Stack

High-performance, scalable, and modern technologies powering Project Sentinel.

### **Core**
*   **Languages**: TypeScript (Frontend), Python 3.12 (Backend), Bash (Scripts).
*   **Aesthetic**: "Cyber-Hacker" Theme (Custom CSS Variables, Tailwind CSS).

### **Frontend (Client)**
*   **Framework**: React 18
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS, PostCSS.
*   **Motion & 3D**:
    *   `framer-motion`: High-performance animations.
    *   `three.js` / `@react-three/fiber`: 3D rendering.
    *   `cobe`: Lightweight WebGL globe.
*   **State & Networking**:
    *   Native WebSockets (Real-time Audio).
    *   React Hooks (Local State).
*   **Components**: `lucide-react` (Icons), `recharts` (Data Viz).

### **Backend (Server)**
*   **Framework**: FastAPI (Async Python).
*   **Server**: Uvicorn (ASGI).
*   **Concurrency**: `asyncio` (Event loops for specific non-blocking I/O).
*   **Validation**: Pydantic.
*   **Environment**: `python-dotenv`.

### **Artificial Intelligence (The Brain)**
*   **Speech-to-Text (STT)**: **Deepgram Nova-2** (Streaming WebSocket API).
*   **Threat Detection Engine**: **Cerebras** (Llama 3.3-70b via OpenAI-compatible SDK).
*   **Secondary Verification**: **Vultr Serverless Inference** (Llama 2 via OpenAI-compatible SDK).
*   **Text-to-Speech (TTS)**: **ElevenLabs** (Turbo v2 for low-latency voice generation).

### **Cloud & Infrastructure**
*   **Compute**: **Vultr Cloud Compute** (Ubuntu 24.04, Shared vCPU).
*   **Storage & Memory**: **Raindrop** (LiquidMetal AI SmartBuckets).
    *   `sentinel-evidence-sb`: Logs & Evidence.
    *   `agent-memory-sb`: Vector context.
*   **Orchestration**: Docker (Containerization).
*   **Reverse Proxy**: Nginx (Production only).

### **Third-Party APIs**
*   **Authentication**: **WorkOS** (AuthKit).
*   **Payments**: **Stripe** (Subscriptions, Checkout, Webhooks).

---

## 📂 Directory Structure

```text
/
├── .env                  # Root environment variables (Critical)
├── frontend/             # React Application
│   ├── src/
│   │   ├── components/   # UI Components (HoloCard, PaymentGateway, Dashboard)
│   │   ├── hooks/        # Logic Hooks (useAuth, useAudioProcessing)
│   │   └── config/       # Stripe & Theme Config
│   ├── .env              # Frontend-specific env override (optional)
│   └── vite.config.ts    # Build config (configured to load root .env)
├── backend/              # FastAPI Application
│   ├── routers/          # API & WebSocket Endpoints
│   ├── services/         # Business Logic (Intelligence, Storage)
│   ├── main.py           # App Entry
│   └── requirements.txt  # Python Dependencies
├── deploy_vultr.md       # Deployment Instructions
├── redeploy_vultr.sh     # Script: Syncs code to Vultr
├── setup_remote.sh       # Script: Bootstraps Vultr server
└── raindrop.manifest     # LiquidMetal Raindrop Config
```

---

## 🚀 Key Workflows

### 1. 🧠 Real-Time AI Threat Detection
*   **File**: `backend/services/intelligence.py`
*   **Flow**:
    1.  Frontend streams audio text (STT) via WebSocket to `backend/routers/websocket.py`.
    2.  `websocket.py` accumulates context and triggers `IntelligenceService.analyze_threat()`.
    3.  `intelligence.py` prompts **Cerebras** (Llama 3.3) with the `SYSTEM_PROMPT`.
    4.  LLM responds with JSON: `{"is_threat": boolean, "score": 0-100, "reason": "string"}`.
    5.  Result is pushed back to Frontend via WebSocket.
    6.  **ThreatMeter** updates and if `is_threat` is true, **ElevenLabs** generates a warning audio.

### 2. 💳 Payment & Upgrade Flow
*   **Files**: `backend/routers/payment.py`, `frontend/src/components/payment/PaymentGateway.tsx`
*   **Flow**:
    1.  User clicks "UPGRADE" in Dashboard.
    2.  Frontend calls `POST /api/payment/create-checkout-session`.
    3.  Backend creates Stripe Subscription with `payment_behavior='default_incomplete'`.
    4.  Backend returns `clientSecret`.
    5.  Frontend renders `PaymentElement` inside `PaymentGateway` modal.
    6.  User completes payment -> Stripe Webhook (optional) or client-side success callback.

### 3. ☁️ Deployment (Vultr)
*   **Files**: `redeploy_vultr.sh`, `setup_remote.sh`
*   **Process**:
    1.  Run `./redeploy_vultr.sh` locally.
    2.  Script uses `rsync` to upload `backend/` and `.env` to Vultr (`root@45.76.254.160`).
    3.  Script executes `systemctl restart sentinel-backend` on remote.
    4.  Nginx on Vultr proxies port 80 (HTTP) to 8000 (Uvicorn).

---

## 🛠️ Setup & Execution

### Prerequisites
*   Node.js 18+
*   Python 3.10+
*   Stripe CLI (optional, for webhook testing)
*   Raindrop CLI (authenticated)

### Environment Variables (`.env`)
Create a `.env` file in the **root directory**.

```ini
# --- CORE API KEYS ---
LIQUIDMETAL_API_KEY=lm_apikey_...
RAINDROP_API_KEY=rd_apikey_...
CEREBRAS_API_KEY=csk-...
ELEVENLABS_API_KEY=sk_...
VULTR_API_KEY=...

# --- AUTHENTICATION (WorkOS) ---
WORKOS_CLIENT_ID=client_...
WORKOS_API_KEY=sk_test_...
VITE_WORKOS_CLIENT_ID=client_...
VITE_WORKOS_REDIRECT_URI=http://localhost:5173/

# --- PAYMENTS (Stripe) ---
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...  # MUST MATCH ABOVE
VITE_STRIPE_PRICE_ID=price_...

# --- CONFIG ---
VITE_API_URL=http://localhost:8000
# For Production: VITE_API_URL=http://45.76.254.160:8000
```

### 💻 Local Development

**1. Start Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**2. Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Access at `http://localhost:5173`.

### 🚀 Production Deployment
To deploy changes to the Vultr instance:

```bash
./redeploy_vultr.sh
```
*Note: Ensure you have SSH access to `root@45.76.254.160` configured.*

---

## ⚠️ Common Issues & Fixes

*   **"Missing API Key" in Payment (Frontend)**:
    *   **Fix**: Ensure `VITE_STRIPE_PUBLISHABLE_KEY` is in the **root** `.env` file and `vite.config.ts` has `envDir: '..'`. Restart frontend.
*   **Backend 500 on Payment**:
    *   **Fix**: Often due to Stripe API version mismatch. Check `backend/routers/payment.py` uses correct fallback logic for `latest_invoice`.
*   **WebSocket Connection Refused**:
    *   **Fix**: Ensure `VITE_API_URL` points to the correct backend (localhost vs Vultr IP) and doesn't have a trailing slash.

---

**Project Sentinel © 2025 // SECURING THE HUMAN LAYER**
