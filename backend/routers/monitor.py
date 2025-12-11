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
    ws_lock = asyncio.Lock()  # Synchronize writes
    
    # helper to check threats (Inner function captures websocket & lock)
    async def process_threat_inner(text: str):
        try:
            if len(text) < 25: # limit analysis to sentences with enough context
                return

            result = await analyze_threat(text)
            
            is_threat = result.get("is_threat", False)
            confidence_score = result.get("confidence", 0.0)
            reasons = result.get("reason", "Unknown")
            
            threat_level = int(confidence_score * 100)
            
            # Send full analysis object
            if threat_level > 50:
                 alert = {
                    "analysis": {
                        "is_threat": True,
                        "confidence": threat_level,
                        "reason": reasons
                    }
                 }
                 # CRITICAL: Lock usage
                 async with ws_lock:
                     await websocket.send_json(alert)
                 
                 if threat_level > 80:
                    logger.warning(f"HIGH THREAT: {reasons}")

        except Exception as e:
            logger.error(f"Threat Analysis Error: {e}")

    try:
        async with deepgram_client.listen.v1.connect(
            model="nova-2",
            language="en-US",
            smart_format=True,
            interim_results=True,
            endpointing=300
        ) as dg_connection:
            
            async def receive_from_deepgram():
                conversation_history = []
                try:
                    async for message in dg_connection:
                        transcript_text = ""
                        is_final = False
                        
                        try:
                            if isinstance(message, dict):
                                msg_channel = message.get("channel")
                                msg_is_final = message.get("is_final")
                            else:
                                msg_channel = getattr(message, "channel", None)
                                msg_is_final = getattr(message, "is_final", None)

                            if msg_is_final is not None:
                                is_final = msg_is_final

                            if msg_channel:
                                if isinstance(msg_channel, dict):
                                    alts = msg_channel.get("alternatives", [])
                                else:
                                    alts = getattr(msg_channel, "alternatives", [])

                                if alts and len(alts) > 0:
                                    first_alt = alts[0]
                                    if isinstance(first_alt, dict):
                                        transcript_text = first_alt.get("transcript", "")
                                    else:
                                        transcript_text = getattr(first_alt, "transcript", "")
                        except Exception as parse_err:
                            logger.error(f"Parsing error: {parse_err}")

                        if transcript_text:
                            response = {
                                "transcript_update": transcript_text,
                                "is_final": is_final
                            }
                            # Capture lock for safety
                            async with ws_lock:
                                await websocket.send_json(response)

                            current_context = conversation_history[:] 
                            current_context.append(transcript_text)
                            full_context = " ".join(current_context)
                            
                            if is_final:
                                conversation_history.append(transcript_text)

                            # Fire and forget analysis
                            asyncio.create_task(process_threat_inner(full_context))
                                
                except Exception as e:
                    logger.info(f"Deepgram receiver closed: {e}")
                finally:
                     try:
                         # Force close to reset state if loop dies
                         await websocket.close()
                     except:
                         pass

            async def keep_alive_loop():
                try:
                    while True:
                        await asyncio.sleep(5)
                        try:
                            # Using raw json string via send_control
                            await dg_connection.send_control('{"type": "KeepAlive"}')
                        except Exception as e:
                            logger.debug(f"KeepAlive transient error: {e}")
                except asyncio.CancelledError:
                    pass
                except Exception as e:
                    logger.error(f"KeepAlive loop crashed: {e}")
            
            # Start tasks
            receive_task = asyncio.create_task(receive_from_deepgram())
            keepalive_task = asyncio.create_task(keep_alive_loop())

            try:
                while True:
                    message = await websocket.receive()
                    
                    if "bytes" in message:
                        data = message["bytes"]
                        if len(data) > 0:
                            await dg_connection.send_media(data)
                    
                    elif "text" in message:
                        if message["text"] == "PING":
                            async with ws_lock:
                                await websocket.send_text("PONG")
            except WebSocketDisconnect:
                logger.info("WebSocket disconnected")
            finally:
                receive_task.cancel()
                keepalive_task.cancel()
                try:
                    await receive_task
                    await keepalive_task
                except asyncio.CancelledError:
                    pass

    except Exception as e:
        logger.error(f"Deepgram Connection Error: {e}")
        try:
             await websocket.close()
        except:
             pass
