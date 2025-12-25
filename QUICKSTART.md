# Quick Start Guide

Get your LLM onboarding assistant running in 5 minutes!

## Prerequisites Check

```bash
# Check Python version (needs 3.9-3.12)
# ⚠️ IMPORTANT: Python 3.13+ is NOT supported (ChromaDB limitation)
# Note: On macOS with Homebrew, use 'python3' instead of 'python'
python3 --version

# If you have Python 3.14, install Python 3.12:
# brew install python@3.12
# Then use: python3.12 instead of python3

# Check Node.js version (needs 18+)
node --version

# Get Google API key for Gemini from https://makersuite.google.com/app/apikey
```

## Setup (5 Steps)

### 1. Backend Setup

```bash
cd server

# ⚠️ If you have Python 3.14, install Python 3.12 first:
# brew install python@3.12
# Then use python3.12 instead of python3 below

# Create virtual environment
python3 -m venv venv
# Or if using Python 3.12: python3.12 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

### 2. Start Backend

```bash
# Make sure virtual environment is activated
source venv/bin/activate  # If not already activated

python main.py
# Should see: "✅ RAG pipeline initialized successfully"
# API running at http://localhost:8000
```

### 3. Frontend Setup (New Terminal)

```bash
cd client
npm install
npm run dev
# Frontend running at http://localhost:5173
```

### 4. Upload Your First Document

```bash
# In another terminal or use the Swagger UI at http://localhost:8000/docs
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@your-document.pdf" \
  -F "category=dev_setup"
```

### 5. Test It!

1. Open http://localhost:5173
2. Click "The Oracle" in the sidebar
3. Ask: "How do I install Homebrew?" (or any question from your docs)

## Document Categories

When uploading, use these categories:
- `supply_chain` - Supply chain domain docs
- `company_culture` - Company culture docs  
- `teams` - Team/member info
- `dev_setup` - Developer setup guides
- `general` - Other docs

## Troubleshooting

**Backend won't start?**
- Check Google API key (GOOGLE_API_KEY) in `.env`
- Check port 8000 is free: `lsof -i :8000`

**Frontend can't connect?**
- Verify backend is running: `curl http://localhost:8000/health`
- Check browser console for errors

**No answers?**
- Upload documents first!
- Check stats: `curl http://localhost:8000/api/documents/stats`

## Next Steps

See `SETUP_GUIDE.md` for detailed documentation and advanced configuration.

