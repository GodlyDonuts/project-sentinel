import os
import asyncio
from deepgram import AsyncDeepgramClient
from dotenv import load_dotenv
import inspect

load_dotenv()

async def main():
    try:
        dg = AsyncDeepgramClient(api_key="cb6194b4dea93c46fb57141a80fac154606d083e")
        async with dg.listen.v1.connect(model="nova-2") as conn:
            print(f"send_control sig: {inspect.signature(conn.send_control)}")
            print(f"send_media sig: {inspect.signature(conn.send_media)}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
