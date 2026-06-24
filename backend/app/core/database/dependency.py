from typing import Annotated, AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database.async_session import local_async_session

async def get_db() -> AsyncGenerator[AsyncSession, None]:
	async with local_async_session() as session:
		yield session

# Creating dependency
DbSession = Annotated[
	AsyncSession,
	Depends(get_db)
]
