from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import logging
import json
import os
import asyncio
from deepgram import AsyncDeepgramClient
from services.intelligence import analyze_threat
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
logger = logging.getLogger("SentinelBackend")

@router.websocket("/monitor")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebSocket connection established (Deepgram Mode)")
    
    deepgram_client = AsyncDeepgramClient()
    
    try:
        # 1. Start Deepgram Connection (Async Context Manager)
        # Reverting to manual KeepAlive as native support caused TypeError
        async with deepgram_client.listen.v1.connect(
            model="nova-2",
            language="en-US",
            smart_format=True,
            interim_results=False,
            endpointing=300
        ) as dg_connection:
            
            # 2. Define Receiver Task (Deepgram -> Frontend)
            async def receive_from_deepgram():
                try:
                    async for message in dg_connection:
                        transcript_text = ""
                        is_final = False
                        
                        try:
                            if hasattr(message, "channel"):
                                val = message.channel
                                if hasattr(val, "alternatives"):
                                    alts = val.alternatives
                                    if alts and len(alts) > 0:
                                        transcript_text = alts[0].transcript
                            
                            if hasattr(message, "is_final"):
                                is_final = message.is_final
                        except Exception:
                            pass

                        if transcript_text:
                            response = {"transcript_update": transcript_text}
                            await websocket.send_json(response)

                            if is_final:
                                logger.info(f"Final Transcript: {transcript_text}")
                                asyncio.create_task(process_threat(transcript_text, websocket))
                                
                except Exception as e:
                    # Ignore normal connection closures
                    if "1000" in str(e) or "1011" in str(e):
                         logger.info(f"Deepgram connection closed: {e}")
                    else:
                         logger.error(f"Error in Deepgram receiver: {e}")

            # 3. Define KeepAlive Task (Robust)
            # Sends a blank JSON message periodically to keep the websocket open
            async def keep_alive_loop():
                try:
                    while True:
                        await asyncio.sleep(5)
                        try:
                            # Using raw json string via send_control
                            # If this fails, log it but DO NOT CRASH the loop
                            await dg_connection.send_control('{"type": "KeepAlive"}')
                        except Exception as e:
                            # Log connection issues but keep trying until outer cancellation
                            logger.debug(f"KeepAlive transient error: {e}")
                except asyncio.CancelledError:
                    pass
                except Exception as e:
                    logger.error(f"KeepAlive loop crashed: {e}")

            # Start tasks
            receive_task = asyncio.create_task(receive_from_deepgram())
            keepalive_task = asyncio.create_task(keep_alive_loop())

            # 4. Main Loop: Audio from Frontend -> Deepgram
            try:
                while True:
                    message = await websocket.receive()
                    
                    if "bytes" in message:
                        data = message["bytes"]
                        if len(data) > 0:
                            await dg_connection.send_media(data)
                    
                    elif "text" in message:
                        if message["text"] == "PING":
                            await websocket.send_text("PONG")
            except WebSocketDisconnect:
                logger.info("WebSocket disconnected")
            finally:
                # Cancel background tasks
                receive_task.cancel()
                keepalive_task.cancel()
                try:
                    await receive_task
                    await keepalive_task
                except asyncio.CancelledError:
                    pass

    except Exception as e:
        logger.error(f"Deepgram Connection Error: {e}")
        await websocket.close()

async def process_threat(text: str, websocket: WebSocket):
    """
    Analyzes text for threats and pushes alerts to frontend
    """
    try:
        # Check for length to avoid "Hello" fps
        if len(text) < 15:
            return

        threat_level, reasons = await analyze_threat(text)
        
        # Send full analysis object so frontend handles Red Screen/Globe/etc
        if threat_level > 50:
             alert = {
                "threat_alert": {
                    "level": threat_level,
                    "reasons": reasons,
                    "text": text
                }
             }
             await websocket.send_json(alert)
             
             if threat_level > 80:
                logger.warning(f"HIGH THREAT DETECTED: {reasons}")

    except Exception as e:
        logger.error(f"Threat Analysis Error: {e}")
