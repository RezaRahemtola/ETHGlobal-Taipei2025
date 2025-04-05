from typing import Literal

from sqlalchemy.exc import IntegrityError

from src.interfaces.transaction import Transaction as TransactionType
from src.models.base import SessionLocal
from src.models.transaction import Transaction
from src.services.user import user_service
from src.utils.logger import setup_logger

logger = setup_logger(__name__)


class TransactionService:
    @staticmethod
    async def create_transaction(
        sender_address: str,
        receiver_address: str,
        amount: float,
        transaction_type: Literal["topup", "p2p"],
        transaction_hash: str,
    ) -> Transaction | None:
        """
        Create a new transaction between users identified by their wallet addresses.

        Args:
            sender_address: The wallet address of the sender.
            receiver_address: The wallet address of the receiver.
            amount: The amount being transferred.
            transaction_type: The type of transaction ("topup" or "p2p").
            transaction_hash: The blockchain transaction hash.

        Returns:
            Optional[Transaction]: The created transaction if successful, None otherwise.
        """
        logger.debug(
            f"Creating {transaction_type} transaction: {sender_address} -> {receiver_address}, amount: {amount}"
        )

        # Get users by their addresses to find usernames
        sender = await user_service.get_user_by_address(sender_address)
        receiver = await user_service.get_user_by_address(receiver_address)

        if not sender or not receiver:
            logger.error(
                f"One or both users not found: sender={sender_address}, receiver={receiver_address}"
            )
            return None

        db = SessionLocal()
        try:
            transaction = Transaction(
                sender_username=sender.username,
                receiver_username=receiver.username,
                amount=amount,
                type=transaction_type,
                transaction_hash=transaction_hash,
            )

            db.add(transaction)
            db.commit()
            db.refresh(transaction)
            return transaction

        except IntegrityError as e:
            logger.error(f"Error creating transaction: {e}")
            db.rollback()
            return None
        finally:
            db.close()

    @staticmethod
    async def get_user_transactions(address: str) -> list[TransactionType]:
        """
        Get all transactions for a user (both sent and received).

        Args:
            address: The wallet address of the user.

        Returns:
            List of transactions related to the user.
        """
        logger.debug(f"Getting transactions for user with address {address}")

        user = await user_service.get_user_by_address(address)
        if not user:
            logger.error(f"User not found: {address}")
            return []

        db = SessionLocal()
        try:
            transactions: list[Transaction] = (
                db.query(Transaction)
                .filter(
                    (Transaction.sender_username == user.username)
                    | (Transaction.receiver_username == user.username)
                )
                .all()
            )
            return [
                TransactionType(
                    receiver_username=tx.receiver_username,
                    sender_username=tx.sender_username,
                    amount=tx.amount,
                    type=tx.type,
                    transaction_hash=tx.transaction_hash,
                    created_at=tx.created_at,
                )
                for tx in transactions
            ]
        finally:
            db.close()


transaction_service = TransactionService()
