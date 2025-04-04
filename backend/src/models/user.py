from sqlalchemy import Column, String, TIMESTAMP
from sqlalchemy.sql import func

from src.models.base import Base


class User(Base):
    __tablename__ = "users"

    address = Column(
        String, primary_key=True
    )  # Unique address for Ethereum or Solana address
    created_at = Column(TIMESTAMP, default=func.current_timestamp())

    username = Column(String, nullable=False, unique=True)
