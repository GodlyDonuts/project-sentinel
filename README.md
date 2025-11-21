#AUTH DOES NOT WORK I REPAT AUTH DOES NOT WORK AAHHAH HHRHAHRHAHRHHA HSFHHF

# Project Sentinel

## Overview
Real-time Voice Anti-Fraud Guardian.

## Hackathon Rules Summary
- **AI Builder:** Must use Gemini CLI.
- **Core Platform:** Liquid Metal "Raindrop".
- **Infrastructure:** Vultr.
- **Intelligence:** Cerebras & ElevenLabs.
- **Authentication:** WorkOS.

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend dev, optional if using Docker)
- Python 3.9+ (for local backend dev, optional if using Docker)

### Environment Setup
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. (Optional) Fill in your API keys in `.env`.
   - `LIQUIDMETAL_API_KEY`: For Raindrop services.
   - `ELEVENLABS_API_KEY`: For voice generation.
   - `WORKOS_CLIENT_ID`: For authentication.
   *Note: The system will use robust mocks if keys are missing.*

### Running with Docker (Recommended)
1. Build and start the services:
   ```bash
   docker-compose up --build
   ```
2. Access the application:
   - **Frontend (Dashboard):** [http://localhost:5173](http://localhost:5173)
   - **Backend (API Docs):** [http://localhost:8000/docs](http://localhost:8000/docs)

### Manual Run (Development)
**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Usage Guide
1. Open the Dashboard.
2. Click "ENTER SECURE TERMINAL" (Mock login will bypass auth if keys are missing).
3. Click "ACTIVATE GUARDIAN" to start monitoring.
4. Speak into your microphone.
   - **Safe Test:** "Hello, how are you?"
   - **Threat Test:** "This is the IRS. You have a warrant. Pay with a gift card."
5. Watch the "Red Alert" trigger and listen for the audio warning.
6. Click "STOP MONITORING" to save the session to the Evidence Locker.
# project-sentinel
