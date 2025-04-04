import logging
import os

from dotenv import load_dotenv


class _Config:
    CURVEGRID_API_KEY: str
    CURVEGRID_DEPLOYMENT_URL: str

    LOG_LEVEL: int
    LOG_FILE: str | None

    JWT_SECRET: str
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int
    IS_DEVELOPMENT: bool

    def __init__(self):
        load_dotenv()
        self.CURVEGRID_API_KEY = os.getenv("CURVEGRID_API_KEY")
        self.CURVEGRID_DEPLOYMENT_URL = os.getenv("CURVEGRID_DEPLOYMENT_URL")

        # Configure logging
        log_level_str = os.getenv("LOG_LEVEL", "INFO").upper()
        self.LOG_LEVEL = getattr(logging, log_level_str, logging.INFO)
        self.LOG_FILE = os.getenv("LOG_FILE", None)

        self.JWT_SECRET = os.getenv("JWT_SECRET")
        self.JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(
            os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES")
        )
        self.IS_DEVELOPMENT = os.getenv("IS_DEVELOPMENT", "False").lower() == "true"


config = _Config()
