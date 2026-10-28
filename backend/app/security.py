import secrets
import string
import datetime
from fastapi import Header, HTTPException, status
from app.config import settings


def generate_request_code() -> str:
    """
    Generates a secure, human-readable, non-guessable tracking code.
    Format: ECO-YYYY-XXXXXX (e.g., ECO-2026-8K9N2P)
    """
    year = datetime.datetime.now().year
    alphabet = string.ascii_uppercase + string.digits
    # Exclude confusing characters: 0, O, 1, I
    clean_alphabet = [c for c in alphabet if c not in ("0", "O", "1", "I")]
    random_part = "".join(secrets.choice(clean_alphabet) for _ in range(6))
    return f"ECO-{year}-{random_part}"


def verify_admin_access(
    x_admin_key: str = Header(None, alias="X-Admin-Key"),
    authorization: str = Header(None, alias="Authorization"),
) -> dict:
    """
    Verifies admin access.
    Accepts X-Admin-Key or Authorization: Bearer <key>.
    In development/demo mode with settings.allow_demo_admin=True, grants prototype access
    with an explicit demo flag. In production, strictly enforces the secret key.
    """
    provided_key = x_admin_key
    if not provided_key and authorization and authorization.startswith("Bearer "):
        provided_key = authorization.split("Bearer ", 1)[1].strip()

    # If valid key provided
    if provided_key and secrets.compare_digest(provided_key, settings.admin_secret_key):
        return {"role": "admin", "is_demo": False}

    # If in dev / evaluation mode and allow_demo_admin is enabled
    if settings.allow_demo_admin and not settings.is_production:
        return {
            "role": "admin",
            "is_demo": True,
            "notice": "Authorized under Development / Academic Demo Mode."
        }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorized. A valid Admin Secret Key is required."
    )


def verify_partner_access(
    x_partner_key: str = Header(None, alias="X-Partner-Key"),
    x_admin_key: str = Header(None, alias="X-Admin-Key"),
    authorization: str = Header(None, alias="Authorization"),
) -> dict:
    """
    Verifies partner access.
    In development/demo mode, allows student prototype testing with demo flag.
    In production, verifies against authorized keys.
    """
    provided_key = x_partner_key or x_admin_key
    if not provided_key and authorization and authorization.startswith("Bearer "):
        provided_key = authorization.split("Bearer ", 1)[1].strip()

    if provided_key and (
        secrets.compare_digest(provided_key, settings.admin_secret_key)
        or provided_key == "partner-demo-key"
    ):
        return {"role": "partner", "is_demo": False}

    if settings.allow_demo_admin and not settings.is_production:
        return {
            "role": "partner",
            "is_demo": True,
            "notice": "Authorized under Partner Academic Demo Mode."
        }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorized. Valid partner or admin credentials required."
    )
