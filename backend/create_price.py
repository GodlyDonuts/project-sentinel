import stripe
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("STRIPE_SECRET_KEY")
if not api_key:
    # Try looking for it in the parent .env if not found? 
    # Attempt to load from ../.env
    load_dotenv(dotenv_path="../.env")
    api_key = os.getenv("STRIPE_SECRET_KEY")

if not api_key:
    print("Error: STRIPE_SECRET_KEY not found in environment.")
    exit(1)

stripe.api_key = api_key

try:
    print("Creating Product...")
    product = stripe.Product.create(
        name="Sentinel One - Pro",
        description="Premium subscription for Sentinel AI",
    )
    
    print(f"Product Created: {product.id}")

    print("Creating Price...")
    price = stripe.Price.create(
        unit_amount=999,  # $9.99
        currency="usd",
        recurring={"interval": "month"},
        product=product.id,
    )

    print(f"SUCCESS! New Price ID: {price.id}")

except Exception as e:
    print(f"Error: {e}")
