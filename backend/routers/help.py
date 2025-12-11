from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import google.generativeai as genai
import os
import logging
from typing import List, Optional

router = APIRouter()
logger = logging.getLogger("SentinelBackend")

# Configure Gemini
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY not found in environment variables. Help Agent will fail.")

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    response: str

SYSTEM_PROMPT = """
You are the **Sentinel System Core**, an advanced AI assistant for the 'Project Sentinel' platform.
Your ONLY purpose is to answer questions regarding Project Sentinel.
Do not answer general knowledge questions, write poems, or do math unless it relates to Sentinel's architecture.

**System Data:**
- **Name**: Sentinel AI (Project Sentinel)
- **Purpose**: Real-time Voice Anti-Fraud Guardian. We protect vulnerable users (like the elderly) from phone scams.
- **Architecture**:
    - **Frontend**: React + Vite + Tailwind (Cinematic OS Theme).
    - **Backend**: FastAPI (Python).
    - **Speech-to-Text**: Deepgram Nova-2.
    - **Threat Detection**: Cerebras Llama 3.1 8B (fastest inference).
    - **Data/Memory**: Raindrop.io (SmartBuckets for Evidence & Agent Memory).
    - **Infrastructure**: Vultr Cloud Compute (High Performance).
    - **Payments**: Stripe.
- **Key Features**:
    - **Ghost Mode**: Stealth intervention (Premium).
    - **Live Transcript**: Real-time visualization.
    - **Threat Meter**: Red alert system.

**Tone**:
- Helpful, technical but accessible, slightly "sci-fi" / "system operational" persona.
- Keep answers concise and actionable.

**Handling User Queries**:
- If asked "How do I sign out?", tell them: "Click your profile picture in the top right, then select Sign Out."
- If asked "What is Ghost Mode?", explain: "Ghost Mode allows a verified family member to silently join the call and listen in to protect the user without the scammer knowing."
- If asked about irrelevant topics (e.g. "Who is the president?"), reply: "SYSTEM ALERT: Query outside operational parameters. Restricted to Project Sentinel inquiries only."
"""

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    if not GENAI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured.")

    try:
        # Construct the chat history for Gemini
        # We'll use a simplified stateless approach for now, or build a chat session.
        # Using Gemini Flash Latest to avoid specific version quotas/404s.
        
        model = genai.GenerativeModel('gemini-flash-latest')
        
        chat = model.start_chat(history=[])
        
        # Inject System Prompt implicitly by sending it as the first user message? 
        # Or better yet, use the system_instruction if available, or just prepend context.
        # Verified approach: Prepend context to the latest message or use simple generation.
        
        full_prompt = f"{SYSTEM_PROMPT}\n\nUser: {request.message}\nSentinel Core:"
        
        response = model.generate_content(full_prompt)
        
        return ChatResponse(response=response.text)

    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        raise HTTPException(status_code=500, detail="Agent Communication Failure")
