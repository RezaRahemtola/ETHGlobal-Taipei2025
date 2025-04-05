from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class Transaction(BaseModel):
    receiver_username: str
    sender_username: str
    amount: float
    type: Literal["topup", "p2p"]
    transaction_hash: str
    created_at: datetime
