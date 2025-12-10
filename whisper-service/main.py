from fastapi import FastAPI, UploadFile, HTTPException
from faster_whisper import WhisperModel
import os
import shutil

app = FastAPI()

# Configuration
MODEL_SIZE = "base.en"
# Check if NVIDIA GPU is available, else CPU (for local testing)
DEVICE = "cpu"
COMPUTE_TYPE = "int8"

print(f"🚀 Loading Whisper Model: {MODEL_SIZE} on {DEVICE}...")
# This loads the model into VRAM (High Memory Usage)
model = WhisperModel(
    MODEL_SIZE, 
    device=DEVICE, 
    compute_type=COMPUTE_TYPE,
    cpu_threads=10
)
print("✅ Model Loaded!")

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile):
    """
    Receives a binary audio chunk (wav/mp3/m4a) and returns text.
    """
    temp_filename = f"temp_{file.filename}"
    
    try:
        # Save received bytes to disk temporarily
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run Inference
        segments, info = model.transcribe(
            temp_filename, 
            beam_size=5,
            vad_filter=True, # Prevent hallucination on silence
            vad_parameters=dict(min_silence_duration_ms=500)
        )
        
        # Combine segments into single string
        transcript = " ".join([segment.text for segment in segments])
        
        return {
            "text": transcript.strip(),
            "language": info.language,
            "duration": info.duration
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Cleanup temp file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
