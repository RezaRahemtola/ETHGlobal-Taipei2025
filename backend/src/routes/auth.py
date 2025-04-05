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
    AuthIsRegisteredResponse,
)
from src.services.auth import create_access_token, get_current_address
from src.services.multibaas import multibaas_service
from src.services.user import user_service
from src.utils.ethereum import format_eth_address, is_eth_signature_valid
from src.utils.logger import setup_logger

logger = setup_logger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


def auth_message(address: str) -> str:
    return f"Sign to authenticate with Solva with your wallet: {format_eth_address(address)}"


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
        f"0x{request.signature[578 : 578 + 130]}",  # Extracting the actual signature from the payload
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


@router.post(
    "/register",
    description="Adds an ENS subname to a user and creates the user in the database",
)
async def register_user(
    request: AuthRegisterRequest, user_address=Depends(get_current_address)
) -> AuthRegisterResponse:
    # First check if ENS subname is available
    is_available = await multibaas_service.is_ens_subname_available(request.username)
    if not is_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is not available",
        )

    # Register the ENS subname
    success = await multibaas_service.register_ens_subname(
        request.username, user_address
    )

    # If ENS registration was successful, create the user in the database
    if success:
        db_success = await user_service.create_user(
            address=user_address, username=request.username
        )
        if not db_success:
            logger.error(f"Failed to create user in database for {user_address}")
            # We don't want to fail the request if the database insert fails
            # since the ENS registration was successful

    return AuthRegisterResponse(success=success)


@router.get("/available-ens/{username}")
async def check_username(username: str) -> AuthCheckUsernameResponse:
    is_available = await multibaas_service.is_ens_subname_available(username)
    return AuthCheckUsernameResponse(available=is_available)


@router.get(
    "/is-registered",
    description="Check if a user is registered both on ENS and in the database",
)
async def is_registered(
    user_address=Depends(get_current_address),
) -> AuthIsRegisteredResponse:
    # Check if user exists in the database
    db_registered = await user_service.get_user_by_address(user_address)

    # User is considered registered if they exist in both ENS and the database
    return AuthIsRegisteredResponse(
        registered=db_registered is not None,
        username=db_registered.username if db_registered else None,
    )
