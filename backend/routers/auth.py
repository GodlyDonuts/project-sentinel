from fastapi import APIRouter
from pydantic import BaseModel
import logging
from services.auth import workos_client
import os

router = APIRouter()
logger = logging.getLogger("SentinelBackend")

class AuthCode(BaseModel):
    code: str

@router.post("/verify")
async def verify_auth(auth: AuthCode):
    logger.info(f"Received auth code: {auth.code[:5]}... (truncated)")
    
    try:
        # Verify we have keys
        if not os.getenv("WORKOS_API_KEY") or not os.getenv("WORKOS_CLIENT_ID"):
            logger.warning("WorkOS keys missing. Allowing mock auth.")
            return {"user": {"email": "mock@example.com", "id": "mock_user"}}

        logger.info("Attempting to exchange code with WorkOS (User Management)...")
        
        # Authenticate with AuthKit
        auth_response = workos_client.user_management.authenticate_with_code(
            code=auth.code
        )
        
        # The user object is nested in the response
        user = auth_response.user
        
        # Safely convert to dict for JSON serialization
        user_dict = {}
        if hasattr(user, "to_dict"):
            user_dict = user.to_dict()
        elif hasattr(user, "dict"):
            user_dict = user.dict()
        elif hasattr(user, "__dict__"):
            user_dict = user.__dict__
        else:
            # Fallback for unknown types
            user_dict = {"id": getattr(user, "id", "unknown"), "email": getattr(user, "email", "unknown")}

        logger.info(f"Auth success! User: {user_dict.get('email')}")
        return {"user": user_dict}
        
    except Exception as e:
        logger.error(f"Auth failed: {e}")
        return {"error": str(e)}

class RefreshRequest(BaseModel):
    userId: str

@router.post("/me")
async def refresh_user_profile(req: RefreshRequest):
    """
    Fetches the latest user profile and metadata from WorkOS.
    Used by frontend to sync premium status AND profile details.
    """
    from services.auth import get_user_profile
    
    profile = get_user_profile(req.userId)
    return {"user": profile}
