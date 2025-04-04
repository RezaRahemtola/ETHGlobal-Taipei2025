from datetime import datetime

from sqlalchemy import String, TIMESTAMP
from sqlalchemy.orm import Mapped
from sqlalchemy.sql import func
from sqlalchemy.testing.schema import mapped_column

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
