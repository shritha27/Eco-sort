import urllib.parse
from app.config import settings


class QRService:
    @staticmethod
    def generate_bin_target_url(category_name: str, app_base_url: str = None) -> str:
        """
        Creates the public URL that a bin QR code links to.
        Points to the frontend waste guide page with the category filter applied.
        """
        base = app_base_url or settings.frontend_origin or "http://localhost:5173"
        base = base.rstrip("/")
        encoded_category = urllib.parse.quote(category_name)
        return f"{base}/guide?category={encoded_category}"


qr_service = QRService()
