"""
Agents Router
POST /api/agents/run  - trigger multi-agent pipeline
GET  /api/agents/status - get agent status
"""
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db
from orchestrator import run_all_agents

router = APIRouter(prefix="/api/agents", tags=["agents"])

_pipeline_status = {"running": False, "last_run": None, "result": None}


def _run_pipeline_bg(db_url: str):
    """Run agent pipeline in background."""
    from database import SessionLocal
    db = SessionLocal()
    try:
        result = run_all_agents(db)
        _pipeline_status["running"] = False
        _pipeline_status["result"] = {
            "cost_records": result.get("cost_analyzer", {}).get("records", 0),
            "new_anomalies": result.get("anomaly", {}).get("new_anomalies", 0),
            "new_recommendations": result.get("optimization", {}).get("new_recommendations", 0),
            "ai_summary": result.get("ai_summary", "Analysis complete"),
        }
        from datetime import datetime
        _pipeline_status["last_run"] = datetime.utcnow().isoformat()
    except Exception as e:
        _pipeline_status["running"] = False
        _pipeline_status["result"] = {"error": str(e)}
    finally:
        db.close()


@router.post("/run")
def run_agents(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Trigger the full multi-agent pipeline."""
    if _pipeline_status["running"]:
        return {"message": "Agent pipeline is already running", "status": "running"}

    _pipeline_status["running"] = True
    background_tasks.add_task(_run_pipeline_bg, "")

    return {
        "message": "Multi-agent pipeline started",
        "agents": [
            "Cost Analyzer Agent",
            "Anomaly Detection Agent",
            "Optimization Agent",
            "Multi-Cloud Agent",
        ],
        "status": "running",
    }


@router.get("/status")
def get_agent_status():
    return {
        "running": _pipeline_status["running"],
        "last_run": _pipeline_status["last_run"],
        "result": _pipeline_status["result"],
    }
