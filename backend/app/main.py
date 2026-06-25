from fastapi import FastAPI
from uvicorn import run

from app.core.config.config import APP_SETTINGS
from app.modules.discover.routes import discover_route

# instancing of fastapi
app = FastAPI(
	title=APP_SETTINGS.APP_NAME,
	description=APP_SETTINGS.APP_DESCRIPTION,
	version=APP_SETTINGS.APP_VERSION
)

# App routes
app.include_router(router=discover_route, tags=["discover-books"], prefix=f"{APP_SETTINGS.SERVER_BASE_API}") # discover books routes

if __name__ == "__main__":
	# Staring uvicorn local server
	run(
		app=APP_SETTINGS.SERVER_PATH,
		host=APP_SETTINGS.SERVER_HOST,
		port=APP_SETTINGS.SERVER_PORT,
		reload=APP_SETTINGS.SERVER_RELOAD,
	)
