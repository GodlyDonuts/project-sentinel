import asyncio
import os
from dotenv import load_dotenv
import logging

# Setup logging to see what analyze_threat does
logging.basicConfig(level=logging.INFO)

# Load env vars
load_dotenv()

from services.intelligence import analyze_threat

async def test():
    text = "I am calling from the IRS. You must send $500 gift card immediately, or we will issue a warrant for your arrest."
    print(f"Testing text: {text}")
    
    result = await analyze_threat(text)
    print(f"Result: {result}")

    if result.get("is_threat"):
        print("SUCCESS: Threat detected.")
    else:
        print("FAILURE: Threat NOT detected.")

if __name__ == "__main__":
    asyncio.run(test())
