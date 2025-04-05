from datetime import datetime

from sqlalchemy import ForeignKey, String, Float, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from src.models.base import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    receiver_username: Mapped[str] = mapped_column(ForeignKey("users.username"), nullable=False)
    sender_username: Mapped[str] = mapped_column(ForeignKey("users.username"), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=False)  # "topup" or "p2p"
    transaction_hash: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=func.current_timestamp())

    # Relationships
    receiver = relationship("User", foreign_keys=[receiver_username], back_populates="received_transactions")
    sender = relationship("User", foreign_keys=[sender_username], back_populates="sent_transactions")