import hashlib
import hmac
import time
from typing import Any, Dict

from fastapi import HTTPException, Header, Request, APIRouter
from pydantic import BaseModel, Field

from src.config import config
from src.interfaces.thirdweb import (
    ThirdwebBuyWithFiatWebhook,
    ThirdwebBuyWithCryptoWebhook,
)
from src.utils.logger import setup_logger

logger = setup_logger(__name__)

router = APIRouter(prefix="/thirdweb", tags=["Thirdweb"])

# Maximum age of webhook in seconds before rejecting it (5 minutes)
MAX_WEBHOOK_AGE = 300


class ThirdwebWebhookPayload(BaseModel):
    data: Dict[str, Any] = Field(...)

    @property
    def buy_with_crypto_status(
        self,
    ) -> ThirdwebBuyWithCryptoWebhook | None:
        if "buyWithCryptoStatus" in self.data:
            return ThirdwebBuyWithCryptoWebhook(**self.data["buyWithCryptoStatus"])
        return None

    @property
    def buy_with_fiat_status(
        self,
    ) -> ThirdwebBuyWithFiatWebhook | None:
        if "buyWithFiatStatus" in self.data:
            return ThirdwebBuyWithFiatWebhook(**self.data["buyWithFiatStatus"])
        return None


@router.post("/webhook", description="Receive webhooks from Thirdweb")
async def thirdweb_webhook(
    request: Request,
    payload: ThirdwebWebhookPayload,
    signature: str = Header(None, alias="X-Pay-Signature"),
    timestamp: str = Header(None, alias="X-Pay-Timestamp"),
) -> None:
    """
    Process webhooks from Thirdweb.
    Currently only supports buyWithCryptoStatus events.

    Verifies the webhook signature using the THIRDWEB_WEBHOOK_SECRET and validates
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

    # Get raw request body for signature verification
    body = await request.body()
    body_str = body.decode("utf-8")

    # Combine timestamp and body to create the payload for signature verification
    signature_payload = f"{timestamp}.{body_str}"

    # Calculate expected signature
    expected_signature = hmac.new(
        config.THIRDWEB_WEBHOOK_SECRET.encode(),
        signature_payload.encode(),
        hashlib.sha256,
    ).hexdigest()

    # Secure comparison to prevent timing attacks
    if not hmac.compare_digest(expected_signature, signature):
        logger.warning("Invalid webhook signature")
        raise HTTPException(status_code=401, detail="Invalid signature")

    logger.debug(f"Received Thirdweb webhook: {payload.model_dump_json()}")

    crypto_data = payload.buy_with_crypto_status
    if crypto_data is None or crypto_data.destination is None:
        fiat_data = payload.buy_with_fiat_status
        if fiat_data is None:
            raise HTTPException(status_code=400, detail="Unsupported webhook type")
        if fiat_data.status != "ON_RAMP_TRANSFER_COMPLETED":
            logger.debug(f"Ignoring non-completed transaction: {fiat_data.status}")
            return
        transaction_hash = fiat_data.source.transactionHash
        amount_usd = fiat_data.source.amountUSDCents / 100
        sender_address = fiat_data.purchaseData.userAddress

    elif crypto_data.status != "COMPLETED":
        logger.debug(f"Ignoring non-completed transaction: {crypto_data.status}")
        return
    else:
        transaction_hash = crypto_data.destination.transactionHash
        amount_usd = crypto_data.destination.amountUSDCents / 100
