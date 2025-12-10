import asyncio
import os
import sys
from dotenv import load_dotenv

# Add parent directory to path to import services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

from services.auth import update_user_metadata

def grant_premium(user_id: str):
    print(f"🌟 Attempting to upgrade User ID: {user_id}")
    
    if not os.getenv("WORKOS_API_KEY"):
         print("❌ Error: WORKOS_API_KEY not found in environment.")
         return

    success = update_user_metadata(user_id, {"premium": "true"})
    
    if success:
        print(f"✅ SUCCESS! User {user_id} is now PREMIUM.")
    else:
        print(f"❌ FAILED to update user {user_id}.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python manual_upgrade.py <user_id>")
        print("Example: python manual_upgrade.py user_01H...")
        sys.exit(1)
        
    user_id = sys.argv[1]
    grant_premium(user_id)
