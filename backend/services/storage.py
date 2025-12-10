import os
import json
import logging
import base64
from datetime import datetime
import uuid

logger = logging.getLogger("SentinelStorage")

from raindrop import Raindrop

# Ensure RAINDROP_API_KEY is in your .env
client = Raindrop(api_key=os.getenv("RAINDROP_API_KEY"))

BUCKET_NAME = "sentinel-evidence-sb"

def save_evidence(transcript: list, analysis_log: list) -> dict:
    """
    Saves the call transcript and analysis log as a JSON 'Police Report'.
    """
    report_id = str(uuid.uuid4())
    timestamp = datetime.now().isoformat()
    
    report = {
        "id": report_id,
        "timestamp": timestamp,
        "transcript": transcript,
        "analysis_log": analysis_log,
        "status": "THREAT" if any(entry.get('is_threat') for entry in analysis_log) else "SAFE"
    }
    
    file_name = f"report_{timestamp}_{report_id[:8]}.json"
    
    try:
        content_str = json.dumps(report)
        content_b64 = base64.b64encode(content_str.encode('utf-8')).decode('utf-8')
        
        client.bucket.put(
            bucket_location={"bucket": {"name": BUCKET_NAME, "application_name": "project-sentinel"}}, 
            key=file_name, 
            content=content_b64,
            content_type="application/json"
        )
        return report
    except Exception as e:
        logger.error(f"Failed to save evidence: {e}")
        return None

def list_evidence():
    """
    Lists all available evidence reports, formatted for the frontend.
    """
    try:
        # Attempt to list objects
        if hasattr(client.bucket, 'list'):
             response = client.bucket.list(bucket_location={"bucket": {"name": BUCKET_NAME, "application_name": "project-sentinel"}})
             
             formatted_reports = []
             if hasattr(response, 'objects'):
                 for obj in response.objects:
                     # obj is likely a Pydantic model or similar, access via attribute or dict
                     key = getattr(obj, 'key', None)
                     if not key: continue
                     
                     # Parse metadata from filename if possible: report_{timestamp}_{id}.json
                     # Default values
                     timestamp = getattr(obj, 'last_modified', datetime.now()).isoformat()
                     report_type = 'safe' # Default, as we can't read content here efficiently
                     title = f"Evidence Log"
                     
                     parts = key.split('_')
                     if len(parts) >= 3:
                         # Try to extract timestamp from filename for better accuracy
                         try:
                             timestamp = parts[1]
                         except:
                             pass
                         
                         # Extract ID for title
                         report_id = parts[2].split('.')[0]
                         title = f"Evidence Log #{report_id}"

                     formatted_reports.append({
                         "filename": key,
                         "timestamp": timestamp,
                         "type": report_type,
                         "title": title
                     })
             
             return formatted_reports
        return [] 
    except Exception as e:
        logger.error(f"Failed to list evidence: {e}")
        return []

def get_evidence(filename: str):
    """
    Retrieves a specific evidence report.
    """
    try:
        response = client.bucket.get(bucket_location={"bucket": {"name": BUCKET_NAME, "application_name": "project-sentinel"}}, key=filename)
        
        # Handle different response types from the SDK
        content = None
        if hasattr(response, 'content'): 
            content = response.content
        elif hasattr(response, 'body'):
            content = response.body
        elif isinstance(response, (bytes, str)):
            content = response
            
        if content:
            # Try to decode base64
            try:
                if isinstance(content, bytes):
                    content = content.decode('utf-8')
                decoded_json = base64.b64decode(content).decode('utf-8')
                return json.loads(decoded_json)
            except Exception:
                # Fallback: maybe it wasn't base64 encoded or is already JSON
                return json.loads(content)
                
        return None
    except Exception as e:
        logger.error(f"Failed to get evidence: {e}")
        return None