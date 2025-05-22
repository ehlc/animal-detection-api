from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import boto3
import os
import uuid
import json
import requests

from pathlib import Path
from dotenv import load_dotenv
import os


env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path, override=False) 

app = FastAPI()


SAMPLE_RESPONSE = '{"url": "", "inference": [  {"class_id": 0, "class_name": "Clase 0", "count": 15, "avg_confidence": 2.03},  {"class_id": 2, "class_name": "Clase 2", "count": 107, "avg_confidence": 5.34},  {"class_id": 4, "class_name": "Clase 4", "count": 29, "avg_confidence": 4.13},  {"class_id": 5, "class_name": "Clase 5", "count": 9, "avg_confidence": 1.88}]}'
S3_BUCKET = os.getenv("S3_BUCKET")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("REGION_NAME")


session = boto3.Session(
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)


s3_client = boto3.client("s3", region_name=AWS_REGION)
sagemaker_client = boto3.client("sagemaker-runtime", region_name=AWS_REGION)

def upload_to_s3(image_bytes: bytes, filename: str) -> str:
    s3_key = f"inference-inputs/{uuid.uuid4()}-{filename}"
    s3_client.put_object(
        Bucket=S3_BUCKET,
        Key="image_uploads/" + s3_key,
        Body=image_bytes,
        ContentType="image/jpeg"
    )
    return f"s3://{S3_BUCKET}/{s3_key}"

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".jpg", ".jpeg", ".png")):
        raise HTTPException(status_code=400, detail="Solo se permiten imágenes JPG, JPEG o PNG")

    try:
        import requests

        url = "https://catfact.ninja/fact" 
        payload = {
            "image_url": "https://example.com/image.jpg",
            "threshold": 0.5
        }

        # response = requests.post(url, json=payload)
        response = requests.get(url)
        
        if response.status_code == 200:
            print("✅ Success:", response.json())
        else:
            print(f"Error {response.status_code}:", response.text)



        # result = response["Body"].read().decode("utf-8")
        # return JSONResponse(content={"prediction": "image"})
        return SAMPLE_RESPONSE

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
