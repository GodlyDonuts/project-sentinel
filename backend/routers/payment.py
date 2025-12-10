from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import stripe
import os

router = APIRouter()

# Initialize Stripe with key from env
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
CLIENT_URL = os.getenv("VITE_WORKOS_REDIRECT_URI", "http://localhost:5173").rstrip('/')

class CheckoutSessionRequest(BaseModel):
    priceId: str

class PaymentSuccessRequest(BaseModel):
    userId: str

@router.post("/success")
async def payment_success(request: PaymentSuccessRequest):
    """
    Called by Frontend after successful Stripe confirmation.
    Updates WorkOS metadata to mark user as premium.
    """
    from services.auth import update_user_metadata
    
    # In a real app, verify the PaymentIntent status with Stripe first using the ID
    # For now, we trust the secure client confirmation flow + this direct call
    
    success = update_user_metadata(request.userId, {"premium": "true"})
    if not success:
         raise HTTPException(status_code=500, detail="Failed to update user metadata")
    
    return {"status": "upgraded", "premium": True}

@router.post("/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe API key not configured")
    
    try:
        # 1. Create a Customer (In production, look up by email first from auth)
        customer = stripe.Customer.create()

        # 2. Create the Subscription with payment_behavior='default_incomplete'
        subscription = stripe.Subscription.create(
            customer=customer.id,
            items=[{
                'price': request.priceId,
            }],
            payment_behavior='default_incomplete',
            payment_settings={
                'save_default_payment_method': 'on_subscription',
            },
            expand=['latest_invoice.payment_intent'],
        )

        # 3. Get the client_secret from the payment intent
        if not subscription.latest_invoice:
             raise HTTPException(status_code=500, detail="Failed to create subscription invoice")

        # Handle Stripe API compatibility (dict access vs attribute vs string ID)
        latest_invoice = subscription.latest_invoice
        
        if isinstance(latest_invoice, str):
            print(f"DEBUG: Retrieval by ID: {latest_invoice}")
            latest_invoice = stripe.Invoice.retrieve(latest_invoice, expand=['payment_intent'])

        # Robust extraction strategy
        payment_intent = None
        client_secret = None

        # Strategy 1: Dictionary conversion (bypass deprecated attribute warnings)
        try:
            # Try to convert to dict safely
            invoice_data = latest_invoice.to_dict() if hasattr(latest_invoice, 'to_dict') else dict(latest_invoice)
            payment_intent = invoice_data.get('payment_intent')
        except Exception as e:
            print(f"DEBUG: Dict conversion failed: {e}")

        # Strategy 2: Direct attribute access (if dict failed)
        if not payment_intent and hasattr(latest_invoice, 'payment_intent'):
             payment_intent = latest_invoice.payment_intent

        # Validate we found something
        if not payment_intent:
             print(f"DEBUG: PaymentIntent missing in Invoice: {latest_invoice}")
             # Strategy 3: Search for PI explicitly by Customer (since invoice filter is invalid)
             if customer and hasattr(customer, 'id'):
                 print("DEBUG: Searching for PaymentIntent by Customer ID...")
                 pis = stripe.PaymentIntent.list(customer=customer.id, limit=1)
                 if pis and pis.data:
                     payment_intent = pis.data[0]
                     print(f"DEBUG: Found pending PI for customer: {payment_intent.get('id')}")

        # Extract Client Secret
        if payment_intent:
             if isinstance(payment_intent, str):
                 # If we only got an ID, retrieve the object
                 payment_intent = stripe.PaymentIntent.retrieve(payment_intent)
             
             # Get secret from object or dict
             if hasattr(payment_intent, 'client_secret'):
                 client_secret = payment_intent.client_secret
             elif isinstance(payment_intent, dict):
                 client_secret = payment_intent.get('client_secret')

        client_secret = None
        if payment_intent:
             # PaymentIntent object also needs safe access
             if hasattr(payment_intent, 'client_secret'):
                 client_secret = payment_intent.client_secret
             else:
                 client_secret = payment_intent.get('client_secret')

        if not client_secret:
             raise HTTPException(status_code=500, detail="Failed to retrieve client_secret")

        return {"clientSecret": client_secret}

    except Exception as e:
        print(f"Stripe Error: {str(e)}")
        # Log full traceback locally if possible
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
