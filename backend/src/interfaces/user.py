from pydantic import BaseModel


class UserSearchResult(BaseModel):
    """Model representing a user search result."""

    username: str
    address: str
    avatar_url: str


class SearchUsersResponse(BaseModel):
    """Response model for user search."""

    users: list[UserSearchResult]
