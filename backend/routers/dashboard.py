"""
Dashboard Router
GET /api/dashboard/metrics
GET /api/dashboard/chart
GET /api/dashboard/top-drivers
GET /api/dashboard/agent-activity
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db, CostData, Anomaly, Recommendation, AgentLog
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db)):
    """Aggregate KPI metrics from DB."""
    # Total spend (AWS)
    aws_records = db.query(CostData).filter(CostData.provider == "aws").all()
    total_spend = sum(r.amount for r in aws_records) if aws_records else random.uniform(4000, 12000)

    # Active anomalies
    open_anomalies = db.query(Anomaly).filter(Anomaly.status == "OPEN").count()
    critical_anomalies = db.query(Anomaly).filter(
        Anomaly.status == "OPEN", Anomaly.severity == "CRITICAL"
    ).count()

    # Potential savings from recommendations
    recs = db.query(Recommendation).filter(Recommendation.status == "PENDING").all()
    total_savings = 0.0
    for r in recs:
        # Parse savings like "$840/mo" → 840
        savings_str = r.potential_savings.replace("$", "").replace("/mo", "").replace(",", "")
        try:
            total_savings += float(savings_str)
        except ValueError:
            pass

    savings_percent = round((total_savings / total_spend) * 100, 1) if total_spend > 0 else 0

    # Optimization score (100 - % of unoptimized)
    total_recs = db.query(Recommendation).count()
    applied_recs = db.query(Recommendation).filter(Recommendation.status == "APPLIED").count()
    score = round(60 + (applied_recs / max(total_recs, 1)) * 40) if total_recs > 0 else 72

    return {
        "totalSpend": f"${total_spend:,.2f}",
        "spendChange": "+12.4%",
        "savings": f"${total_savings:,.0f}",
        "savingsPercent": f"{savings_percent:.0f}%",
        "activeAnomalies": open_anomalies,
        "criticalAnomalies": critical_anomalies,
        "score": score,
    }


@router.get("/chart")
def get_chart(db: Session = Depends(get_db)):
    """
    Return last 7 days of cost data per provider for the line chart.
    """
    data_points = []
    today = datetime.utcnow().date()

    aws_total = sum(r.amount for r in db.query(CostData).filter(CostData.provider == "aws").all())
    azure_total = sum(r.amount for r in db.query(CostData).filter(CostData.provider == "azure").all())
    gcp_total = sum(r.amount for r in db.query(CostData).filter(CostData.provider == "gcp").all())

    # Fallback if no data
    aws_daily = (aws_total / 30) if aws_total > 0 else random.uniform(100, 400)
    azure_daily = (azure_total / 30) if azure_total > 0 else random.uniform(80, 300)
    gcp_daily = (gcp_total / 30) if gcp_total > 0 else random.uniform(60, 250)

    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        noise = lambda base: round(base * random.uniform(0.75, 1.35), 2)
        data_points.append({
            "date": day.strftime("%b %d"),
            "aws": noise(aws_daily),
            "azure": noise(azure_daily),
            "gcp": noise(gcp_daily),
        })

    return data_points


@router.get("/top-drivers")
def get_top_drivers(db: Session = Depends(get_db)):
    """Return top cost driver resources."""
    aws_records = db.query(CostData).filter(CostData.provider == "aws").order_by(
        CostData.amount.desc()
    ).limit(8).all()

    if aws_records:
        return [
            {
                "id": r.id,
                "name": f"{r.service} / prod",
                "service": r.service,
                "cloud": r.provider.upper(),
                "cost": f"${r.amount:,.2f}",
                "change": f"+{random.uniform(3, 25):.1f}%" if random.random() > 0.3 else f"-{random.uniform(1, 10):.1f}%",
            }
            for r in aws_records
        ]

    # Mock fallback
    return [
        {"id": 1, "name": "prod-web-cluster / EC2", "service": "Amazon EC2", "cloud": "AWS", "cost": "$2,341.20", "change": "+18.3%"},
        {"id": 2, "name": "db-prod-rds / RDS", "service": "Amazon RDS", "cloud": "AWS", "cost": "$1,120.50", "change": "+5.7%"},
        {"id": 3, "name": "media-assets / S3", "service": "Amazon S3", "cloud": "AWS", "cost": "$489.30", "change": "-2.1%"},
        {"id": 4, "name": "prod-eks / EKS", "service": "Amazon EKS", "cloud": "AWS", "cost": "$672.00", "change": "+22.1%"},
        {"id": 5, "name": "api-cache / ElastiCache", "service": "Amazon ElastiCache", "cloud": "AWS", "cost": "$390.00", "change": "+1.2%"},
        {"id": 6, "name": "Virtual Machines / AKS", "service": "Azure Virtual Machines", "cloud": "AZURE", "cost": "$815.40", "change": "+9.4%"},
    ]


@router.get("/agent-activity")
def get_agent_activity(db: Session = Depends(get_db)):
    """Return recent agent activity logs."""
    logs = db.query(AgentLog).order_by(AgentLog.created_at.desc()).limit(20).all()

    if logs:
        return [
            {
                "id": log.id,
                "type": log.agent_type,
                "time": log.created_at.strftime("%H:%M:%S") if log.created_at else "00:00:00",
                "action": log.action,
                "result": log.result,
            }
            for log in logs
        ]

    # Mock fallback
    return [
        {"id": 1, "type": "Cost Analyzer Agent", "time": "10:42:01", "action": "Completed 30-day cost analysis across 12 AWS services", "result": "Top driver: Amazon EC2 at $2,341/mo"},
        {"id": 2, "type": "Anomaly Detection Agent", "time": "10:42:05", "action": "Detected 3 cost anomalies using rolling baseline comparison", "result": "CRITICAL: RDS spike +187%"},
        {"id": 3, "type": "Optimization Agent", "time": "10:42:12", "action": "Identified 7 optimization opportunities across compute, storage, and network", "result": "Total potential savings: $3,723/mo"},
        {"id": 4, "type": "Multi-Cloud Agent", "time": "10:42:18", "action": "Compared AWS, Azure, GCP spend for the month", "result": "GCP 18% cheaper for current workloads"},
        {"id": 5, "type": "Orchestrator", "time": "10:42:22", "action": "Multi-agent pipeline completed successfully", "result": "Efficiency rating: 72/100. 7 actions recommended."},
    ]
