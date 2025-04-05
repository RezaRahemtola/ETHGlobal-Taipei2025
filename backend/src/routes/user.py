import aiohttp
from fastapi import UploadFile, File, APIRouter, HTTPException
from fastapi.params import Depends

from src.config import config
from src.services.auth import get_current_address
from src.services.multibaas import multibaas_service
from src.services.user import user_service
from src.utils.ens import get_ens_from_username
from src.utils.logger import setup_logger

logger = setup_logger(__name__)

router = APIRouter(prefix="/user", tags=["User"])


@router.post(
    "/avatar", description="Create or update the avatar (using ENS text records"
)
async def change_avatar(
    file: UploadFile = File(...), user_address=Depends(get_current_address)
) -> str:
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"

    data = aiohttp.FormData()
    data.add_field(
        name="file",
        value=await file.read(),  # Read file contents
        filename=file.filename,
        content_type=file.content_type,
    )

    headers = {
        "Authorization": f"Bearer {config.PINATA_JWT}",
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, data=data, headers=headers) as response:
            response.raise_for_status()
            result = await response.json()
            image_url = f"https://gateway.pinata.cloud/ipfs/{result.get("IpfsHash")}"

    user = await user_service.get_user_by_address(user_address)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await multibaas_service.change_ens_avatar(
        get_ens_from_username(user.username), image_url
    )
    return image_url


@router.get("/avatar", description="Get the avatar URL")
async def get_avatar(user_address=Depends(get_current_address)) -> str:
    user = await user_service.get_user_by_address(user_address)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    avatar_url = await multibaas_service.get_ens_avatar(
        get_ens_from_username(user.username)
    )
    return avatar_url
