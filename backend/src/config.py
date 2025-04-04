import logging
import os

from dotenv import load_dotenv


class _Config:
    CURVEGRID_API_KEY: str
    CURVEGRID_DEPLOYMENT_URL: str
    CURVEGRID_ENS_REGISTAR_CONTRACT_LABEL: str
    CURVEGRID_ENS_REGISTAR_CONTRACT_ADDRESS_ALIAS: str
    CURVEGRID_HSM_ADDRESS: str
    CURVEGRID_ENS_REGISTRY_CONTRACT_LABEL: str
    CURVEGRID_ENS_REGISTRY_CONTRACT_ADDRESS_ALIAS: str

    LOG_LEVEL: int
    LOG_FILE: str | None

    DATABASE_URL: str

    JWT_SECRET: str
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int
    IS_DEVELOPMENT: bool

    def __init__(self):
        load_dotenv()
        self.CURVEGRID_API_KEY = os.getenv("CURVEGRID_API_KEY")
        self.CURVEGRID_DEPLOYMENT_URL = os.getenv("CURVEGRID_DEPLOYMENT_URL")
        self.CURVEGRID_ENS_REGISTAR_CONTRACT_LABEL = os.getenv(
            "CURVEGRID_ENS_REGISTAR_CONTRACT_LABEL"
        )
        self.CURVEGRID_ENS_REGISTAR_CONTRACT_ADDRESS_ALIAS = os.getenv(
            "CURVEGRID_ENS_REGISTAR_CONTRACT_ADDRESS_ALIAS"
        )
        self.CURVEGRID_HSM_ADDRESS = os.getenv("CURVEGRID_HSM_ADDRESS")
        self.CURVEGRID_ENS_REGISTRY_CONTRACT_LABEL = os.getenv(
            "CURVEGRID_ENS_REGISTRY_CONTRACT_LABEL"
        )
        self.CURVEGRID_ENS_REGISTRY_CONTRACT_ADDRESS_ALIAS = os.getenv(
            "CURVEGRID_ENS_REGISTRY_CONTRACT_ADDRESS_ALIAS"
        )

        # Configure logging
        log_level_str = os.getenv("LOG_LEVEL", "INFO").upper()
        self.LOG_LEVEL = getattr(logging, log_level_str, logging.INFO)
        self.LOG_FILE = os.getenv("LOG_FILE", None)

        self.DATABASE_URL = os.path.expandvars(os.getenv("DATABASE_URL", ""))

        self.JWT_SECRET = os.getenv("JWT_SECRET")
        self.JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(
            os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES")
        )
        self.IS_DEVELOPMENT = os.getenv("IS_DEVELOPMENT", "False").lower() == "true"


config = _Config()
