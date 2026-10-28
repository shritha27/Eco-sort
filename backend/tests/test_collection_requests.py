import datetime
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_create_collection_request_valid():
    future_date = (datetime.date.today() + datetime.timedelta(days=2)).isoformat()
    payload = {
        "requester_name": "Test Student",
        "contact_email": "student@campus.edu",
        "contact_phone": "+1-555-0192",
        "waste_category": "Dry Recyclable",
        "description": "5 kg of discarded cardboard boxes and study papers",
        "quantity": 5.0,
        "quantity_unit": "kg",
        "pickup_area": "North Hostel Dorm 3B",
        "preferred_pickup_date": future_date,
        "additional_notes": "Please buzz room 302"
    }
    response = client.post("/api/collection-requests", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "request_code" in data
    assert data["request_code"].startswith("ECO-")
    assert data["status"] == "Pending"
    # Verify private personal phone is NOT in public response
    assert "contact_phone" not in data or data.get("contact_phone") is None


def test_create_collection_request_past_date_rejected():
    past_date = (datetime.date.today() - datetime.timedelta(days=2)).isoformat()
    payload = {
        "requester_name": "Test Student",
        "waste_category": "Dry Recyclable",
        "description": "Cardboard boxes",
        "quantity": 2.0,
        "quantity_unit": "kg",
        "pickup_area": "Campus Center",
        "preferred_pickup_date": past_date
    }
    response = client.post("/api/collection-requests", json=payload)
    assert response.status_code == 422


def test_create_collection_request_negative_quantity_rejected():
    future_date = (datetime.date.today() + datetime.timedelta(days=2)).isoformat()
    payload = {
        "requester_name": "Test Student",
        "waste_category": "Dry Recyclable",
        "description": "Cardboard boxes",
        "quantity": -5.0,
        "quantity_unit": "kg",
        "pickup_area": "Campus Center",
        "preferred_pickup_date": future_date
    }
    response = client.post("/api/collection-requests", json=payload)
    assert response.status_code == 422


def test_request_lifecycle_and_cancellation():
    future_date = (datetime.date.today() + datetime.timedelta(days=3)).isoformat()
    payload = {
        "requester_name": "Cancellation Tester",
        "waste_category": "Electronic Waste",
        "description": "Old monitor and keyboard",
        "quantity": 1.0,
        "quantity_unit": "items",
        "pickup_area": "Lab Block 2",
        "preferred_pickup_date": future_date
    }
    create_resp = client.post("/api/collection-requests", json=payload)
    assert create_resp.status_code == 201
    code = create_resp.json()["request_code"]

    # Retrieve by tracking code
    get_resp = client.get(f"/api/collection-requests/{code}")
    assert get_resp.status_code == 200
    assert get_resp.json()["status"] == "Pending"

    # Cancel while pending
    cancel_resp = client.post(f"/api/collection-requests/{code}/cancel", json={"cancellation_reason": "Donated to friend"})
    assert cancel_resp.status_code == 200
    assert cancel_resp.json()["status"] == "Cancelled"

    # Try cancelling again - should be rejected because no longer Pending
    second_cancel = client.post(f"/api/collection-requests/{code}/cancel")
    assert second_cancel.status_code == 400
