from typing import Literal

from pydantic import BaseModel


class ThirdwebTransactionDetails(BaseModel):
    transactionHash: str
    amountWei: str
    amount: str
    amountUSDCents: int
    completedAt: str


class ThirdwebPurchaseData(BaseModel):
    userAddress: str
    type: Literal["topup"]


class ThirdwebBuyWithCryptoWebhook(BaseModel):
    swapType: str
    source: ThirdwebTransactionDetails
    status: Literal["COMPLETED", "PENDING"]
    toAddress: str
    destination: ThirdwebTransactionDetails | None = None
    purchaseData: ThirdwebPurchaseData


class ThirdwebBuyWithFiatWebhook(BaseModel):
    source: ThirdwebTransactionDetails
    status: Literal["ON_RAMP_TRANSFER_COMPLETED"]
    toAddress: str
    purchaseData: ThirdwebPurchaseData
