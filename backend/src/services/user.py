from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_

from src.models.base import SessionLocal
from src.models.user import User
from src.utils.logger import setup_logger

logger = setup_logger(__name__)


class UserService:
    def __init__(self):
        pass

    def get_db(self):
        db = SessionLocal()
        try:
            return db
        finally:
            db.close()

    async def create_user(self, address: str, username: str) -> bool:
        """
        Create a new user with the given wallet address and username.

        Args:
            address: The wallet address of the user.
            username: The username for the user.

        Returns:
            bool: True if the user was created successfully, False otherwise.
        """
        logger.debug(f"Creating user with address {address} and username {username}")
        db = self.get_db()
        try:
            user = User(address=address, username=username)
            db.add(user)
            db.commit()
            return True
        except IntegrityError as e:
            logger.error(f"Error creating user: {e}")
            db.rollback()
            return False
        finally:
            db.close()

    async def get_user_by_address(self, address: str) -> User | None:
        """
        Get a user by their wallet address.

        Args:
            address: The wallet address to look up.

        Returns:
            User | None: The user if found, None otherwise.
        """
        logger.debug(f"Getting user with address {address}")
        db = self.get_db()
        try:
            return db.query(User).filter(User.address == address).first()
        finally:
            db.close()

    async def search_users(
        self, query: str, limit: int = 10, exclude_address: str | None = None
    ) -> list[User]:
        """
        Search for users whose username matches the query.

        Args:
            query: The search query to match against usernames.
            limit: Maximum number of results to return.
            exclude_address: Optional address to exclude from results (typically the current user).

        Returns:
            list[User]: List of matching users.
        """
        logger.debug(f"Searching users with query: {query}")
        db = self.get_db()
        try:
            # Search for usernames that contain the query or addresses that start with the query
            search_pattern = f"%{query}%"
            query_obj = db.query(User).filter(
                or_(
                    User.username.ilike(search_pattern), User.address.ilike(f"{query}%")
                )
            )

            # Exclude the specified address if provided
            if exclude_address:
                query_obj = query_obj.filter(User.address != exclude_address)

            users = query_obj.limit(limit).all()
            return users
        finally:
            db.close()

    async def user_exists(self, address: str) -> bool:
        """
        Check if a user with the given address exists.

        Args:
            address: The wallet address to check.

        Returns:
            bool: True if the user exists, False otherwise.
        """
        logger.debug(f"Checking if user with address {address} exists")
        user = await self.get_user_by_address(address)
        return user is not None


user_service = UserService()
