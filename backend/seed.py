import sys
import logging
from app.database import engine, SessionLocal, Base
from app.seed_data import seed_initial_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ecosort.seed")


def main():
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Tables created or verified.")

    db = SessionLocal()
    try:
        count = seed_initial_data(db)
        logger.info("Database seeding complete. Total items: %d", count)
    finally:
        db.close()


if __name__ == "__main__":
    main()
