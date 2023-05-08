"""Main API module"""

import requests
import uvicorn
from bs4 import BeautifulSoup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/metadata")
def get_metadata(url: str) -> dict:
    """Get metadata from a URL"""
    req = requests.get(url, timeout=5)
    req.raise_for_status()

    soup = BeautifulSoup(req.text, "html.parser")
    meta_tags = soup.find_all("meta")

    metadata = {}
    for tag in meta_tags:
        if not tag.get("property", "").startswith("og:"):
            continue

        key = tag.get("property").replace("og:", "")
        value = tag.get("content")
        metadata[key] = value

    return metadata


@app.get("/healthcheck")
def healthcheck() -> dict:
    """Health check"""
    return {"status": "ok"}


def start():
    """Launched with `poetry run start` at root level"""
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
