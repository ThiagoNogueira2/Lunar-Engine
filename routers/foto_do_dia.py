from datetime import date as Date

from fastapi import APIRouter, Query

from core.config import API_KEY, NASA
from core.proxy import proxy

router = APIRouter(prefix="/apod", tags=["APOD"])


@router.get("", summary="Foto do Dia (APOD)")
async def apod(
    date: str | None = Query(
        None,
        description="Data da foto no formato YYYY-MM-DD. Se omitido, retorna a foto de hoje.",
        example="2024-12-25",
    ),
):
    """Retorna a Astronomy Picture of the Day para uma data específica ou para hoje."""
    params: dict = {"api_key": API_KEY}
    if date:
        params["date"] = date
    return await proxy(f"{NASA}/planetary/apod", params)
