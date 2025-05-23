from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
import requests
from pathlib import Path
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path, override=False)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_ENDPOINTS = {
    "herdnet": os.getenv("HERDNET_URL"),
    "maskrcnn": os.getenv("MASKRCNN_URL"),
    "detr": os.getenv("DETR_URL")
}


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    model: str = Form("herdnet")
):
    try:
        external_url = MODEL_ENDPOINTS.get(model)
        if not external_url:
            raise HTTPException(status_code=400, detail=f"Invalid model '{model}'")

        file_bytes = await file.read()

        files = {
            "file": (file.filename, file_bytes, file.content_type)
        }

        response = requests.post(external_url, files=files)
        response.raise_for_status()

        return JSONResponse(content=response.json())

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Failed to forward request: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
