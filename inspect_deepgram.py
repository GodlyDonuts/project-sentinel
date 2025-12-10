import os
import asyncio
from deepgram import AsyncDeepgramClient
from dotenv import load_dotenv

load_dotenv()

async def main():
    try:
        dg = AsyncDeepgramClient(api_key="cb6194b4dea93c46fb57141a80fac154606d083e")
        # Connect to Deepgram
        print("Connecting...")
        async with dg.listen.v1.connect(model="nova-2") as conn:
            print(f"Connection Object Type: {type(conn)}")
            print(f"Directory: {dir(conn)}")
            
            # Check for send-like methods
            methods = [m for m in dir(conn) if "send" in m]
            print(f"Send methods: {methods}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
