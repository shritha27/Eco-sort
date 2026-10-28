from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_get_waste_items():
    response = client.get("/api/waste-items")
    assert response.status_code == 200
    items = response.json()
    assert isinstance(items, list)
    assert len(items) > 0


def test_get_categories():
    response = client.get("/api/waste-items/categories")
    assert response.status_code == 200
    categories = response.json()
    assert isinstance(categories, list)
    assert "Wet / Biodegradable" in categories or "Dry Recyclable" in categories


def test_search_waste_items():
    response = client.get("/api/waste-items/search?q=plastic")
    assert response.status_code == 200
    results = response.json()
    assert isinstance(results, list)
    assert len(results) > 0
    assert any("plastic" in r["name"].lower() or "plastic" in r["category"].lower() for r in results)


def test_search_empty_query():
    response = client.get("/api/waste-items/search?q=nonexistentxyz998877")
    assert response.status_code == 200
    results = response.json()
    assert isinstance(results, list)
    assert len(results) == 0
