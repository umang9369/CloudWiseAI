import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
_client = None


def get_groq_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=GROQ_API_KEY)
    return _client


def chat_completion(messages: list[dict], model: str = "llama-3.3-70b-versatile", max_tokens: int = 1024) -> str:
    """Call Groq LLM and return the assistant response text."""
    client = get_groq_client()
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=0.3,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"[GROQ ERROR] {e}")
        return f"I'm having trouble connecting to the AI service. Please try again. Error: {str(e)}"


def analyze_cloud_data(context: str, query: str) -> str:
    """
    RAG-powered analysis: use retrieved context + user query to produce insightful answer.
    """
    system_prompt = """You are CloudWise AI, an expert cloud cost optimization assistant.
You analyze AWS, Azure, and GCP cloud infrastructure costs, detect anomalies, and suggest optimizations.
Respond in a clear, concise, professional manner. Use bullet points where appropriate.
When you reference cost data, be specific with numbers.
"""
    messages = [
        {"role": "system", "content": system_prompt},
        {
            "role": "user",
            "content": f"""Based on the following cloud cost data context, answer the user's question.

=== CLOUD DATA CONTEXT ===
{context if context else "No specific cloud data has been ingested yet. Provide general cloud optimization advice."}
=========================

User Question: {query}"""
        }
    ]
    return chat_completion(messages)


def generate_agent_summary(agent_name: str, findings: list[str]) -> str:
    """Let Groq summarize agent findings into a readable insight."""
    findings_text = "\n".join(f"- {f}" for f in findings) if findings else "- No significant findings"
    messages = [
        {"role": "system", "content": "You are a cloud cost optimization AI agent. Summarize findings concisely in 1-2 sentences."},
        {"role": "user", "content": f"Agent: {agent_name}\nFindings:\n{findings_text}\n\nProvide a brief, actionable summary."}
    ]
    return chat_completion(messages, max_tokens=200)
