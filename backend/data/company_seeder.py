import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import cast, String
from core.database import CostData, CloudConnection
from datetime import datetime, timedelta
import os

# Get absolute path to the data folder so it works from anywhere
DATA_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(DATA_DIR, "cloud_company_profiles.csv")

try:
    COMPANY_DATASET = pd.read_csv(CSV_PATH)
except Exception as e:
    print(f"[COMPANY_SEEDER] Could not load dataset at {CSV_PATH}: {e}")
    COMPANY_DATASET = None

def seed_company_data(db: Session, account_id: str, company_name: str = None) -> dict:
    """
    On company authorization, find their cloud profile in the dataset
    and seed realistic cost data into the DB.
    Returns a dict with company_name and industry.
    """
    if COMPANY_DATASET is None or COMPANY_DATASET.empty:
        return {"company_name": company_name or "Demo Corp", "industry": "Technology"}

    # Match by account_id or company name
    match = pd.DataFrame()
    if account_id:
        match = COMPANY_DATASET[COMPANY_DATASET['account_id'] == account_id]
        
    if match.empty and company_name:
        match = COMPANY_DATASET[COMPANY_DATASET['company_name'].str.contains(company_name, case=False, na=False)]
    
    if match.empty:
        # Pick a random realistic company profile
        match = COMPANY_DATASET.sample(1)
    
    row = match.iloc[0]
    
    # Map dataset columns to your CostData model
    services_map = {
        'ec2_spend': 'Amazon EC2',
        'rds_spend': 'Amazon RDS',
        's3_spend': 'Amazon S3',
        'lambda_spend': 'AWS Lambda',
        'eks_spend': 'Amazon EKS',
        'cloudfront_spend': 'Amazon CloudFront',
    }
    
    end = datetime.utcnow().date()
    start = end - timedelta(days=30)
    
    # Check if we already seeded for this account to avoid duplicates on reconnect
    existing_count = db.query(CostData).filter(
        cast(CostData.raw_data, String).like(f"%{row['company_name']}%")
    ).count()

    if existing_count == 0:
        for col, service_name in services_map.items():
            if col in row and pd.notna(row[col]):
                db.add(CostData(
                    provider="aws",
                    service=service_name,
                    amount=float(row[col]),
                    start_date=str(start),
                    end_date=str(end),
                    raw_data={
                        "source": "kaggle_cloud_dataset",
                        "company": row.get('company_name', 'Unknown'),
                        "industry": row.get('industry', 'Technology'),
                        "employees": int(row.get('employees', 0)),
                        "total_spend": float(row.get('total_monthly_spend', 0))
                    }
                ))
        db.commit()

    return {
        "company_name": row.get('company_name', 'Demo Corp'),
        "industry": row.get('industry', 'Technology')
    }
