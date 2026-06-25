from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
	"""App's Env Config Settings"""

	# Configuring env location and prefix
	model_config = SettingsConfigDict(
		env_file=".env",
		env_file_encoding="utf-8",
		env_prefix="FASTAPI_",
		extra="ignore"
	)

	# loading env variables
	APP_NAME: str
	APP_DESCRIPTION: str
	APP_VERSION: str
	APP_ENVIRONMENT: str
	
	SERVER_PATH: str
	SERVER_HOST: str
	SERVER_PORT: int
	SERVER_RELOAD: bool
	SERVER_WORKERS: int
	SERVER_BASE_API: str
	
	PRODUCTION_DATABASE: str
	DATABASE_LOGS: bool
	AUTOFLUSH: bool
	EXPIRE_ON_COMMIT: bool

	BIBLE_BASE_API_URL: str

# Loading Settings only once per app
@lru_cache
def get_settings() -> Settings:
	return Settings() # type: ignore

# Instancing settings for glabal access
APP_SETTINGS = get_settings()
