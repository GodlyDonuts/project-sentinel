from workos import WorkOSClient
from core.config import settings
import logging

logger = logging.getLogger("SentinelBackend")

workos_client = WorkOSClient(
    api_key=settings.WORKOS_API_KEY,
    client_id=settings.WORKOS_CLIENT_ID
)

def update_user_metadata(user_id: str, metadata: dict):
    """
    Updates a user's metadata in WorkOS.
    Used for storing premium status.
    """
    try:
        logger.info(f"Updating metadata for user {user_id}: {metadata}")
        workos_client.user_management.update_user(
            user_id=user_id,
            metadata=metadata
        )
        return True
    except Exception as e:
        logger.error(f"Failed to update WorkOS metadata: {e}")
        return False

def get_user_profile(user_id: str):
    """
    Fetches a user's full profile from WorkOS.
    """
    try:
        user = workos_client.user_management.get_user(user_id=user_id)
        
        # safely convert to dict
        user_dict = {}
        if hasattr(user, "to_dict"):
            user_dict = user.to_dict()
        elif hasattr(user, "dict"):
            user_dict = user.dict()
        elif hasattr(user, "__dict__"):
            user_dict = user.__dict__
        else:
             # Fallback
             user_dict = {
                 "id": getattr(user, "id", user_id),
                 "email": getattr(user, "email", ""),
                 "firstName": getattr(user, "first_name", ""),
                 "lastName": getattr(user, "last_name", ""),
                 "profilePictureUrl": getattr(user, "profile_picture_url", None),
                 "metadata": getattr(user, "metadata", {})
             }
             
        return user_dict
    except Exception as e:
        logger.error(f"Failed to fetch WorkOS user {user_id}: {e}")
        return {}
