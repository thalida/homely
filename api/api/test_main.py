"""Test the main.py file in the api directory."""

from unittest.mock import patch

from fastapi.testclient import TestClient
import pytest

from .main import app

client = TestClient(app)


def test_healthcheck():
    """Test the main endpoint."""
    response = client.get("/healthcheck")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@patch("requests.get")
def test_metadata__has_data(mock_get):
    """Test the metadata endpoint."""
    mock_get.return_value.status_code = 200
    mock_get.return_value.text = """
    <html>
        <head>
            <meta property="og:title" content="Test title">
            <meta property="og:description" content="Test description">
            <meta property="og:image" content="https://test.local.example/image.png">
            <meta property="notog:title" content="Test notog title">
        </head>
    </html>
    """

    response = client.get("/metadata?url=https://test.local.example")

    mock_get.assert_called_once_with("https://test.local.example", timeout=5)
    assert response.status_code == 200
    assert response.json() == {
        "title": "Test title",
        "description": "Test description",
        "image": "https://test.local.example/image.png",
    }


@patch("requests.get")
def test_metadata__no_data(mock_get):
    """Test the metadata endpoint."""
    mock_get.return_value.status_code = 200
    mock_get.return_value.text = """
    <html>
        <head></head>
    </html>
    """

    response = client.get("/metadata?url=https://test.local.example")

    mock_get.assert_called_once_with("https://test.local.example", timeout=5)
    assert response.status_code == 200
    assert response.json() == {}
