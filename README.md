# ☁️ CloudWise AI

CloudWise AI is a complete, multi-agent cloud cost optimization platform. It utilizes a state-of-the-art AI architecture to connect to your cloud provider (AWS), analyze your bill, detect anomalies, and suggest actionable cost-saving strategies.

## ✨ Features

- **Multi-Agent AI Pipeline**: Four specialized agents work collaboratively to analyze your infrastructure. 
    1. **Cost Analyzer**: Locates expensive services and categorizes them.
    2. **Anomaly Detection**: Compares current spend against rolling baselines to detect spikes.
    3. **Optimization Agent**: Scans for idle resources, rightsizing opportunities, and unused reservations.
    4. **Multi-Cloud Agent**: Compares AWS workloads against Azure and GCP for potential pricing arbitrage.
- **RAG-Powered AI Chat**: The platform maintains an interactive natural language chat allowing users to freely query their entire cloud ecosystem using Groq LLM and ChromaDB.
- **Dynamic Dashboard**: React-based UI that presents insights and metrics in a terminal-themed dark mode environment.
- **Self-Contained Demo Mode**: Fully usable on standard computers without actual AWS keys, automatically seeding realistic mock data for comprehensive demonstrations.

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Lucide React (Icons)
- Recharts (Data Visualization)

**Backend:**
- Python 3+
- FastAPI (High-performance API framework)
- PostgreSQL / SQLite (Relational structure)
- ChromaDB (Vector database for RAG context)
- Groq (Llama-3.3-70b-versatile for high-speed AI reasoning)
- Boto3 (AWS SDK for cloud communication)

## 🚀 Getting Started

### 1. Backend Setup

The backend runs on port `8000`.

1. Open a terminal in the `backend/` directory.
2. Install dependencies: 
   ```bash
   pip install fastapi uvicorn sqlalchemy python-dotenv groq chromadb boto3 botocore pydantic pydantic-settings python-multipart httpx psycopg2-binary
   ```
3. Set your Groq API key in `.env` inside the `backend` folder:
   ```env
   GROQ_API_KEY=gsk_your_key_here
   ```
4. Start the server (or use the one-click `backend/start_backend.bat` script):
   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### 2. Frontend Setup

The frontend runs on Vite's default dev port `5173`.

1. Open a terminal in the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server (or use the one-click `frontend/start_frontend.bat` script):
   ```bash
   npm run dev
   ```

### 3. Usage

Access the application in your browser at `http://localhost:5173`. 
Click the **"INITIALIZE SYSTEM"** button on the home page. The application will trigger an AWS connection modal. Once completed, you will be redirected to the live dashboard.
