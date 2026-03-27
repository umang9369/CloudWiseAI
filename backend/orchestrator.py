"""
Agent Orchestrator
- Coordinates all 4 agents: Cost Analyzer, Anomaly, Optimization, Multi-Cloud
- Each agent retrieves context (RAG), reasons independently, collaborates for final output
- Returns unified analysis summary
"""
from sqlalchemy.orm import Session
from database import AgentLog, CloudConnection
from agent_cost_analyzer import run_cost_analyzer
from agent_anomaly import run_anomaly_agent
from agent_optimization import run_optimization_agent
from agent_multicloud import run_multicloud_agent
from llm_client import generate_agent_summary
import asyncio
from datetime import datetime


def run_all_agents(db: Session) -> dict:
    """
    Orchestrate all agents sequentially:
    1. Cost Analyzer → finds expensive services (populates ChromaDB + DB)
    2. Anomaly Agent → detects spikes (uses DB data from step 1)
    3. Optimization Agent → suggests fixes (uses DB data)
    4. Multi-Cloud Agent → compares providers (uses DB data)
    5. Final AI synthesis via Groq
    """
    print("[ORCHESTRATOR] Starting multi-agent pipeline...")
    results = {}
    
    # Get cloud connection if any
    connection = db.query(CloudConnection).filter(
        CloudConnection.status == "connected"
    ).first()

    # Phase 1: Cost Analyzer
    print("[ORCHESTRATOR] Running Cost Analyzer Agent...")
    try:
        cost_result = run_cost_analyzer(db, connection)
        results["cost_analyzer"] = cost_result
        print(f"[ORCHESTRATOR] Cost Analyzer: {cost_result['records']} records")
    except Exception as e:
        print(f"[ORCHESTRATOR] Cost Analyzer error: {e}")
        results["cost_analyzer"] = {"agent": "Cost Analyzer Agent", "error": str(e)}

    # Phase 2: Anomaly Detection
    print("[ORCHESTRATOR] Running Anomaly Detection Agent...")
    try:
        anomaly_result = run_anomaly_agent(db, connection)
        results["anomaly"] = anomaly_result
        print(f"[ORCHESTRATOR] Anomaly Agent: {anomaly_result['new_anomalies']} anomalies")
    except Exception as e:
        print(f"[ORCHESTRATOR] Anomaly Agent error: {e}")
        results["anomaly"] = {"agent": "Anomaly Detection Agent", "error": str(e)}

    # Phase 3: Optimization
    print("[ORCHESTRATOR] Running Optimization Agent...")
    try:
        opt_result = run_optimization_agent(db, connection)
        results["optimization"] = opt_result
        print(f"[ORCHESTRATOR] Optimization Agent: {opt_result['new_recommendations']} recommendations")
    except Exception as e:
        print(f"[ORCHESTRATOR] Optimization Agent error: {e}")
        results["optimization"] = {"agent": "Optimization Agent", "error": str(e)}

    # Phase 4: Multi-Cloud Comparison
    print("[ORCHESTRATOR] Running Multi-Cloud Agent...")
    try:
        mc_result = run_multicloud_agent(db, connection)
        results["multicloud"] = mc_result
        print(f"[ORCHESTRATOR] Multi-Cloud Agent: ${mc_result['total_multicloud']:,.2f} total")
    except Exception as e:
        print(f"[ORCHESTRATOR] Multi-Cloud Agent error: {e}")
        results["multicloud"] = {"agent": "Multi-Cloud Agent", "error": str(e)}

    # Phase 5: AI Synthesis (Groq)
    print("[ORCHESTRATOR] Generating AI synthesis with Groq...")
    try:
        all_findings = []
        for key, result in results.items():
            findings = result.get("findings", [])
            if findings:
                all_findings.extend(findings[:3])

        ai_summary = generate_agent_summary("CloudWise Multi-Agent System", all_findings)
        results["ai_summary"] = ai_summary
    except Exception as e:
        results["ai_summary"] = "Multi-agent analysis complete. Review individual agent findings for details."

    # Log orchestration
    db.add(AgentLog(
        agent_type="Orchestrator",
        action="Completed full multi-agent pipeline: Cost Analyzer → Anomaly → Optimization → Multi-Cloud",
        result=results.get("ai_summary", "Analysis complete")
    ))
    db.commit()

    print("[ORCHESTRATOR] Pipeline complete!")
    return results
