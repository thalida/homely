import requests
from bs4 import BeautifulSoup

def fetch_metadata(url: str) -> dict:
    """Fetch metadata from a URL"""
    """Get metadata from a URL"""
    req = requests.get(url, timeout=5)
    req.raise_for_status()

    soup = BeautifulSoup(req.text, "html.parser")
    meta_tags = soup.find_all("meta")

    metadata = {}

    icon_link = soup.find("link", rel="shortcut icon")
    if icon_link is None:
        icon_link = soup.find("link", rel="icon")

    if icon_link:
        metadata["icon"] = icon_link["href"]

    for tag in meta_tags:
        if not tag.get("property", "").startswith("og:"):
            continue

        key = tag.get("property").replace("og:", "")
        value = tag.get("content")
        metadata[key] = value

    return metadata
