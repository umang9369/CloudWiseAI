# CloudWise AI — Project Report

This document outlines the detailed architecture, decisions, and capabilities of the CloudWise AI platform following its complete migration to a Python FastAPI and multi-agent AI architecture.

## 1. Executive Summary

CloudWise AI is a unified cloud cost optimization dashboard that connects to a user’s cloud infrastructure (via AWS STS identity services) and utilizes a sequence of four specialized AI agents to analyze costs, detect anomalies, suggest optimizations, and evaluate multi-cloud strategies.

The project recently completely transitioned its backend from a Node.js/TypeScript Express server to a **Python FastAPI** structure to better support advanced LLM orchestration, dynamic vector storage (ChromaDB), and persistent agent execution schemas.

---

## 2. Architectural Overview

The platform uses a decoupled client-server model:

### Frontend
- **Framework:** React 18 powered by Vite.
- **Styling:** Tailwind CSS with a distinctive dark-mode "terminal/hacker" aesthetic using monospace fonts (`Space Mono` and `Inter`).
- **State Management:** React hooks handling asynchronous data fetches across 5 main routes (`/app`, `/app/anomalies`, `/app/recommendations`, `/app/simulator`, `/app/query`).
- **Key Flow:** The application forces an initialization phase (`LandingPage.tsx`) where the user must provide AWS credentials. These flow directly to the backend to authenticate via STS before the dashboard unlocks.

### Backend (Python FastAPI)
The backend is structured into clear modular domains (`core/`, `agents/`, `routers/`):
- **Core (`core/`)**:
  - `database.py`: Handles SQLAlchemy ORM mappings and PostgreSQL initialization (with automatic SQLite fallback for local development).
  - `vectorstore.py`: Initializes the ChromaDB persistent client to store text embeddings of agent findings, enabling RAG (Retrieval-Augmented Generation).
  - `llm_client.py`: Integrates with the Groq API (`llama-3.3-70b-versatile`) to generate intelligent summaries and answer natural language queries. Includes a smart fallback to handle invalid API keys by parsing the context rule-based.
- **Routers (`routers/`)**:
  - Houses all REST endpoints (`auth.py`, `dashboard.py`, `query.py`, etc.) ensuring separation of concerns for the API surface.

---

## 3. The Multi-Agent System

The defining feature of CloudWise AI is its multi-agent orchestration. Instead of a single monolithic analysis script, the system deploys 4 distinct agents:

1. **Cost Analyzer Agent (`agents/cost_analyzer.py`)** 
   - **Role:** Extracts line-item billing data. In a production environment, this interfaces directly with AWS Cost Explorer (`ce` boto3 client). 
   - **Output:** Categorizes top spending resources, formats metrics into human-readable cost reports, and calculates month-over-month trajectories.

2. **Anomaly Detection Agent (`agents/anomaly.py`)**
   - **Role:** Employs statistical baseline comparisons. 
   - **Algorithm:** Compares the rolling 7-day average of service costs against current daily spikes. Any service breaching a defined percentage baseline (e.g., >20%) gets flagged as a high-severity anomaly.

3. **Optimization Agent (`agents/optimization.py`)**
   - **Role:** Actionable intelligence. 
   - **Output:** Locates idle resources (e.g., EC2 instances sitting at <5% CPU), unattached EBS volumes, and legacy load balancers. Generates "Rightsizing" and "Reserved Instance" purchase recommendations, calculating exact monthly dollar volume savings.

4. **Multi-Cloud Agent (`agents/multicloud.py`)**
   - **Role:** Evaluates workload definitions against public pricing APIs for Microsoft Azure and Google Cloud Platform. 
   - **Output:** Identifies if current compute-heavy or storage-heavy workloads could be run cheaper natively on a competing cloud provider.

### The Orchestrator
The `orchestrator.py` script acts as the crucial manager. Upon system initialization (when the user connects their cloud), the orchestrator triggers all 4 agents sequentially. 
It captures their detailed strings, uses the Groq LLM to synthesize short "Agent Findings", stores the raw metrics directly into the local SQL database, and simultaneously embeds the deep analytics into ChromaDB for the RAG query engine.

---

## 4. RAG-Powered Query Engine

The `/app/query` route enables users to type plain English questions about their cloud spend (e.g., *"Why did my RDS cost spike yesterday?"*).

**Flow:**
1. The user's query is sent to `routers/query.py`.
2. The endpoint queries **ChromaDB** using semantic search to retrieve the top 5 most relevant analytical chunks previously ingested by the agents.
3. The retrieved context + the user's prompt is sent to **Groq**. 
4. If Groq is unavailable (e.g., invalid API key), `llm_client.py` activates a local fallback parser that manually reads the RAG context string and constructs a highly intelligent answer using keyword routing.

---

## 5. Security & Deployment Posture

- **`.gitignore` Strategy**: Strict blocking of `.env` files, `cloudwise.db` (SQL data), `chroma_data/` (vector embeddings), and `__pycache__`/`node_modules` guarantees that zero proprietary cloud metrics or API keys are pushed to version control.
- **AWS STS Security**: The backend never permanently stores the user's secret keys. It utilizes `get_caller_identity` strictly to validate the IAM connection for the current session.
- **Extensibility**: The Python rewrite enables seamless future integration of PyTorch/TensorFlow for proprietary local anomaly models instead of relying purely on remote LLMs.
