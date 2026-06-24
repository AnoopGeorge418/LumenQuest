from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config.config import APP_SETTINGS

# Establishing database connection
async_engine = create_async_engine(
	url=APP_SETTINGS.PRODUCTION_DATABASE,
	echo=APP_SETTINGS.DATABASE_LOGS,
)
