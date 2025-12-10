# Use the official NVIDIA CUDA base image (Python 3.10)
FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04

# Install Python and utilities
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose port 8001 (Internal Communication)
EXPOSE 8001

# Run the service
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
