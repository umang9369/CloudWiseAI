"""
Cost Analyzer Agent
- Retrieves cost data from AWS Cost Explorer (or generates mock data if no credentials)
- Identifies top expensive services
- Embeds findings into ChromaDB
- Stores results in PostgreSQL
"""
import boto3
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from core.database import AgentLog, CostData, Recommendation
from core.vectorstore import ingest_documents
import json
import random


def run_cost_analyzer(db: Session, connection=None) -> dict:
    """
    Run the Cost Analyzer Agent.
    Returns a dict with findings and summary.
    """
    findings = []
    cost_records = []
    recommendations = []

    if connection:
        # Real AWS Cost Explorer
        try:
            client = boto3.client(
                "ce",
                aws_access_key_id=connection.access_key_id,
                aws_secret_access_key=connection.secret_access_key,
                region_name=connection.region,
            )
            end = datetime.utcnow().date()
            start = end - timedelta(days=30)

            response = client.get_cost_and_usage(
                TimePeriod={"Start": str(start), "End": str(end)},
                Granularity="MONTHLY",
                Metrics=["UnblendedCost"],
                GroupBy=[{"Type": "DIMENSION", "Key": "SERVICE"}],
            )

            results_by_time = response.get("ResultsByTime", [])
            for period in results_by_time:
                for group in period.get("Groups", []):
                    service = group["Keys"][0]
                    amount = float(group["Metrics"]["UnblendedCost"]["Amount"])
                    if amount > 0:
                        cost_records.append({
                            "service": service,
                            "amount": amount,
                            "start": period["TimePeriod"]["Start"],
                            "end": period["TimePeriod"]["End"],
                        })

            cost_records.sort(key=lambda x: x["amount"], reverse=True)
            findings = [
                f"{r['service']}: ${r['amount']:.2f} USD (30-day)"
                for r in cost_records[:10]
            ]

        except Exception as e:
            print(f"[COST_ANALYZER] AWS error: {e}, checking for seeded data")
            cost_records = _get_seeded_or_mock_data(db)
            findings = [f"{r['service']}: ${r['amount']:.2f} USD (30-day)" for r in cost_records[:10]]
    else:
        cost_records = _get_seeded_or_mock_data(db)
        findings = [f"{r['service']}: ${r['amount']:.2f} USD (30-day)" for r in cost_records[:10]]

    # Store in DB
    for r in cost_records:
        existing = db.query(CostData).filter(
            CostData.service == r["service"],
            CostData.start_date == r.get("start", "")
        ).first()
        if not existing:
            db.add(CostData(
                provider="aws",
                service=r["service"],
                amount=r["amount"],
                start_date=r.get("start", str(datetime.utcnow().date() - timedelta(days=30))),
                end_date=r.get("end", str(datetime.utcnow().date())),
                raw_data=r,
            ))

    # Add recommendations for top expensive services
    top_services = cost_records[:3]
    for svc in top_services:
        existing_rec = db.query(Recommendation).filter(
            Recommendation.title.like(f"%{svc['service']}%")
        ).first()
        if not existing_rec:
            savings = round(svc["amount"] * 0.25, 2)
            rec = Recommendation(
                title=f"Optimize {svc['service']} costs",
                description=f"{svc['service']} is your top cost driver at ${svc['amount']:.2f}/month. "
                            f"Consider rightsizing, reserved instances, or spot instances to reduce spend.",
                potential_savings=f"${savings:.0f}/mo",
                difficulty="Easy" if svc["amount"] < 500 else "Medium",
                status="PENDING",
                category="cost_reduction",
            )
            db.add(rec)
            recommendations.append(rec.title)

    # Log agent activity
    db.add(AgentLog(
        agent_type="Cost Analyzer Agent",
        action=f"Analyzed 30-day cloud costs across {len(cost_records)} services",
        result=f"Top service: {cost_records[0]['service']} at ${cost_records[0]['amount']:.2f}" if cost_records else "No data"
    ))
    db.commit()

    # Ingest into ChromaDB for RAG
    docs = []
    for r in cost_records:
        raw_data = r.get("raw_data", {})
        company_name = raw_data.get("company", "Unknown") if isinstance(raw_data, dict) else "Unknown"
        industry = raw_data.get("industry", "Unknown") if isinstance(raw_data, dict) else "Unknown"
        data_source = raw_data.get("source", "mock") if isinstance(raw_data, dict) else "mock"
        
        text = (f"AWS Service: {r['service']} | Cost: ${r['amount']:.2f} USD | "
                f"Source: {data_source} | Company Profile: {company_name} | Industry: {industry}")
                
        metadata = {
            "agent": "cost_analyzer", 
            "service": r["service"], 
            "amount": r["amount"],
            "data_source": data_source,
            "company": company_name
        }
        
        docs.append({
            "id": f"cost_{r['service'].replace(' ', '_').replace('/', '_')}",
            "text": text,
            "metadata": metadata,
        })
        
    ingest_documents(docs)

    return {"agent": "Cost Analyzer Agent", "findings": findings, "records": len(cost_records)}


def _get_seeded_or_mock_data(db: Session) -> list[dict]:
    """Return realistic seeded data if available, else fallback to mock."""
    seeded_records = db.query(CostData).all()
    kaggle_seeded = [s for s in seeded_records if s.raw_data and isinstance(s.raw_data, dict) and s.raw_data.get("source") == "kaggle_cloud_dataset"]
    
    if kaggle_seeded:
        print("[COST_ANALYZER] Using certified Kaggle seeded data.")
        return [
            {
                "service": s.service,
                "amount": s.amount,
                "start": s.start_date,
                "end": s.end_date,
                "raw_data": s.raw_data
            }
            for s in sorted(kaggle_seeded, key=lambda x: x.amount, reverse=True)
        ]
        
    print("[COST_ANALYZER] Using random mock data.")
    return _generate_mock_cost_data()


def _generate_mock_cost_data() -> list[dict]:
    """Generate realistic mock AWS cost data."""
    services = [
        ("Amazon EC2", random.uniform(800, 2500)),
        ("Amazon RDS", random.uniform(400, 1200)),
        ("Amazon S3", random.uniform(200, 600)),
        ("AWS Lambda", random.uniform(50, 300)),
        ("Amazon CloudFront", random.uniform(100, 400)),
        ("Amazon EKS", random.uniform(300, 900)),
        ("AWS Data Transfer", random.uniform(150, 500)),
        ("Amazon DynamoDB", random.uniform(80, 250)),
        ("Amazon ElastiCache", random.uniform(200, 600)),
        ("Amazon Route 53", random.uniform(20, 80)),
        ("AWS WAF", random.uniform(30, 100)),
        ("Amazon SES", random.uniform(10, 50)),
    ]
    start = str(datetime.utcnow().date() - timedelta(days=30))
    end = str(datetime.utcnow().date())
    return [
        {"service": s, "amount": round(a, 2), "start": start, "end": end}
        for s, a in sorted(services, key=lambda x: x[1], reverse=True)
    ]
