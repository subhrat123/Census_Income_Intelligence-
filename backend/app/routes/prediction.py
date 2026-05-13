from fastapi import APIRouter
from pydantic import BaseModel

from app.services.prediction_service import predict_income

router = APIRouter()

class PredictionRequest(BaseModel):

    age: int
    education_num: float
    capital_gain: float
    capital_loss: float
    hours_per_week: float

@router.post("/predict")
def predict(data: PredictionRequest):

    result = predict_income(
        data.age,
        data.education_num,
        data.capital_gain,
        data.capital_loss,
        data.hours_per_week
    )

    return {
        "success": True,
        "result": result
    }