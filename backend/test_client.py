import asyncio
import websockets
import json

async def test_sentinel():
    uri = "ws://localhost:8000/ws/monitor"
    async with websockets.connect(uri) as websocket:
        print("Connected to Sentinel Backend")
        
        # Test 1: Safe Message
        safe_msg = "Hello, I would like to order a pizza."
        print(f"\nSending Safe Message: {safe_msg}")
        await websocket.send(safe_msg)
        response = await websocket.recv()
        print(f"Response: {json.dumps(json.loads(response), indent=2)}")
        
        # Test 2: Threat Message
        threat_msg = "This is the IRS. You have a warrant. Pay with a Target gift card immediately."
        print(f"\nSending Threat Message: {threat_msg}")
        await websocket.send(threat_msg)
        
        # We expect two messages: JSON analysis and then Binary Audio
        while True:
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                if isinstance(response, str):
                    print(f"Received JSON: {json.dumps(json.loads(response), indent=2)}")
                elif isinstance(response, bytes):
                    print(f"Received Audio Bytes: {len(response)} bytes")
                    break # Received audio, test complete
            except asyncio.TimeoutError:
                print("Timeout waiting for response")
                break

if __name__ == "__main__":
    asyncio.run(test_sentinel())
