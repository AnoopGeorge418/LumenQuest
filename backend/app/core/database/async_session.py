from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.core.database.connection import async_engine

local_async_session = async_sessionmaker(
	bind=async_engine,
	class_=AsyncSession,
	autoflush=True,
	expire_on_commit=True,
)
