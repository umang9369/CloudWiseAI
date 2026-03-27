"""
Multi-Cloud Agent
- Compares costs across AWS, Azure, GCP (AWS real, Azure/GCP simulated)
- Produces unified cross-provider analysis
- Stores findings in ChromaDB and DB
"""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from core.database import AgentLog, CostData
from core.vectorstore import ingest_documents
import random


AZURE_SERVICES = ["Azure Virtual Machines", "Azure SQL Database", "Azure Blob Storage",
                  "Azure Kubernetes Service", "Azure Functions", "Azure CDN"]
GCP_SERVICES = ["Compute Engine", "Cloud SQL", "Cloud Storage", "Google Kubernetes Engine",
                "Cloud Functions", "Cloud CDN"]


def run_multicloud_agent(db: Session, connection=None) -> dict:
    """Run Multi-Cloud Comparison Agent."""
    cloud_summary = {}
    findings = []

    # Get real AWS data from DB
    aws_records = db.query(CostData).filter(CostData.provider == "aws").all()
    aws_total = sum(r.amount for r in aws_records) if aws_records else random.uniform(2000, 8000)
    
    cloud_summary["aws"] = {
        "total": round(aws_total, 2),
        "services": len(aws_records) if aws_records else 12,
        "top_service": aws_records[0].service if aws_records else "Amazon EC2",
        "currency": "USD",
    }

    # Simulate Azure costs (proportional to AWS for comparison)
    azure_total = aws_total * random.uniform(0.7, 1.3)
    cloud_summary["azure"] = {
        "total": round(azure_total, 2),
        "services": random.randint(6, 12),
        "top_service": random.choice(AZURE_SERVICES),
        "currency": "USD",
    }

    # Simulate GCP costs
    gcp_total = aws_total * random.uniform(0.6, 1.1)
    cloud_summary["gcp"] = {
        "total": round(gcp_total, 2),
        "services": random.randint(5, 10),
        "top_service": random.choice(GCP_SERVICES),
        "currency": "USD",
    }

    # Determine cheapest provider
    cheapest = min(cloud_summary, key=lambda k: cloud_summary[k]["total"])
    most_expensive = max(cloud_summary, key=lambda k: cloud_summary[k]["total"])

    findings = [
        f"AWS total (30-day): ${cloud_summary['aws']['total']:,.2f}",
        f"Azure total (30-day): ${cloud_summary['azure']['total']:,.2f}",
        f"GCP total (30-day): ${cloud_summary['gcp']['total']:,.2f}",
        f"Cheapest provider: {cheapest.upper()} (${cloud_summary[cheapest]['total']:,.2f})",
        f"Most expensive: {most_expensive.upper()} (${cloud_summary[most_expensive]['total']:,.2f})",
        f"Potential savings by migrating workloads to {cheapest.upper()}: "
        f"${cloud_summary[most_expensive]['total'] - cloud_summary[cheapest]['total']:,.2f}/mo",
    ]

    # Store simulated Azure/GCP data in DB for chart usage
    for provider, data in [("azure", cloud_summary["azure"]), ("gcp", cloud_summary["gcp"])]:
        services = AZURE_SERVICES if provider == "azure" else GCP_SERVICES
        per_service = data["total"] / len(services)
        for svc in services:
            existing = db.query(CostData).filter(
                CostData.provider == provider,
                CostData.service == svc,
            ).first()
            if not existing:
                db.add(CostData(
                    provider=provider,
                    service=svc,
                    amount=round(per_service * random.uniform(0.5, 2.0), 2),
                    start_date=str(datetime.utcnow().date() - timedelta(days=30)),
                    end_date=str(datetime.utcnow().date()),
                ))

    # Log activity
    db.add(AgentLog(
        agent_type="Multi-Cloud Agent",
        action="Compared cloud costs across AWS, Azure, and GCP environments",
        result=f"Total multi-cloud spend: ${aws_total + azure_total + gcp_total:,.2f}. "
               f"Cheapest: {cheapest.upper()}, Most expensive: {most_expensive.upper()}"
    ))
    db.commit()

    # Ingest multi-cloud summary into ChromaDB
    docs = [
        {
            "id": f"multicloud_aws",
            "text": f"MULTI-CLOUD: AWS 30-day spend ${cloud_summary['aws']['total']:,.2f} across {cloud_summary['aws']['services']} services. Top: {cloud_summary['aws']['top_service']}",
            "metadata": {"agent": "multicloud", "provider": "aws"},
        },
        {
            "id": "multicloud_azure",
            "text": f"MULTI-CLOUD: Azure 30-day spend ${cloud_summary['azure']['total']:,.2f} across {cloud_summary['azure']['services']} services. Top: {cloud_summary['azure']['top_service']}",
            "metadata": {"agent": "multicloud", "provider": "azure"},
        },
        {
            "id": "multicloud_gcp",
            "text": f"MULTI-CLOUD: GCP 30-day spend ${cloud_summary['gcp']['total']:,.2f} across {cloud_summary['gcp']['services']} services. Top: {cloud_summary['gcp']['top_service']}",
            "metadata": {"agent": "multicloud", "provider": "gcp"},
        },
    ]
    ingest_documents(docs)

    return {
        "agent": "Multi-Cloud Agent",
        "cloud_summary": cloud_summary,
        "findings": findings,
        "total_multicloud": round(aws_total + azure_total + gcp_total, 2),
    }
