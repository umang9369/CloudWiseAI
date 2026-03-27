"""
Query Router - RAG-powered natural language queries using Groq + ChromaDB
GET  /api/query/history
POST /api/query/ask
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from core.database import get_db, ChatHistory
from core.vectorstore import query_vectorstore
from core.llm_client import analyze_cloud_data
from datetime import datetime

router = APIRouter(prefix="/api/query", tags=["query"])


class AskRequest(BaseModel):
    text: str


@router.get("/history")
def get_history(db: Session = Depends(get_db)):
    """Return chat history from DB."""
    # Seed with welcome message if empty
    count = db.query(ChatHistory).count()
    if count == 0:
        welcome = ChatHistory(
            role="ai",
            text="Hello! I'm CloudWise AI, your cloud cost optimization assistant. "
                 "I have access to your full cloud cost data, anomaly reports, and optimization recommendations. "
                 "Ask me anything — like 'What is my top cost driver?' or 'Where can I save money?'",
        )
        db.add(welcome)
        db.commit()

    messages = db.query(ChatHistory).order_by(ChatHistory.created_at.asc()).all()
    return [
        {
            "id": m.id,
            "role": m.role,
            "text": m.text,
            "time": m.created_at.isoformat() if m.created_at else datetime.utcnow().isoformat(),
        }
        for m in messages
    ]


@router.post("/ask")
def ask_query(request: AskRequest, db: Session = Depends(get_db)):
    """
    RAG Pipeline:
    1. Store user message
    2. Retrieve relevant context from ChromaDB
    3. Call Groq LLM with context + question
    4. Store and return AI response
    """
    # Store user message
    user_msg = ChatHistory(role="user", text=request.text)
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    # Retrieve context from ChromaDB
    context_docs = query_vectorstore(request.text, n_results=5)
    context = "\n".join(context_docs) if context_docs else ""

    # Call Groq LLM
    ai_response_text = analyze_cloud_data(context=context, query=request.text)

    # Store AI response
    ai_msg = ChatHistory(role="ai", text=ai_response_text)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return {
        "message": {
            "id": ai_msg.id,
            "role": "ai",
            "text": ai_response_text,
            "time": ai_msg.created_at.isoformat() if ai_msg.created_at else datetime.utcnow().isoformat(),
        }
    }
