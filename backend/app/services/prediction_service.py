import os
import requests
from dotenv import load_dotenv

load_dotenv()

ML_ENDPOINT = os.getenv("ML_ENDPOINT")
TOKEN = os.getenv("DATABRICKS_TOKEN")

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

def predict_income(
    age,
    education_num,
    capital_gain,
    capital_loss,
    hours_per_week
):

    payload = {
    "dataframe_split": {
        "columns": ["features"],
        "data": [
            [[
                float(age),
                float(education_num),
                float(capital_gain),
                float(capital_loss),
                float(hours_per_week)
            ]]
        ]
    }
}

    response = requests.post(
        ML_ENDPOINT,
        headers=headers,
        json=payload
    )

    print("STATUS:", response.status_code)
    print("RESPONSE:", response.text)

    try:
        result = response.json()
    except:
        return {
            "error": response.text
        }

    if "predictions" not in result:
        return {
            "unexpected_response": result
        }

    prediction = result["predictions"][0]

    label = ">80K" if prediction == 1 else "<=80K"

    return {
        "prediction": label,
        "raw_prediction": prediction
    }