import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    WORKOS_API_KEY = os.getenv("WORKOS_API_KEY")
    WORKOS_CLIENT_ID = os.getenv("WORKOS_CLIENT_ID")
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

settings = Settings()
