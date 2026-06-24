from fastapi import FastAPI
from uvicorn import run

# instancing of fastapi
app = FastAPI()

if __name__ == "__main__":
	# Staring uvicorn local server
	run(
		app="app.main:app",
		host="127.0.0.1",
		port=5000,
		reload=True
	)
