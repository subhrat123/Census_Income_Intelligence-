from fastapi import APIRouter
from app.services.databricks_service import fetch_records

router = APIRouter()

@router.get("/records")
def get_records(
    page: int = 1,
    limit: int = 20,
    search: str = "",
    workclass: str = "",
    sort: str = "age",
    order: str = "asc"
):

    data = fetch_records(
        page,
        limit,
        search,
        workclass,
        sort,
        order
    )

    return {
        "success": True,
        "page": page,
        "limit": limit,
        "search": search,
        "workclass": workclass,
        "sort": sort,
        "order": order,
        "count": len(data),
        "data": data
    }