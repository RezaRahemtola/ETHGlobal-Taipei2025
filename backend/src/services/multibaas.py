import aiohttp

from src.config import config
from src.utils.ens import namehash
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

    async def change_ens_avatar(self, ens: str, image_url: str) -> bool:
        """
        Change the avatar for the given ENS subname.

        Args:
            ens: The ENS subname to change the avatar for.
            image_url: The URL of the new avatar image.

        Returns:
            bool: True if the avatar change was successful, False otherwise.
        """
        logger.debug(f"Changing ENS avatar for {ens} to {image_url}")
        api_url = f"{self.base_url}/api/v0/chains/ethereum/addresses/{config.CURVEGRID_ENS_REGISTRY_CONTRACT_ADDRESS_ALIAS}/contracts/{config.CURVEGRID_ENS_REGISTRY_CONTRACT_LABEL}/methods/setText"

        args = {
            "args": [namehash(ens), "avatar", image_url],
            "signature": "setText(bytes32,string,string)",
            "from": config.CURVEGRID_HSM_ADDRESS,
            "signAndSubmit": True,
            "contractOverride": False,
        }

        print(args)

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    api_url, headers=self.headers, json=args
                ) as response:
                    response.raise_for_status()
                    result = await response.json()
                    return result.get("status", 0) == 200
        except Exception as e:
            logger.error(f"Error changing ENS avatar: {e}")
            return False

    async def get_ens_avatar(self, ens: str) -> str:
        """
        Get the avatar URL for the given ENS subname.

        Args:
            ens: The ENS subname to get the avatar for.

        Returns:
            str: The URL of the avatar image.
        """
        logger.debug(f"Getting ENS avatar for {ens}")
        api_url = f"{self.base_url}/api/v0/chains/ethereum/addresses/{config.CURVEGRID_ENS_REGISTRY_CONTRACT_ADDRESS_ALIAS}/contracts/{config.CURVEGRID_ENS_REGISTRY_CONTRACT_LABEL}/methods/text"

        args = {
            "args": [namehash(ens), "avatar"],
            "signature": "text(bytes32,string)",
            "contractOverride": False,
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    api_url, headers=self.headers, json=args
                ) as response:
                    response.raise_for_status()
                    result = await response.json()
                    output = result.get("result", {}).get("output", "")
                    return (
                        output
                        if output != ""
                        else f"https://avatars.jakerunzer.com/{ens}"
                    )
        except Exception as e:
            logger.error(f"Error getting ENS avatar: {e}")
            return ""


multibaas_service = MultibaasService()
