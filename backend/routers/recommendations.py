"""
Recommendations Router
GET  /api/recommendations
POST /api/recommendations/{id}/apply
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db, Recommendation, AgentLog

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.get("")
def list_recommendations(db: Session = Depends(get_db)):
    recs = db.query(Recommendation).order_by(Recommendation.created_at.desc()).all()
    return [
        {
            "id": str(r.id),
            "title": r.title,
            "description": r.description,
            "potentialSavings": r.potential_savings,
            "difficulty": r.difficulty,
            "status": r.status,
            "category": r.category,
        }
        for r in recs
    ]


@router.post("/{rec_id}/apply")
def apply_recommendation(rec_id: int, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    rec.status = "APPLIED"
    db.add(AgentLog(
        agent_type="Optimization Agent",
        action=f"Applied recommendation: {rec.title}",
        result=f"Estimated savings: {rec.potential_savings}",
    ))
    db.commit()
    return {"success": True, "id": rec_id, "status": "APPLIED"}
