import fastapi
from fastapi import APIRouter, HTTPException, status, Depends

from src.config import config
from src.interfaces.auth import (
    AuthLoginRequest,
    AuthLoginResponse,
    AuthMessageRequest,
    AuthMessageResponse,
    AuthRegisterRequest,
    AuthRegisterResponse,
    AuthCheckUsernameResponse,
)
from src.services.auth import create_access_token, get_current_address
from src.services.multibaas import multibaas_service
from src.utils.ethereum import format_eth_address, is_eth_signature_valid
from src.utils.logger import setup_logger

logger = setup_logger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


def auth_message(address: str) -> str:
    return f"Sign to authenticate with LibertAI with your wallet: {format_eth_address(address)}"


@router.post("/message")
async def get_auth_message(request: AuthMessageRequest) -> AuthMessageResponse:
    """Get the static message for wallet signature authentication."""

    return AuthMessageResponse(message=auth_message(request.address))


@router.post("/login")
async def login_with_wallet(
    request: AuthLoginRequest, response: fastapi.Response
) -> AuthLoginResponse:
    """Authenticate with a wallet signature."""
    if not is_eth_signature_valid(
        auth_message(request.address),
        request.signature,
        request.address,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid signature",
        )

    # Create access token
    access_token = create_access_token(address=request.address)

    # Set the token as an HTTP-only cookie
    response.set_cookie(
        key="solva_auth",
        value=access_token,
        httponly=True,
        max_age=config.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="none",
        secure=True,
    )

    logger.debug(f"Generated access token for address {request.address}")

    return AuthLoginResponse(access_token=access_token, address=request.address)


@router.post("/register", description="Adds an ENS subname to a user")
async def register_user(
    request: AuthRegisterRequest, user_address=Depends(get_current_address)
) -> AuthRegisterResponse:
    success = await multibaas_service.register_ens_subname(
        request.username, user_address
    )
    return AuthRegisterResponse(success=success)


@router.get("/available-ens/{username}")
async def check_username(username: str) -> AuthCheckUsernameResponse:
    is_available = await multibaas_service.is_ens_subname_available(username)
    return AuthCheckUsernameResponse(available=is_available)


@router.get("/is-registered", description="Check if a user is registered")
async def is_registered(user_address=Depends(get_current_address)) -> bool:
    result = await multibaas_service.is_user_registered(user_address)
    return result
