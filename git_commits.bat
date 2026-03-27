@echo off
echo Initializing Git repository...
git init

echo Adding Documentation...
git add README.md PROJECT_REPORT.md .gitignore
git commit -m "docs: Initialize project documentation and main gitignore"

echo Adding Frontend Configuration...
git add frontend/package.json frontend/vite.config.ts frontend/tsconfig.* frontend/index.html frontend/tailwind.config.js frontend/postcss.config.js frontend/eslint.config.js 
git commit -m "chore(frontend): Setup Vite React TypeScript configuration"

echo Adding Frontend Core...
git add frontend/src/main.tsx frontend/src/App.tsx frontend/src/index.css frontend/src/vite-env.d.ts frontend/public/
git commit -m "feat(frontend): Add core application entrypoint and global styles"

echo Adding Frontend Components...
git add frontend/src/components/
git commit -m "feat(frontend): Implementation of application UI components"

echo Adding Frontend Pages...
git add frontend/src/pages/
git commit -m "feat(frontend): Construct dashboard, simulation, and feature pages"

echo Adding Backend Setup...
git add backend/requirements.txt backend/.env backend/start_backend.bat
git commit -m "chore(backend): Add Python environment, dependencies, and startup scripts"

echo Adding Backend Core Services...
git add backend/core/
git commit -m "feat(backend): Add database, ChromaDB vector store, and Groq LLM integration"

echo Adding Backend AI Agents...
git add backend/agents/
git commit -m "feat(backend): Implement 4-tier AI agents and system orchestrator"

echo Adding Backend API Routers...
git add backend/routers/
git commit -m "feat(backend): Add FastAPI endpoint routers for modular access"

echo Adding Backend Entrypoint...
git add backend/main.py
git commit -m "feat(backend): Add comprehensive main.py entrypoint with startup sequences"

echo Committing any remaining files...
git add .
git commit -m "chore: Finalize file structures and repository synchronization"

echo =======================================================
echo All granular commits created successfully!
echo You can view your commit history using: git log --oneline
echo.
echo To push this to GitHub, add your remote repository URL:
echo   git remote add origin https://github.com/yourusername/repo.git
echo   git branch -M main
echo   git push -u origin main
echo =======================================================
