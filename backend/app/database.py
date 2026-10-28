import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger("ecosort.database")

resolved_url = settings.resolved_database_url

connect_args = {}
engine_kwargs = {
    "pool_pre_ping": True,
}

if resolved_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False
    logger.warning("[DEV MODE] Using local SQLite database (%s). Do not use SQLite for production.", resolved_url)
else:
    # Serverless pooling settings for PostgreSQL (Neon / Supabase)
    engine_kwargs.update({
        "pool_size": 5,
        "max_overflow": 10,
        "pool_recycle": 300,
    })

engine = create_engine(
    resolved_url,
    connect_args=connect_args,
    **engine_kwargs
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
