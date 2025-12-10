from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from dotenv import load_dotenv

# Load env before imports
load_dotenv()

from routers import auth, monitor, stats, evidence, payment
from core.config import settings

# 1. SETUP LOGGING
logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger("SentinelBackend")

# 2. INITIALIZE APP
app = FastAPI()

# 3. SETUP CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. INCLUDE ROUTERS
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(payment.router, prefix="/api/payment", tags=["payment"])
app.include_router(monitor.router, prefix="/ws", tags=["monitor"]) # Note: monitor router handles /monitor path in decorator? No, decorator has /monitor, prefix /ws -> /ws/monitor. Correct.
app.include_router(stats.router, prefix="/stats", tags=["stats"])
app.include_router(evidence.router, prefix="/evidence", tags=["evidence"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Sentinel AI"}

logger.info("Sentinel AI Backend Initialized")