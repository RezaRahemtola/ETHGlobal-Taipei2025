from pydantic import BaseModel, Field


class EventInput(BaseModel):
    name: str
    value: str


class EventData(BaseModel):
    name: str
    inputs: list[EventInput]


class TransactionData(BaseModel):
    txHash: str


class Data(BaseModel):
    event: EventData
    transaction: TransactionData


class CurvegridPaymentWebhook(BaseModel):
    data: Data


class WebhookCreateRequest(BaseModel):
    url: str = Field(..., description="The URL to send webhook events to")
    label: str = Field(..., description="A human-readable label for the webhook")


class WebhookCreateResponse(BaseModel):
    webhook_id: int = Field(..., description="The ID of the created webhook")
    secret: str = Field(
        ..., description="The webhook secret for signature verification"
    )
