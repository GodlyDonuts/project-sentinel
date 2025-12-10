import os
import json
import base64
import asyncio
import logging
import websockets

logger = logging.getLogger("SentinelVoice")

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_ID = "JBFqnCBsd6RMkjVDRZzb" # Example Voice ID (Rachel)
MODEL_ID = "eleven_flash_v2_5"

async def stream_warning(text: str):
    """
    Generates audio for the warning message using ElevenLabs WebSocket API.
    Yields audio chunks (bytes).
    """
    if not ELEVENLABS_API_KEY:
        logger.warning("ELEVENLABS_API_KEY not found. Streaming mock audio.")
        # Mock: Yield 3 chunks of silence/noise to simulate streaming
        mock_chunk = b'\x00' * 1024 # 1KB of silence
        for _ in range(5):
            yield mock_chunk
            await asyncio.sleep(0.1) # Simulate network latency
        return

    uri = f"wss://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/stream-input?model_id={MODEL_ID}"

    try:
        async with websockets.connect(uri) as websocket:
            # 1. Send the text trigger
            # The API expects a JSON payload with text and generation config
            # For streaming, we send the text and then an empty string to close the stream?
            # Actually, for the input-streaming endpoint, we send JSON messages.
            
            # Initial connection packet (optional config)
            await websocket.send(json.dumps({
                "text": " ", # Prime the connection
                "voice_settings": {"stability": 0.5, "similarity_boost": 0.8},
                "xi_api_key": ELEVENLABS_API_KEY # Auth in payload or header? Usually header is better but WS might need it here or in URL?
                # Docs say: "xi-api-key" header is preferred. websockets.connect supports extra_headers.
            }))
            
            # Wait for initial response?
            
            # Send the actual text
            # We need to send the text followed by a "flush" or end of stream indicator if we want it all now.
            # For this simple case, we just send the text.
            await websocket.send(json.dumps({
                "text": text,
                "try_trigger_generation": True # Force generation immediately
            }))
            
            # Send end of stream message
            await websocket.send(json.dumps({"text": ""}))

            # Receive audio chunks
            while True:
                try:
                    message = await websocket.recv()
                    data = json.loads(message)
                    
                    if data.get("audio"):
                        # Audio is base64 encoded in the JSON response
                        chunk = base64.b64decode(data["audio"])
                        yield chunk
                    
                    if data.get("isFinal"):
                        break
                        
                except websockets.exceptions.ConnectionClosed:
                    logger.info("ElevenLabs WebSocket closed")
                    break
                    
    except Exception as e:
        logger.error(f"ElevenLabs Streaming Error: {e}")
        # Fallback to mock if real API fails
        yield b'\x00' * 1024
