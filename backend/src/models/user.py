from datetime import datetime

from sqlalchemy import String, TIMESTAMP
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.orm import mapped_column
from sqlalchemy.sql import func

from src.models.base import Base


class User(Base):
    __tablename__ = "users"

    address: Mapped[str] = mapped_column(
        String, primary_key=True
    )  # Unique address for Ethereum or Solana address
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, default=func.current_timestamp()
    )

    username: Mapped[str] = mapped_column(String, nullable=False, unique=True)

    # Relationships with transactions
    sent_transactions = relationship(
        "Transaction",
        foreign_keys="Transaction.sender_username",
        back_populates="sender",
    )
    received_transactions = relationship(
        "Transaction",
        foreign_keys="Transaction.receiver_username",
        back_populates="receiver",
    )
