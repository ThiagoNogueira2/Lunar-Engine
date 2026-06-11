import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

API_KEY: str | None = os.getenv("NASA_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "NASA_API_KEY não definida. Copie .env.example para .env e preencha sua chave da NASA."
    )

NASA = "https://api.nasa.gov"
DONKI = "https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get"
MARS_ROVERS = "https://rovers.nebulum.one/api/v1"
IMAGES = "https://images-api.nasa.gov"
SSD = "https://ssd-api.jpl.nasa.gov"
EONET = "https://eonet.gsfc.nasa.gov/api/v3"
CELESTRAK = "https://celestrak.org/NORAD/elements/gp.php"
EXO = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI"
OSDR = "https://osdr.nasa.gov"
TECHPORT = "https://techport.nasa.gov/api"
TECHTRANSFER = "https://technology.nasa.gov/api/api"
GIBS_WMS = "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"
GIBS_LAYER = "MODIS_Terra_CorrectedReflectance_TrueColor"
