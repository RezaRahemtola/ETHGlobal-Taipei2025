import hashlib
import hmac
import time
from typing import Any

from fastapi import HTTPException, Header, Request, APIRouter

from src.config import config
from src.interfaces.curvegrid import (
    CurvegridPaymentWebhook,
    WebhookCreateRequest,
    WebhookCreateResponse,
    WebhookDeleteRequest,
)
from src.services.multibaas import multibaas_service
from src.services.transaction import transaction_service
from src.services.user import user_service
from src.utils.logger import setup_logger

logger = setup_logger(__name__)

router = APIRouter(prefix="/curvegrid", tags=["Curvegrid"])


# Maximum age of webhook in seconds before rejecting it (5 minutes)
MAX_WEBHOOK_AGE = 300

USDC_DECIMALS = 6


@router.post(
    "/internal-webhook", description="Receive internal webhooks from Curvegrid"
)
async def curvegrid_webhook(
    request: Request,
    payload: list[dict[str, Any]],
    signature: str = Header(None, alias="X-MultiBaas-Signature"),
    timestamp: str = Header(None, alias="X-MultiBaas-Timestamp"),
) -> dict[str, str]:
    """
    Process webhooks from Curvegrid.

    Verifies the webhook signature using the CURVEGRID_WEBHOOK_SECRET and validates
    the timestamp to prevent replay attacks.
    """
    # Verify the webhook signature
    if not signature:
        logger.warning("Missing signature header in webhook request")
        raise HTTPException(status_code=401, detail="Missing signature")

    # Check timestamp to prevent replay attacks
    if not timestamp:
        logger.warning("Missing timestamp header in webhook request")
        raise HTTPException(status_code=401, detail="Missing timestamp")

    try:
        webhook_timestamp = int(timestamp)
        current_time = int(time.time())

        # Check if webhook is too old
        if current_time - webhook_timestamp > MAX_WEBHOOK_AGE:
            logger.warning(
                f"Webhook timestamp too old: {webhook_timestamp}, current time: {current_time}"
            )
            raise HTTPException(status_code=401, detail="Webhook expired")

        # Check if webhook is from the future (with a small tolerance)
        if webhook_timestamp > current_time + 30:
            logger.warning(
                f"Webhook timestamp from the future: {webhook_timestamp}, current time: {current_time}"
            )
            raise HTTPException(status_code=401, detail="Invalid timestamp")
    except ValueError:
        logger.warning(f"Invalid timestamp format: {timestamp}")
        raise HTTPException(status_code=401, detail="Invalid timestamp format")

    # Log the headers for debugging
    logger.debug(f"Webhook headers: {dict(request.headers)}")
    # Get raw request body for signature verification
    body = await request.body()

    # Calculate expected signature according to Curvegrid's Go implementation
    # Based on their code, they first hash the body, then the timestamp
    mac = hmac.new(
        config.CURVEGRID_WEBHOOK_SECRET.encode(),
        body,  # Use the raw bytes directly
        hashlib.sha256,
    )
    mac.update(timestamp.encode())
    expected_signature = mac.hexdigest()

    # Log for debugging
    logger.debug(f"Calculated signature: {expected_signature}")
    logger.debug(f"Received signature: {signature}")

    # Secure comparison to prevent timing attacks
    if not hmac.compare_digest(expected_signature, signature):
        logger.warning("Invalid webhook signature")
        raise HTTPException(status_code=401, detail="Invalid signature")

    # Process PaymentCompleted events in the list
    processed_payments = 0
    successful_transactions = 0

    for event_item in payload:
        try:
            payment_webhook = CurvegridPaymentWebhook(**event_item)
            logger.info(f"Processing Payment: {payment_webhook}")
            processed_payments += 1

            # Extract sender and receiver from the event inputs
            sender_address = None
            receiver_address = None
            amount = None

            for input_data in payment_webhook.data.event.inputs:
                if input_data.name == "sender":
                    sender_address = input_data.value
                elif input_data.name == "receiver":
                    receiver_address = input_data.value
                elif input_data.name == "amount":
                    try:
                        # Convert string amount to int first, then to float with correct decimals
                        raw_amount = int(input_data.value)
                        # Convert from USDC 6 decimals to a human-readable amount
                        amount = raw_amount / (10**USDC_DECIMALS)
                        logger.info(f"Converted amount {raw_amount} to {amount} USDC")
                    except ValueError:
                        logger.error(f"Invalid amount format: {input_data.value}")
                        continue

            # Skip if any required data is missing
            if sender_address is None or receiver_address is None or amount is None:
                logger.warning(
                    f"Missing required payment data: sender={sender_address}, receiver={receiver_address}, amount={amount}"
                )
                continue

            # Check if both addresses belong to users in our database
            sender_exists = await user_service.user_exists(sender_address)
            receiver_exists = await user_service.user_exists(receiver_address)

            if not sender_exists or not receiver_exists:
                logger.info(
                    f"Skipping transaction - one or both users not in database: sender={sender_address} ({sender_exists}), "
                    f"receiver={receiver_address} ({receiver_exists})"
                )
                continue

            # Create the p2p transaction
            transaction = await transaction_service.create_transaction(
                sender_address=sender_address,
                receiver_address=receiver_address,
                amount=amount,
                transaction_type="p2p",
                transaction_hash=payment_webhook.data.transaction.txHash,
            )

            if transaction:
                logger.info(
                    f"Successfully created p2p transaction: {transaction.transaction_hash}"
                )
                successful_transactions += 1
            else:
                logger.error("Failed to create p2p transaction")

        except ValueError as e:
            logger.info(f"Not a PaymentCompleted event or validation error: {str(e)}")
            # Continue processing other events in the list
        except Exception as e:
            logger.error(f"Error processing PaymentCompleted event: {str(e)}")
            # Continue with other events

    if processed_payments > 0:
        return {
            "status": "success",
            "message": f"Processed {processed_payments} payment transactions, created {successful_transactions} p2p transactions",
        }

    # If we didn't process any events, return a message indicating no supported events were found
    logger.info("No supported events found in webhook payload")
    return {"status": "ignored", "message": "No supported events found"}


@router.post("/webhook", description="Create a new webhook in Curvegrid")
async def create_webhook(request: WebhookCreateRequest) -> WebhookCreateResponse:
    """
    Create a new webhook in Curvegrid.

    Args:
        request: The webhook creation request data containing URL and label.

    Returns:
        WebhookCreateResponse: Contains webhook ID and secret for signature verification.
    """
    try:
        result = await multibaas_service.create_webhook(
            url=request.url, label=request.label
        )

        return WebhookCreateResponse(
            webhook_id=result["webhook_id"], secret=result["secret"]
        )
    except Exception as e:
        logger.error(f"Error creating webhook: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create webhook: {str(e)}"
        )


@router.delete("/webhook", description="Delete a webhook in Curvegrid")
async def delete_webhook(request: WebhookDeleteRequest) -> dict:
    """
    Delete a webhook in Curvegrid.

    Args:
        request: The webhook deletion request containing webhook ID and secret.

    Returns:
        dict: A status message.
    """
    try:
        # Get the webhook to verify the secret
        webhook = await multibaas_service.get_webhook(webhook_id=request.webhook_id)

        # Check if the webhook exists
        if not webhook:
            raise HTTPException(
                status_code=404,
                detail=f"Webhook with ID {request.webhook_id} not found",
            )

        # Verify that the secret matches
        if webhook.get("secret") != request.secret:
            logger.warning(
                f"Invalid secret provided for webhook ID: {request.webhook_id}"
            )
            raise HTTPException(status_code=403, detail="Invalid webhook secret")

        # Delete the webhook if secret matches
        success = await multibaas_service.delete_webhook(webhook_id=request.webhook_id)

        if success:
            return {
                "status": "success",
                "message": f"Webhook {request.webhook_id} deleted successfully",
            }
        else:
            raise HTTPException(
                status_code=500, detail=f"Failed to delete webhook {request.webhook_id}"
            )
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error deleting webhook: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to delete webhook: {str(e)}"
        )
