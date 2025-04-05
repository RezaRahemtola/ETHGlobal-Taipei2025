from pydantic import BaseModel


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
