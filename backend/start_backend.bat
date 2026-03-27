@echo off
title CloudWise AI - Backend Server
echo =========================================
echo  CloudWise AI - FastAPI Backend (Port 8000)
echo =========================================
echo.

cd /d "%~dp0"

echo [1/2] Installing Python dependencies...
pip install fastapi uvicorn sqlalchemy python-dotenv groq chromadb boto3 botocore pydantic pydantic-settings python-multipart httpx psycopg2-binary --quiet
echo [INFO] Dependencies ready.
echo.

echo [2/2] Starting FastAPI server on http://localhost:8000 ...
echo [INFO] API Docs available at: http://localhost:8000/docs
echo [INFO] Press Ctrl+C to stop
echo.
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

pause
