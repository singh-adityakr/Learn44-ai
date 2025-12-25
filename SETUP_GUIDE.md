# Learn44 AI Onboarding Assistant - Setup Guide

This guide will help you set up and run the complete LLM assistant/chatbot system for onboarding new hires.

## Architecture Overview

The system consists of:
1. **Frontend** (React + TypeScript + Vite) - Chat interface
2. **Backend** (FastAPI + Python) - RAG-powered API
3. **Vector Database** (ChromaDB) - Stores document embeddings
4. **LLM** (Google Gemini) - Generates responses based on retrieved context
5. **Embeddings** (Google Gemini or OpenAI) - Creates vector embeddings for documents

## Prerequisites

- **Python 3.9-3.12** installed (⚠️ Python 3.13+ is NOT supported due to ChromaDB limitations)
- Node.js 18+ and npm installed
- Google API key for Gemini ([Get one here](https://makersuite.google.com/app/apikey))
- Your documents ready (PDF, DOCX, TXT, MD files)

**Note:** If you have Python 3.14 installed, you'll need to install Python 3.12:
```bash
brew install python@3.12
# Then use python3.12 instead of python3
```

## Step-by-Step Setup

### 1. Backend Setup

#### Create Virtual Environment

Create a virtual environment:

```bash
cd server

# If you have Python 3.14, use Python 3.12 instead:
# python3.12 -m venv venv
# Otherwise:
python3 -m venv venv
```

#### Activate Virtual Environment

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

#### Install Python Dependencies

```bash
# Make sure virtual environment is activated first
pip install -r requirements.txt
```

**Note:** 
- On macOS with Homebrew, use `python3` instead of `python`
- Always activate the virtual environment before running the server: `source venv/bin/activate`

#### Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` and add your Google API key:

```env
GOOGLE_API_KEY=your-google-api-key-here
GEMINI_MODEL=gemini-1.5-flash
EMBEDDING_MODEL=models/embedding-001
```

**Note:** If you prefer to use OpenAI embeddings instead of Gemini embeddings, you can set:
```env
USE_OPENAI_EMBEDDINGS=true
OPENAI_API_KEY=sk-your-openai-key-here
```

#### Start the Backend Server

**Important:** Make sure your virtual environment is activated first!

```bash
# Activate virtual environment (if not already active)
source venv/bin/activate

# Run the server
python main.py
# Or: python -m uvicorn main:app --reload --port 8000
```

You should see `(venv)` in your terminal prompt when the virtual environment is active.

The API will be available at `http://localhost:8000`
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### 2. Frontend Setup

#### Install Dependencies

```bash
cd client
npm install
```

#### Configure API URL (Optional)

If your backend runs on a different port, create a `.env` file in `client/`:

```env
VITE_API_URL=http://localhost:8000
```

#### Start the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Document Ingestion

You have three ways to ingest your documents:

#### Option A: Via API (Recommended for UI)

Use the Swagger UI at `http://localhost:8000/docs` or use curl:

```bash
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@path/to/your/document.pdf" \
  -F "category=dev_setup"
```

#### Option B: Bulk Upload via API

```bash
curl -X POST "http://localhost:8000/api/documents/batch-upload" \
  -F "files=@doc1.pdf" \
  -F "files=@doc2.docx" \
  -F "category=supply_chain"
```

#### Option C: Programmatic Ingestion Script

```bash
cd server
python ingest_documents.py /path/to/documents/ dev_setup
```

### 4. Document Categories

When uploading documents, use these categories:

- **`supply_chain`** - Supply chain domain knowledge corpus
- **`company_culture`** - Company culture and values documents
- **`teams`** - Team information and member presentations
- **`dev_setup`** - Developer environment setup guides (Homebrew, JDK, IntelliJ, Cursor, etc.)
- **`general`** - General documentation

Example:

```bash
# Upload supply chain documents
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@supply_chain_guide.pdf" \
  -F "category=supply_chain"

# Upload company culture presentation
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@company_culture.pptx" \
  -F "category=company_culture"

# Upload dev setup Confluence docs
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@dev_setup.md" \
  -F "category=dev_setup"
```

## Usage

### 1. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd server
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 2. Access the Application

Open `http://localhost:5173` in your browser and navigate to "The Oracle" (chat interface).

### 3. Ask Questions

The chatbot can now answer questions based on your ingested documents:

- "How do I install Homebrew?"
- "What is LTL in supply chain?"
- "Tell me about the company culture"
- "How do I set up IntelliJ?"
- "Who are the team members?"

## Project Structure

```
Learn44-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── chat-interface.tsx
│   │   └── ...
│   └── package.json
│
├── server/                 # FastAPI backend
│   ├── main.py            # FastAPI app entry point
│   ├── llm_rag/
│   │   ├── config.py      # Configuration
│   │   ├── document_processor.py  # Document ingestion
│   │   └── rag_pipeline.py # RAG query processing
│   ├── documents/         # Uploaded documents (gitignored)
│   ├── chroma_db/         # Vector database (gitignored)
│   └── requirements.txt
│
└── SETUP_GUIDE.md         # This file
```

## How It Works

1. **Document Ingestion**:
   - Documents are parsed (PDF, DOCX, TXT, MD)
   - Text is split into chunks (1000 chars with 200 char overlap)
   - Each chunk is embedded using OpenAI's embedding model
   - Embeddings are stored in ChromaDB vector database

2. **Query Processing**:
   - User asks a question
   - Question is embedded using Gemini (or OpenAI if configured)
   - Similar document chunks are retrieved from ChromaDB (top 5)
   - Retrieved context + question is sent to Google Gemini LLM
   - Gemini generates answer based on the context
   - Answer + sources are returned to user

3. **Conversation Memory**:
   - Each conversation maintains context
   - Previous messages are included in the prompt
   - Enables follow-up questions

## Troubleshooting

### Backend won't start

- Check if port 8000 is available: `lsof -i :8000`
- Verify Google API key is set correctly in `.env` (GOOGLE_API_KEY)
- Check Python version: `python3 --version` (needs 3.9+)
  - **macOS/Homebrew note:** Use `python3` instead of `python`
- If using OpenAI embeddings, verify OPENAI_API_KEY is set

### Frontend can't connect to backend

- Verify backend is running: `curl http://localhost:8000/health`
- Check CORS settings in `server/main.py`
- Verify `VITE_API_URL` in frontend `.env`

### Documents not being found

- Check document stats: `curl http://localhost:8000/api/documents/stats`
- Verify documents were uploaded successfully
- Check ChromaDB directory exists: `ls server/chroma_db/`

### Poor quality answers

- Ensure documents are properly formatted
- Try increasing `TOP_K_RETRIEVAL` in `.env` (default: 5)
- Check if relevant documents are in the knowledge base
- Verify document categories are set correctly

## Next Steps

1. **Add more documents** - The more context you provide, the better the answers
2. **Fine-tune retrieval** - Adjust `TOP_K_RETRIEVAL` and chunk sizes
3. **Add authentication** - Secure the API endpoints
4. **Deploy** - Deploy backend to cloud (AWS, GCP, Azure) and frontend to Vercel/Netlify
5. **Monitor** - Add logging and monitoring for production use

## API Reference

### Chat Endpoint

```bash
POST /api/chat
Content-Type: application/json

{
  "message": "How do I install Homebrew?",
  "conversation_id": "optional-conversation-id"
}
```

### Upload Document

```bash
POST /api/documents/upload
Content-Type: multipart/form-data

file: <file>
category: dev_setup
```

### Get Stats

```bash
GET /api/documents/stats
```

See full API documentation at `http://localhost:8000/docs` when the server is running.

## Support

For issues or questions:
1. Check the API docs at `/docs`
2. Review server logs for errors
3. Verify all environment variables are set correctly

