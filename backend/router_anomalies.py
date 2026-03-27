"""
Anomalies Router
GET  /api/anomalies
POST /api/anomalies/{id}/acknowledge
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, Anomaly

router = APIRouter(prefix="/api/anomalies", tags=["anomalies"])


@router.get("")
def list_anomalies(db: Session = Depends(get_db)):
    anomalies = db.query(Anomaly).order_by(Anomaly.created_at.desc()).all()
    return [
        {
            "id": str(a.id),
            "service": a.service,
            "resource": a.resource,
            "detected": a.detected,
            "spike": a.spike,
            "baseline": a.baseline,
            "current": a.current_cost,
            "status": a.status,
            "explanation": a.explanation,
            "severity": a.severity,
        }
        for a in anomalies
    ]


@router.post("/{anomaly_id}/acknowledge")
def acknowledge_anomaly(anomaly_id: int, db: Session = Depends(get_db)):
    anomaly = db.query(Anomaly).filter(Anomaly.id == anomaly_id).first()
    if not anomaly:
        raise HTTPException(status_code=404, detail="Anomaly not found")
    anomaly.status = "ACKNOWLEDGED"
    db.commit()
    return {"success": True, "id": anomaly_id, "status": "ACKNOWLEDGED"}
