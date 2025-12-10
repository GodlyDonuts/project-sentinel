import os
import logging
import json
import base64
from raindrop import Raindrop

logger = logging.getLogger("SentinelMemory")
client = Raindrop(api_key=os.getenv("RAINDROP_API_KEY"))

import uuid

def add_scam_pattern(text: str, category: str):
    """Adds a known scam pattern to SmartMemory."""
    try:
        # Upload to SmartBucket for indexing
        filename = f"scam_{category}_{uuid.uuid4().hex[:8]}.txt"
        content_str = json.dumps({"text": text, "category": category})
        content_b64 = base64.b64encode(content_str.encode('utf-8')).decode('utf-8')
        
        client.bucket.put(
            bucket_location={"bucket": {"name": "agent-memory-sb", "application_name": "project-sentinel"}},
            key=filename,
            content=content_b64,
            content_type="application/json"
        )
        return True
    except Exception as e:
        logging.error(f"Error adding to memory: {e}")
        return False

def check_known_scams(text: str):
    """Queries SmartMemory for similar known scams."""
    try:
        # Use client.query.search
        results = client.query.search(
            bucket_locations=[{"bucket": {"name": "agent-memory-sb", "application_name": "project-sentinel"}}],
            input=text,
            request_id=str(uuid.uuid4())
        )
        
        # Convert SDK response to serializable format
        hits = []
        if hasattr(results, 'results'):
            for hit in results.results:
                hits.append({
                    "score": getattr(hit, "score", 0),
                    "text": getattr(hit, "text", ""),
                    "metadata": getattr(hit, "metadata", {})
                })
        return hits
    except Exception as e:
        logging.error(f"Error querying memory: {e}")
        return []

def get_threat_stats():
    """Returns statistics about detected threats."""
    # Placeholder implementation used to fix missing function error
    # In a real scenario, this would aggregate data from Raindrop
    return {
        "total_scams_detected": 142,
        "active_threats": 5,
        "scams_prevented": 137
    }

def get_threat_themes():
    """Returns common threat themes."""
    # Placeholder implementation
    return [
        {"theme": "IRS Impersonation", "count": 45},
        {"theme": "Tech Support", "count": 32},
        {"theme": "Grandparent Scam", "count": 15},
        {"theme": "Lottery Fraud", "count": 12}
    ]