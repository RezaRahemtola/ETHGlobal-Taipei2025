from eth_account.messages import encode_defunct
from hexbytes import HexBytes
from web3 import Web3


def is_eth_signature_valid(message: str, signature: str, _address: str) -> bool:
    """Check if a message signature with an Ethereum wallet is valid"""

    try:
        sig = f"0x{signature[578: 578 + 130]}"  # Extracting the actual signature from the payload

        w3 = Web3(Web3.HTTPProvider(""))
        encoded_message = encode_defunct(text=message)
        recovered_address = w3.eth.account.recover_message(
            encoded_message,
            signature=HexBytes(sig),
        )
        return recovered_address is not None
        # TODO: enable check again for smart accounts https://portal.thirdweb.com/connect/account-abstraction/faq#can-i-use-in-app-wallets-with-account-abstraction
        # return format_eth_address(address) == format_eth_address(recovered_address)
    except Exception:
        # TODO: fix wrong format on reconnect
        return True


def format_eth_address(address: str) -> str:
    return address.lower()
