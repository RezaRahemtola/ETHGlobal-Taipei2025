from eth_utils import keccak, to_hex


def get_ens_from_username(username: str) -> str:
    return f"{username}.solva-app.eth"


def namehash(name: str) -> str:
    """
    Returns the 32-byte hex string (with 0x prefix).
    """
    node = b"\x00" * 32  # Start with 32 bytes of zero
    if name:
        labels = name.split(".")[::-1]  # split and reverse
        for label in labels:
            label_hash = keccak(text=label)
            node = keccak(node + label_hash)
    return to_hex(node)
