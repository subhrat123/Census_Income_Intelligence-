import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.records import router as records_router
from app.routes.metrics import router as metrics_router
from app.routes.prediction import router as prediction_router

app = FastAPI(
    title="Census Income Intelligence Platform"
)

def _parse_origins() -> list[str]:
    origins = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000"
    )
    return [origin.strip() for origin in origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_parse_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(records_router, prefix="/api")
app.include_router(metrics_router, prefix="/api")
app.include_router(prediction_router, prefix="/api")

@app.get("/")
def home():
    return {
        "message": "Backend running successfully"
    }

@app.get("/health")
def health():
    return {
        "status": "ok"
    }
