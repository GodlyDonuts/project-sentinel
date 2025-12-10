import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("Cerebras_API_KEY") or os.getenv("CEREBRAS_API_KEY"),
    base_url="https://api.cerebras.ai/v1"
)

try:
    models = client.models.list()
    print("Available Models:")
    for model in models.data:
        print(f"- {model.id}")
except Exception as e:
    print(f"Error listing models: {e}")
