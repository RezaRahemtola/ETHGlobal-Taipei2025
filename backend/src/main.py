from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import config

app = FastAPI(title="Solva backend")

# Add security scheme to OpenAPI documentation
app.openapi_components = {  # type: ignore
    "securitySchemes": {
        "CookieAuth": {"type": "apiKey", "in": "cookie", "name": "solva_auth"}
    }
}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://TODO-prod.com"]
    + (["http://localhost:5173"] if config.IS_DEVELOPMENT else []),
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,  # Required for cookies to be sent with requests
)


@app.get("/")
async def root():
    return {"message": "Hello World"}
