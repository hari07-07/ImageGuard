from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import shutil
import os
from model import predict_image
from video_utils import analyze_video

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "temp"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
def home():
    return {"message": "Deepfake Detection API Running"}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    image = Image.open(file.file).convert("RGB")
    result, confidence = predict_image(image)

    return {
        "type": "Image",
        "result": result,
        "confidence": confidence
    }

@app.post("/analyze-video")
async def analyze_video_endpoint(file: UploadFile = File(...)):
    video_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result, confidence = analyze_video(video_path)

    os.remove(video_path)

    return {
        "type": "Video",
        "result": result,
        "confidence": confidence
    }
