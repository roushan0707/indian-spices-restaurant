from fastapi import APIRouter, HTTPException, Request
from models import PaymentOrder, PaymentVerification
import razorpay
import os
import hmac
import hashlib

router = APIRouter()

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(os.getenv("RAZORPAY_KEY_ID", ""), os.getenv("RAZORPAY_KEY_SECRET", ""))
)

def get_db():
    from server import db
    return db

@router.post("/payment/create-order")
async def create_payment_order(payment_data: PaymentOrder):
    """Create a Razorpay order for payment"""
    try:
        key_id = os.getenv("RAZORPAY_KEY_ID", "")
        key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")

        if not key_id or not key_secret:
            raise HTTPException(
                status_code=500,
                detail="Razorpay keys not configured in .env file"
            )

        # Re-initialize client with current env values (in case of hot reload)
        client = razorpay.Client(auth=(key_id, key_secret))

        # Create Razorpay order
        razorpay_order = client.order.create({
            "amount": payment_data.amount,  # Amount in paise
            "currency": payment_data.currency,
            "payment_capture": 1  # Auto capture
        })

        # Store order in database
        db = get_db()
        await db.payment_orders.insert_one({
            "razorpay_order_id": razorpay_order["id"],
            "order_id": payment_data.order_id,
            "amount": payment_data.amount,
            "currency": payment_data.currency,
            "status": "created"
        })

        return {
            "order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "key_id": key_id
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating payment order: {str(e)}"
        )


@router.post("/payment/verify")
async def verify_payment(verification_data: PaymentVerification):
    """Verify Razorpay payment signature"""
    try:
        key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")

        # ✅ Fixed: was hmac.new() which doesn't exist — correct is hmac.new via HMAC constructor
        body = f"{verification_data.razorpay_order_id}|{verification_data.razorpay_payment_id}"
        generated_signature = hmac.new(
            key_secret.encode("utf-8"),
            body.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        if generated_signature != verification_data.razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid payment signature")

        db = get_db()

        # Update payment order status
        await db.payment_orders.update_one(
            {"razorpay_order_id": verification_data.razorpay_order_id},
            {"$set": {
                "status": "completed",
                "razorpay_payment_id": verification_data.razorpay_payment_id
            }}
        )

        # Get the linked order_id from payment_orders
        payment_order = await db.payment_orders.find_one(
            {"razorpay_order_id": verification_data.razorpay_order_id}
        )

        if payment_order and payment_order.get("order_id"):
            from bson import ObjectId
            await db.orders.update_one(
                {"_id": ObjectId(payment_order["order_id"])},
                {"$set": {
                    "payment_status": "completed",
                    "payment_id": verification_data.razorpay_payment_id
                }}
            )

        return {
            "message": "Payment verified successfully",
            "payment_id": verification_data.razorpay_payment_id
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error verifying payment: {str(e)}"
        )


@router.post("/payment/webhook")
async def payment_webhook(request: Request):
    """Handle Razorpay webhook for payment status updates"""
    try:
        payload = await request.body()
        signature = request.headers.get('X-Razorpay-Signature', '')

        webhook_secret = os.getenv('RAZORPAY_WEBHOOK_SECRET', '')
        if webhook_secret and webhook_secret != 'dummy_webhook_secret':
            razorpay_client.utility.verify_webhook_signature(
                payload.decode(),
                signature,
                webhook_secret
            )

        import json
        data = json.loads(payload.decode())
        db = get_db()

        event = data.get('event')
        payment_entity = data.get('payload', {}).get('payment', {}).get('entity', {})

        if payment_entity:
            await db.payment_orders.update_one(
                {"razorpay_payment_id": payment_entity.get('id')},
                {"$set": {"webhook_event": event, "webhook_data": payment_entity}}
            )

        return {"status": "processed"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Webhook error: {str(e)}")