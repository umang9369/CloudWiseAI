import os

# 1. Define folder structure
folders = ['core', 'agents', 'routers']
for f in folders:
    os.makedirs(f, exist_ok=True)
    with open(f"{f}/__init__.py", "w") as init_file:
        init_file.write("")

# 2. Define file moves
file_moves = {
    'database.py': 'core/database.py',
    'llm_client.py': 'core/llm_client.py',
    'vectorstore.py': 'core/vectorstore.py',
    'orchestrator.py': 'agents/orchestrator.py',
    'agent_anomaly.py': 'agents/anomaly.py',
    'agent_cost_analyzer.py': 'agents/cost_analyzer.py',
    'agent_multicloud.py': 'agents/multicloud.py',
    'agent_optimization.py': 'agents/optimization.py',
    'router_agents.py': 'routers/agents.py',
    'router_anomalies.py': 'routers/anomalies.py',
    'router_auth.py': 'routers/auth.py',
    'router_dashboard.py': 'routers/dashboard.py',
    'router_query.py': 'routers/query.py',
    'router_recommendations.py': 'routers/recommendations.py',
}

# 3. Define import replacements
replacements = {
    "from database import": "from core.database import",
    "import database": "import core.database as database",
    "from llm_client import": "from core.llm_client import",
    "import llm_client": "import core.llm_client as llm_client",
    "from vectorstore import": "from core.vectorstore import",
    "import vectorstore": "import core.vectorstore as vectorstore",
    "from orchestrator import": "from agents.orchestrator import",
    "import orchestrator": "import agents.orchestrator as orchestrator",
    "from agent_anomaly import": "from agents.anomaly import",
    "from agent_cost_analyzer import": "from agents.cost_analyzer import",
    "from agent_multicloud import": "from agents.multicloud import",
    "from agent_optimization import": "from agents.optimization import",
    "import router_agents": "from routers import agents as router_agents",
    "import router_anomalies": "from routers import anomalies as router_anomalies",
    "import router_auth": "from routers import auth as router_auth",
    "import router_dashboard": "from routers import dashboard as router_dashboard",
    "import router_query": "from routers import query as router_query",
    "import router_recommendations": "from routers import recommendations as router_recommendations",
}

# 4. Process files
def process_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # apply replacements
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Process all python files in root (and the ones mapped)
py_files = [f for f in os.listdir('.') if f.endswith('.py') and f != 'refactor.py']
for pf in py_files:
    process_file(pf)

# 5. Move files
for src, dest in file_moves.items():
    if os.path.exists(src):
        os.rename(src, dest)
        process_file(dest) # just in case of any stragglers, but already processed in root

print("Refactoring complete.")
