from fastapi import FastAPI, WebSocket

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.websocket("/ws/monitor")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message received: {data}")
