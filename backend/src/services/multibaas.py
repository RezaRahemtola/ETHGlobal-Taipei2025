import aiohttp

from src.config import config
from src.utils.logger import setup_logger

logger = setup_logger(__name__)


class MultibaasService:
    def __init__(self):
        self.base_url = config.CURVEGRID_DEPLOYMENT_URL
        self.headers = {
            "Authorization": f"Bearer {config.CURVEGRID_API_KEY}",
            "Content-Type": "application/json",
        }

    async def is_ens_subname_available(self, username: str) -> bool:
        """
        Check if the given username is available for registration as an ENS subname.

        Args:
            username: The username to check.

        Returns:
            bool: True if the username is available, False otherwise.
        """
        logger.debug(f"Checking if {username} is an available ENS subname")
        api_url = f"{self.base_url}/api/v0/chains/ethereum/addresses/{config.CURVEGRID_ENS_REGISTAR_CONTRACT_ADDRESS_ALIAS}/contracts/{config.CURVEGRID_ENS_REGISTAR_CONTRACT_LABEL}/methods/available"

        args = {
            "args": [username],
            "signature": "available(string)",
            "contractOverride": False,
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    api_url, headers=self.headers, json=args
                ) as response:
                    response.raise_for_status()
                    result = await response.json()
                    print(result)
                    return result.get("result", {}).get("output", False)
        except Exception as e:
            logger.error(f"Error checking ENS subname availability: {e}")
            return False

    async def register_ens_subname(self, username: str, address: str) -> bool:
        """
        Register a subname for the given username to the specified address.

        Args:
            username: The username to register as a subname.
            address: The address to associate with the subname.

        Returns:
            bool: True if the registration was successful, False otherwise.
        """
        logger.debug(f"Registering ENS subname for username: {username}")
        api_url = f"{self.base_url}/api/v0/chains/ethereum/addresses/{config.CURVEGRID_ENS_REGISTAR_CONTRACT_ADDRESS_ALIAS}/contracts/{config.CURVEGRID_ENS_REGISTAR_CONTRACT_LABEL}/methods/register"

        args = {
            "args": [username, address],
            "signature": "register(string,address)",
            "from": config.CURVEGRID_HSM_ADDRESS,
            "signAndSubmit": True,
            "contractOverride": False,
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    api_url, headers=self.headers, json=args
                ) as response:
                    response.raise_for_status()
                    result = await response.json()
                    return result.get("status", 0) == 200
        except Exception as e:
            logger.error(f"Error registering ENS subname: {e}")
            return False

    async def is_user_registered(self, user_address: str) -> bool:
        """
        Check if a user is registered by verifying if their address is associated with an ENS subname.

        Args:
            user_address: The address to check.

        Returns:
            bool: True if the user is registered, False otherwise.
        """
        logger.debug(f"Checking if user {user_address} is registered")
        api_url = f"{self.base_url}/api/v0/chains/ethereum/addresses/{config.CURVEGRID_ENS_REGISTRY_CONTRACT_ADDRESS_ALIAS}/contracts/{config.CURVEGRID_ENS_REGISTRY_CONTRACT_LABEL}/methods/namehash"

        args = {
            "args": [user_address],
            "signature": "namehash(string)",
            "contractOverride": False,
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    api_url, headers=self.headers, json=args
                ) as response:
                    response.raise_for_status()
                    result = await response.json()
                    return result.get("result", {}).get("output", False)
        except Exception as e:
            logger.error(f"Error checking user registration: {e}")
            return False


multibaas_service = MultibaasService()
