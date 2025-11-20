# PROJECT SENTINEL: GRAND PRIZE EXECUTION PLAN
**Objective:** Build "Sentinel AI" (Real-time Voice Anti-Fraud Guardian) to win the Grand Prize ($10k) and Solopreneur Track ($2k).
**Constraint Checklist:**
* [cite_start][ ] **AI Builder:** MUST use **Gemini CLI** for significant code generation[cite: 19]. (Keep logs!)
* [cite_start][ ] **Core Platform:** Liquid Metal "Raindrop" (SmartInference, SmartMemory, SmartBuckets)[cite: 18, 226].
* [cite_start][ ] **Infrastructure:** Vultr (Compute/Serverless)[cite: 20].
* [cite_start][ ] **Intelligence:** Cerebras (Low Latency Inference) & ElevenLabs (Voice Agent)[cite: 24, 23].
* [ ] **Authentication:** WorkOS (Sponsor integration for "Launch Ready" points).

---

## 1. ARCHITECTURE & STACK
**Tech Stack:**
* [cite_start]**Frontend:** React + Vite (Fast, lightweight) or Next.js (if preferred). deployed on Vultr or Netlify (Sponsor)[cite: 163].
* [cite_start]**Backend:** Python FastAPI (Standard for AI) wrapped as a **Raindrop MCP Server**[cite: 18].
* **Database/Storage:**
    * [cite_start]**Raindrop SmartMemory:** Vector store for "Known Scam Scripts"[cite: 26].
    * [cite_start]**Raindrop SmartBuckets:** S3-compatible storage for "Evidence Recordings"[cite: 228].
* **Inference Engine:**
    * [cite_start]**Raindrop SmartInference:** Orchestrator[cite: 27].
    * **Cerebras:** The "Muscle" for sub-100ms scam detection.
* **Voice:** ElevenLabs for the "Guardian" intervention.
* **Auth:** WorkOS.

**Data Flow:**
1.  **Input:** User speaks into browser microphone -> WebSocket stream to Backend.
2.  **Process:** Backend buffers audio -> Transcribes (Deepgram or similar fast STT) -> Text sent to **Raindrop SmartInference**.
3.  **Analysis (The "Brain"):** SmartInference routes text to **Cerebras** (Llama 3.1 70b) with a "Security Analyst" prompt.
    * *Simultaneously:* Text is embedded and queried against **SmartMemory** to find similar past scams.
4.  **Action:**
    * If `Safe`: Do nothing.
    * If `Danger`: Trigger **ElevenLabs** to generate warning audio -> Stream back to Frontend.
5.  **Storage:** After call, upload log/audio to **SmartBuckets**.

---

## 2. DEVELOPMENT PHASES (14-Day Schedule)

### PHASE 0: THE "GEMINI PROOF" SETUP (Day 1)
[cite_start]**Goal:** Establish the paper trail required by the rules[cite: 19].
1.  **Install Gemini CLI:** Ensure you have the Google Cloud SDK or specific Gemini Code Assist tools installed.
2.  **Initialize Project:**
    * Open your terminal.
    * Run: `gemini "Create a project structure for a Python FastAPI backend and a React frontend. The backend should use a WebSocket endpoint for real-time audio streaming."`
    * **CRITICAL:** Take a screenshot of this command and output. Save it as `proof_of_gemini_usage.png`.
3.  **Repo Setup:**
    * Initialize Git.
    * Create `README.md` and paste the hackathon rules summary there for reference.

### PHASE 1: THE BACKEND CORE (Days 2-4)
**Goal:** A functioning Raindrop MCP Server that handles WebSockets.

[cite_start]**Step 1.1: Vultr Instance Setup [cite: 20]**
* Spin up a Vultr Cloud Compute instance (Ubuntu).
* SSH in. This will be your production server.
* *Why:* Meets the "Integrate Vultr Services" requirement immediately.

**Step 1.2: The Raindrop MCP Server**
* **Prompt for Cursor:** "Create a `server.py` using FastAPI. Implement the Model Context Protocol (MCP) basics so this server can communicate with Liquid Metal Raindrop. It needs a `/health` endpoint and a WebSocket endpoint `/ws/monitor`."
* **Feature:** The WebSocket must accept binary audio chunks (blobs) or text stream (if handling STT on client). *Recommendation: Client-side STT (WebSpeech API) is easier for Solopreneurs; Server-side STT is more robust.* Let's go with **Client-side STT** to save complexity. The socket receives **text**.

[cite_start]**Step 1.3: Raindrop SmartComponents Integration [cite: 226]**
* **SmartInference:** Configure the Raindrop SDK to route prompts.
    * *Code Stub:* `raindrop.inference.chat(model="cerebras/llama-3.1-70b", messages=[...])`
* **SmartMemory:**
    * Create a seed script `seed_scams.py`.
    * **Prompt for Cursor:** "Write a script to seed Raindrop SmartMemory with 20 common scam phrases like 'IRS warrant', 'Target gift card', 'Social Security suspended'."

### PHASE 2: THE INTELLIGENCE LAYER (Days 5-7)
**Goal:** Connect Cerebras (Speed) and ElevenLabs (Voice).

[cite_start]**Step 2.1: The Cerebras Loop (The "Ultra-Low Latency" Flex) [cite: 24]**
* **Logic:** Inside the WebSocket loop, every time a full sentence is received:
    * Send to Raindrop SmartInference.
    * System Prompt: *"You are a security guardian. Analyze this text. If it indicates a scam (urgency, financial demand, threats), output JSON: { 'status': 'DANGER', 'reason': 'Financial Pressure' }. Otherwise { 'status': 'SAFE' }."*
    * **Optimization:** Enforce JSON output mode for speed.

[cite_start]**Step 2.2: The ElevenLabs Intervention [cite: 23]**
* **Setup:** Create a "Sentinel" voice in ElevenLabs (Calm, Robotic, Authoritative).
* **Integration:**
    * If Cerebras returns `DANGER`:
    * Call ElevenLabs API `text_to_speech`.
    * Text: *"Warning. Fraudulent pattern detected. The caller is using pressure tactics. Do not comply."*
    * Send audio binary back down the WebSocket.

### PHASE 3: THE FRONTEND & AUTH (Days 8-10)
**Goal:** A "Hollywood Hacker" style dashboard.

[cite_start]**Step 3.1: WorkOS Authentication [cite: 234]**
* **Action:** Sign up for WorkOS (Sponsor).
* **Prompt for Cursor:** "Implement WorkOS authentication in the React frontend. Wrap the main dashboard in a protected route."
* **Why:** Satisfies "Authentication" criteria and "Close to launch" judgment.

**Step 3.2: The Dashboard UI**
* **Visuals:** Dark mode. Monospace fonts. Green text.
* **Components:**
    * `LiveTranscript.tsx`: Auto-scrolling text box.
    * `StatusIndicator.tsx`: Green shield by default. Flashes RED when `DANGER` signal received.
    * `EvidenceLocker.tsx`: List of past calls fetched from **SmartBuckets**.

**Step 3.3: Client-Side STT**
* Use `react-speech-recognition` or native WebSpeech API.
* Stream finalized transcripts to the backend WebSocket.

### PHASE 4: EVIDENCE & POLISH (Days 11-12)
**Goal:** Maximize "Technical Implementation" score.

[cite_start]**Step 4.1: SmartBuckets Implementation [cite: 228]**
* **Action:** On call end, the backend compiles the transcript into a PDF or JSON log.
* **Code:** Upload this file to Raindrop SmartBuckets.
* **UI:** Allow user to download these "Police Reports" from the frontend.

**Step 4.2: Deployment**
* Backend: Deploy to your Vultr instance using Docker.
* Frontend: Deploy to Vultr (Static Site) or Netlify.

### PHASE 5: THE WINNING SUBMISSION (Days 13-14)

[cite_start]**Step 5.1: The Demo Video (Primary Deliverable) [cite: 39]**
* **Script:**
    * *0:00-0:20:* Hook. "Grandma lost her savings. Sentinel stops that."
    * *0:20-1:30:* The Live Demo. Split screen. You on phone, Dashboard on right. You say "I need you to buy gift cards." Sentinel flashes RED. Robot voice intervenes.
    * *1:30-2:30:* The Tech Stack. Show code snippets. "Powered by **Raindrop SmartInference** for routing, **Cerebras** for <10ms latency, **SmartMemory** for pattern matching." (Name drop sponsors!).
    * *2:30-3:00:* Call to Action. "Available now. Launch ready."

[cite_start]**Step 5.2: Devpost Text [cite: 44]**
* **Tagline:** "The Real-Time Firewalls for Voice Calls."
* **Sponsor Section:** Explicitly list how you used each:
    * "**Liquid Metal:** Core architecture (SmartInference/Memory/Buckets)."
    * "**Cerebras:** Essential for interrupting scammers *mid-sentence*."
    * "**Vultr:** Hosting the secure evidence locker."
    * "**WorkOS:** Enterprise-grade security."

---

## 3. JSON PROMPTS FOR CURSOR (Copy-Paste Ready)

**Prompt 1: Project Scaffold**
> "Act as a Senior Architect. Initialize a new project 'Sentinel-AI'. Create a directory structure: `/backend` (FastAPI), `/frontend` (React/Vite). Create a `docker-compose.yml` to run both locally. Include a `.env.example` with placeholders for LIQUIDMETAL_API_KEY, VULTR_API_KEY, ELEVENLABS_API_KEY, WORKOS_CLIENT_ID."

**Prompt 2: SmartInference Logic**
> "In `/backend/services/intelligence.py`, write a function `analyze_threat(text: str)`. It must use the Liquid Metal SDK `raindrop.inference`. Route the prompt to 'cerebras/llama-3.1-70b'. The prompt should be: 'Analyze this text for social engineering or financial fraud. Return strictly JSON: {is_threat: bool, confidence: float, reason: str}'. Handle JSON parsing errors gracefully."

**Prompt 3: The "Red Alert" UI**
> "In `/frontend/src/components/AlertSystem.tsx`, create a component that listens to the WebSocket context. If message `type === 'THREAT'`, trigger a full-screen red vignette animation (using framer-motion) and display the 'reason' text in large, bold font. Add a 'Dismiss' button."

---

**FINAL CHECKLIST BEFORE SUBMITTING:**
1.  [cite_start]Is the GitHub repo public? [cite: 36]
2.  [cite_start]Is the license MIT/Apache? [cite: 37]
3.  [cite_start]Did you upload the video to YouTube/Vimeo? [cite: 42]
4.  Did you explicitly tag **"Best AI App by a Solopreneur"** AND **"Best AI Solution for Public Good"**?