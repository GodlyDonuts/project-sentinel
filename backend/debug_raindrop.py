import os
import sys
import json
import logging
from dotenv import load_dotenv
from raindrop import Raindrop

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../.env'))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("DebugRaindrop")

client = Raindrop(api_key=os.getenv("RAINDROP_API_KEY"))
BUCKET_NAME = "sentinel-evidence"
MEMORY_NAME = "agent-memory"

def test_bucket_location(loc, description):
    logger.info(f"Testing {description}: {loc}")
    try:
        # Try to list objects (read-only operation)
        if hasattr(client.bucket, 'list'):
            client.bucket.list(bucket_location=loc)
            logger.info(f"✅ Success with {description}")
            return True
        else:
            logger.error("❌ client.bucket.list not found")
            return False
    except Exception as e:
        logger.error(f"❌ Failed with {description}: {e}")
        return False

if __name__ == "__main__":
    logger.info("Starting Raindrop Debug...")
    
    locations = [
        {"bucket": {"name": BUCKET_NAME, "application_name": "project-sentinel"}},
        {"bucket": {"name": MEMORY_NAME, "application_name": "project-sentinel"}},
    ]
    
    for loc in locations:
        test_bucket_location(loc, str(loc))
