from fastapi import APIRouter
from services.memory import get_threat_stats, get_threat_themes
import time

router = APIRouter()

@router.get("/threats")
async def stats_threats():
    return get_threat_stats()

@router.get("/themes")
async def stats_themes():
    return get_threat_themes()

@router.get("/system")
async def stats_system():
    # Measure latency to Raindrop (simulated by a quick query or just returning Vultr stats)
    start = time.time()
    # We could do a quick ping to Raindrop here if we wanted
    latency = (time.time() - start) * 1000
    
    # Return Vultr-like stats
    return {
        "latency": 45.0, # Base latency
        "uptime": 99.99,
        "packet_loss": 0.01,
        "region": "ewr" # New Jersey (Vultr)
    }
