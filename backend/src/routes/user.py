import asyncio

import aiohttp
from fastapi import UploadFile, File, APIRouter, HTTPException, Query
from fastapi.params import Depends

from src.config import config
from src.interfaces.transaction import GetTransactionsResponse
from src.interfaces.user import UserSearchResult, SearchUsersResponse
from src.services.auth import get_current_address
from src.services.multibaas import multibaas_service
from src.services.transaction import transaction_service
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

    success = await multibaas_service.change_ens_avatar(
        get_ens_from_username(user.username), image_url
    )
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update ENS avatar")
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


@router.get("/transactions", description="Get all transactions for the connected user")
async def get_user_transactions(
    user_address=Depends(get_current_address),
) -> GetTransactionsResponse:
    transactions = await transaction_service.get_user_transactions(user_address)
    return GetTransactionsResponse(transactions=transactions)


@router.get("/search", description="Search for users by username or address")
async def search_users(
    query: str = Query(
        ..., min_length=1, description="Search query for username or address"
    ),
    limit: int = Query(
        10, ge=1, le=50, description="Maximum number of results to return"
    ),
    current_user_address=Depends(get_current_address),
) -> SearchUsersResponse:
    # Get current user
    current_user = await user_service.get_user_by_address(current_user_address)
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Search for users, excluding the current user
    users = await user_service.search_users(
        query=query, 
        limit=limit,
        exclude_address=current_user_address
    )

    # Fetch all avatars in parallel for better performance
    avatar_tasks = [
        multibaas_service.get_ens_avatar(get_ens_from_username(user.username))
        for user in users
    ]
    avatar_urls = await asyncio.gather(*avatar_tasks)

    # Combine users with their avatar URLs
    result_users = [
        UserSearchResult(
            username=user.username, address=user.address, avatar_url=avatar_url
        )
        for user, avatar_url in zip(users, avatar_urls)
    ]

    return SearchUsersResponse(users=result_users)
