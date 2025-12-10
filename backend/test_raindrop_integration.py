import os
import sys
import logging
from dotenv import load_dotenv

# Add the current directory to sys.path so we can import services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../.env'))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("TestRaindrop")

def test_storage():
    logger.info("Testing Storage Service...")
    try:
        from services.storage import save_evidence, list_evidence, get_evidence
        
        # Test Save
        transcript = [{"role": "user", "content": "Hello"}, {"role": "assistant", "content": "Hi"}]
        analysis_log = [{"is_threat": False, "confidence": 0.1}]
        saved_report = save_evidence(transcript, analysis_log)
        
        if saved_report:
            logger.info(f"✅ Save Evidence successful. ID: {saved_report['id']}")
            
            # Test Get
            filename = f"report_{saved_report['timestamp']}_{saved_report['id'][:8]}.json"
            # Note: The filename construction in storage.py might need to be exactly matched or returned
            # storage.py constructs it internally. 
            # Actually save_evidence returns the report dict, not the filename.
            # But the filename is deterministic based on timestamp and id in the report.
            # Let's reconstruct it.
            
            fetched_report = get_evidence(filename)
            if fetched_report:
                logger.info("✅ Get Evidence successful.")
            else:
                logger.error("❌ Get Evidence failed.")
        else:
            logger.error("❌ Save Evidence failed.")
            
        # Test List
        files = list_evidence()
        if isinstance(files, list):
            logger.info(f"ℹ️ List Evidence returned {len(files)} files.")
            if len(files) > 0:
                logger.info(f"   First file: {files[0]}")
        else:
            logger.error(f"❌ List Evidence returned unexpected type: {type(files)}")
        
    except ImportError as e:
        logger.error(f"❌ ImportError in storage service: {e}")
    except Exception as e:
        logger.error(f"❌ Error in storage test: {e}")

def test_memory():
    logger.info("Testing Memory Service...")
    try:
        from services.memory import add_scam_pattern, check_known_scams
        
        # Test Add
        if add_scam_pattern("This is a test scam pattern", "test"):
            logger.info("✅ Add Scam Pattern successful.")
        else:
            logger.error("❌ Add Scam Pattern failed.")
            
        # Test Check
        results = check_known_scams("test scam pattern")
        logger.info(f"ℹ️ Check Known Scams returned: {results}")
        
    except ImportError as e:
        logger.error(f"❌ ImportError in memory service: {e}")
    except Exception as e:
        logger.error(f"❌ Error in memory test: {e}")

if __name__ == "__main__":
    if not os.getenv("RAINDROP_API_KEY"):
        logger.warning("⚠️ RAINDROP_API_KEY not found in environment variables.")
    
    test_storage()
    test_memory()
