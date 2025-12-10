# Project Sentinel: Backend Architecture Deep Dive

This document provides an immense, service-by-service breakdown of the Project Sentinel backend. It is designed to be the ultimate reference for understanding how the system thinks, remembers, and reacts.

## 🌟 High-Level Overview

The backend is a **FastAPI** application running on Python 3.10+. It is designed as an Event-Driven, Real-Time system rather than a traditional CRUD API.

*   **Core Logic**: Async I/O (using `asyncio`) is used everywhere to handle multiple concurrent WebSocket connections without blocking.
*   **Orchestration**: It acts as a central hub, routing data between **Cerebras** (Intelligence), **Raindrop** (Storage/Memory), **ElevenLabs** (Voice), and the **Frontend Dashboard**.

---

## 📂 Directory: `backend/services/` (The Brain)

This directory contains the core business logic. These modules are independent of the HTTP/WebSocket layer.

### 1. `intelligence.py` (Threat Detection Engine)
This service is responsible for determining if a conversation is a scam.
*   **Dual-Engine Approach**:
    *   **Primary**: **Cerebras Inference** (Llama 3.3-70b). Used for its blistering speed.
    *   **Secondary (Verification)**: **Vultr Serverless Inference** (Llama 2). Used as a "second opinion" to reduce false positives.
*   **`analyze_threat(text)` Flow**:
    1.  Constructs a system prompt defining "Social Engineering Indicators" (urgency, secrecy, financial demand).
    2.  Sends prompt to Cerebras.
    3.  Parses the JSON response.
    4.  **Verification Logic**: If Cerebras is "unsure" (Confidence < 80%) AND indicates a threat, the system calls `verify_threat_with_vultr()`.
    5.  If Vultr disagrees, the threat is dismissed (Safety Mechanism).

### 2. `storage.py` (Raindrop Integration)
This service handles long-term persistence using **LiquidMetal Raindrop**.
*   **Technology**: Raindrop SmartBuckets (S3-compatible but optimized for AI agency).
*   **Bucket**: `sentinel-evidence-sb`
*   **`save_evidence(transcript, logs)`**:
    *   Generates a unique Report ID (UUID).
    *   Bundles the full transcript and the AI's analysis logs into a single JSON object.
    *   Base64 encodes this object (to ensure safe transmission/storage).
    *   Uploads it to the SmartBucket.
*   **`list_evidence()`**:
    *   Queries the bucket for file metadata to populate the "Evidence Locker" in the UI.

### 3. `memory.py` (Vector Context)
*   **Purpose**: Gives the agent "experience".
*   **Mechanism**: Uses Raindrop SmartMemory (Vector Database).
*   **`check_known_scams(text)`**:
    *   Embeds the incoming text.
    *   Queries the `agent-memory-sb` bucket for semantically similar past scams.
    *   Returns "hits" if the current conversation matches a known script (e.g., "IRS Refund Scam").

### 4. `voice.py` (Voice Synthesis)
*   **Provider**: **ElevenLabs** (Turbo v2 Model).
*   **`stream_warning(text)`**:
    *   Generates low-latency audio bytes for the warning message.
    *   Streams these bytes as a generator, allowing the WebSocket to send them packet-by-packet to the frontend for instant playback.

---

## 📂 Directory: `backend/routers/` (The Nervous System)

These files handle external inputs (HTTP requests and WebSockets) and route them to the services.

### 1. `monitor.py` (The Real-Time Loop)
This is the most critical file for the dashboard's functionality.
*   **Endpoint**: `WebSocket /ws/monitor`
*   **The Loop**:
    1.  **Receive**: Waits for text from Frontend (STT).
    2.  **Parallel Execute**: Uses `asyncio.gather` to run `intelligence.analyze_threat()` and `memory.check_known_scams()` simultaneously. This cuts latency by ~40%.
    3.  **Response**: Sends a JSON packet back to Frontend with `{ "analysis": ..., "memory_hits": ... }`.
    4.  **Reaction**: If `is_threat` is true, it immediately invokes `voice.stream_warning()` and pipes the audio bytes to the WebSocket.
    5.  **Shutdown**: On "SESSION_END" or disconnect, triggers `storage.save_evidence()`.

### 2. `payment.py` (The Wallet)
Handles the "Upgrade to Pro" flow via Stripe.
*   **Key Feature**: Embedded Payments.
*   **Logic**:
    *   Creates a Stripe Customer.
    *   Creates a `Subscription` with `payment_behavior='default_incomplete'`. This is crucial for collecting payment details *after* subscription creation.
    *   **Fallback Logic**: Implements a robust retrieval mechanism for the `PaymentIntent`. It explicitly handles cases where Stripe returns an Object vs an ID string, ensuring `client_secret` is always found.

---

## 📂 Directory: `backend/core/`

### 1. `config.py`
*   Loads environment variables using `python-dotenv`.
*   Centralizes configuration for API keys (`RAINDROP_API_KEY`, `CEREBRAS_API_KEY`, etc.).

---

## 🔄 Data Flow Summary

1.  **Input**: User speaks -> Browser STT -> Text.
2.  **Transmission**: Text -> WebSocket (`monitor.py`).
3.  **Processing**:
    *   Text -> `intelligence.py` -> Cerebras LLM.
    *   Text -> `memory.py` -> Raindrop Vector Search.
4.  **Decision**:
    *   If Safe: Update Dashboard UI (Green).
    *   If Threat: Update Dashboard UI (Red) -> Trigger `voice.py` -> ElevenLabs Audio -> Speaker.
5.  **Persistence**:
    *   Session End -> `storage.py` -> Upload JSON to Raindrop SmartBucket.

---

## 🛠️ Infrastructure

*   **Runtime**: Python 3.10
*   **Server**: Uvicorn (ASGI)
*   **Deployment Target**: Vultr Cloud Compute (Ubuntu 22.04).
*   **Deployment Script**: `redeploy_vultr.sh` (Auto-syncs code and restarts systemd service).
