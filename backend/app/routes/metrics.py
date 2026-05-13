from fastapi import APIRouter
from app.services.metrics_service import fetch_metrics

router = APIRouter()

@router.get("/metrics")
def get_metrics():

    data = fetch_metrics()

    return {
        "success": True,
        "metrics": data
    }