import os
import json
import logging
from openai import AsyncOpenAI

# Initialize Vultr Client (Serverless Inference)
vultr_client = AsyncOpenAI(
    api_key=os.getenv("VULTR_API_KEY"),
    base_url="https://api.vultrinference.com/v1"
)

# Initialize Cerebras Client (Direct)
cerebras_client = AsyncOpenAI(
    api_key=os.getenv("CEREBRAS_API_KEY"),
    base_url="https://api.cerebras.ai/v1"
)

async def verify_threat_with_vultr(text: str) -> bool:
    """
    Uses Vultr Serverless Inference (Llama 2/3) to cross-verify the threat.
    Returns True if Vultr confirms it is a scam, False otherwise.
    """
    if not os.getenv("VULTR_API_KEY"):
        logging.warning("VULTR_API_KEY missing. Skipping verification.")
        return True # Fail open

    try:
        response = await vultr_client.chat.completions.create(
            model="llama2-70b-chat-Q5_K_M", # Using available Vultr model
            messages=[
                {"role": "system", "content": "You are a fraud detection expert. Reply strictly 'CONFIRM' if this is a scam or 'DISMISS' if safe."},
                {"role": "user", "content": text}
            ],
            max_tokens=10
        )
        verdict = response.choices[0].message.content.strip().upper()
        logging.info(f"Vultr Verification Verdict: {verdict}")
        return "CONFIRM" in verdict
    except Exception as e:
        logging.error(f"Vultr verification failed: {e}")
        return True # Fail open for safety

async def analyze_threat(text: str) -> dict:
    """
    Analyzes the text for potential threats using Raindrop SmartInference
    routing to Cerebras Llama 3.1 70b, then verifies with Vultr.
    """
    prompt = (
        "You are a security guardian. Analyze this text for social engineering or financial fraud. "
        "If it indicates a scam (urgency, financial demand, threats), output JSON: "
        "{ 'is_threat': true, 'confidence': float, 'reason': 'Financial Pressure' }. "
        "Otherwise { 'is_threat': false, 'confidence': float, 'reason': 'Safe' }. "
        "Do not output markdown code blocks, just the JSON string."
    )
    
    import time
    start_time = time.time()
    
    # 0. Fast Pass: Ignore short inputs (greetings, silence hallucinations)
    if len(text.strip()) < 15 or text.lower().strip() in ["hello.", "hello", "hi", "who are you"]:
        logging.info("Input too short or generic. Ignoring threat check.")
        return {"is_threat": False, "confidence": 0.0, "reason": "Input too short"}

    try:
        # 1. Primary Analysis (Cerebras Llama 3.3 70b)
        t1 = time.time()
        response = await cerebras_client.chat.completions.create(
            model="llama-3.3-70b",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": text}
            ],
            max_tokens=150, # Limit generation length for speed
            response_format={"type": "json_object"}
        )
        cerebras_duration = time.time() - t1
        logging.info(f"Cerebras Inference Time: {cerebras_duration:.2f}s")
        
        content = response.choices[0].message.content
        content = content.replace("```json", "").replace("```", "").strip()
        result = json.loads(content)
        
        # 2. Secondary Verification (Vultr)
        # OPTIMIZATION: Only verify if confidence is low/medium (<= 0.8)
        # If Cerebras is > 80% sure, we trust it to save time.
        if result.get("is_threat"):
            confidence = result.get("confidence", 0.0)
            
            if confidence > 0.8:
                logging.info(f"High confidence threat ({confidence}). Skipping Vultr verification for speed.")
            else:
                logging.info(f"Medium confidence threat ({confidence}). Verifying with Vultr...")
                t2 = time.time()
                is_confirmed = await verify_threat_with_vultr(text)
                vultr_duration = time.time() - t2
                logging.info(f"Vultr Verification Time: {vultr_duration:.2f}s")
                
                if not is_confirmed:
                    logging.info("Vultr DISMISSED the threat. Overriding to Safe.")
                    result["is_threat"] = False
                    result["reason"] = "Vultr Verification: Dismissed as safe."
                    result["confidence"] = 0.5 # Lower confidence
                else:
                    logging.info("Vultr CONFIRMED the threat.")
        
        total_duration = time.time() - start_time
        logging.info(f"Total Analysis Time: {total_duration:.2f}s")
        return result
    except Exception as e:
        logging.error(f"Error in analyze_threat: {e}")
        return {"is_threat": False, "confidence": 0.0, "reason": f"Error: {str(e)}"}
