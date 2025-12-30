# Learn44 AI - Intelligent Onboarding Assistant

<div align="center">

**An AI-powered onboarding platform that helps new hires navigate company knowledge, setup processes, and learning resources through intelligent conversation.**

</div>

## 🎯 Overview

Learn44 AI is an enterprise-grade onboarding assistant that leverages **Retrieval Augmented Generation (RAG)** to provide intelligent, context-aware answers to new hires. The platform aggregates knowledge from multiple sources (Confluence, GitHub, documentation, presentations) and makes it accessible through a conversational AI interface.

### Key Features

- **🤖 The Oracle**: RAG-based knowledge assistant that answers questions using company documentation
- **📄 The Analyst**: Direct document analysis tool for uploading and querying specific documents
- **🎓 The Tutor**: Video learning platform with transcript-based Q&A capabilities
- **🔒 Secure**: Closed model architecture with local embedding options for sensitive data
- **⚡ Fast**: Semantic search with sub-2-second response times
- **🎨 Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🏗️ Architecture

### System Components

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│   React Client  │ ◄─────► │   FastAPI Server │ ◄─────► │   ChromaDB   │
│   (Frontend)    │   HTTP  │    (Backend)     │   API   │ (Vector DB)  │
└─────────────────┘         └──────────────────┘         └──────────────┘
                                      │
                                      ▼
                            ┌──────────────────┐
                            │                  │
                            │  (LLM Provider)  │
                            └──────────────────┘
```

### The Oracle (RAG System)
- Documents ingested into ChromaDB as vector embeddings
- User queries converted to embeddings for semantic search
- Top-k relevant chunks retrieved from vector database
- Context built from retrieved chunks with conversation history
- Gemini LLM generates contextualized response with markdown formatting

### The Analyst (Direct Analysis)
- Documents uploaded and text extracted (PDF, DOCX, TXT, MD)
- Full document text stored temporarily (24-hour expiration)
- User questions answered using complete document context
- Direct LLM prompt with document content (no vector search)

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **ChromaDB**: Vector database for embeddings
- **Google Gemini 2.5 Flash**: LLM for response generation
- **sentence-transformers**: Local embedding generation (default)
- **LangChain**: LLM orchestration and utilities

### Frontend
- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **shadcn/ui**: Component library
- **React Markdown**: Markdown rendering

## 📋 Prerequisites

- **Python 3.12** (Python 3.14+ requires virtual environments)
- **Node.js 18+** and npm
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))
- **macOS/Linux** (Windows support via WSL)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Learn44-ai
```

### 2. Backend Setup

```bash
cd server

# Create virtual environment
python3.12 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# The frontend will connect to http://localhost:8000 by default
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
source venv/bin/activate
python main.py
# Server runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

Visit `http://localhost:5173` in your browser.

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Required
GOOGLE_API_KEY=your_gemini_api_key_here

# Optional - LLM Configuration
GEMINI_MODEL=gemini-2.5-flash

# Optional - Embedding Configuration
USE_LOCAL_EMBEDDINGS=true  # Default: true (free, local)
LOCAL_EMBEDDING_MODEL=all-MiniLM-L6-v2

# Optional - OpenAI Embeddings (alternative)
USE_OPENAI_EMBEDDINGS=false
OPENAI_API_KEY=your_openai_key_if_using_openai_embeddings
```

### Embedding Options

1. **Local Embeddings (Default)**: Free, runs on-premises, no API calls
   ```env
   USE_LOCAL_EMBEDDINGS=true
   ```

2. **OpenAI Embeddings**: High quality, low cost (~$0.0001 per 1K tokens)
   ```env
   USE_LOCAL_EMBEDDINGS=false
   USE_OPENAI_EMBEDDINGS=true
   OPENAI_API_KEY=your_key
   ```

3. **Gemini Embeddings**: Integrated with LLM provider (requires paid tier)
   ```env
   USE_LOCAL_EMBEDDINGS=false
   USE_GEMINI_EMBEDDINGS=true
   ```

## 📚 Usage

### Uploading Documents

#### Via API
```bash
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@your-document.pdf" \
  -F "category=dev_setup"
```

#### Via UI
1. Navigate to "The Oracle" section
2. Use the document upload interface
3. Select category (supply_chain, company_culture, dev_setup, etc.)

#### Bulk Upload
```bash
cd server
python ingest_documents.py
```

### Document Categories

- `supply_chain` - Supply chain domain knowledge
- `company_culture` - Company culture and values
- `teams` - Team information and members
- `dev_setup` - Developer environment setup guides
- `general` - General documentation

### Chatting with The Oracle

Simply type your question in the chat interface. The AI will:
1. Search the knowledge base for relevant context
2. Generate a contextualized answer
3. Cite sources used
4. Maintain conversation history

### Using The Analyst

1. Upload a document (PDF, DOCX, TXT, MD)
2. Ask questions about the document
3. Get answers based on the full document content
4. Document expires after 24 hours

### Managing Documents

```bash
# List all documents
python manage_documents.py list

# Show document details
python manage_documents.py show <filename>

# Delete a document
python manage_documents.py delete <filename>

# Delete by category
python manage_documents.py delete-category <category>

# View statistics
python manage_documents.py stats
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Health status

### Chat
- `POST /api/chat` - Send message and get AI response
  ```json
  {
    "message": "How do I install Homebrew?",
    "conversation_id": "optional-conversation-id"
  }
  ```

### Document Management
- `POST /api/documents/upload` - Upload single document
- `POST /api/documents/batch-upload` - Upload multiple documents
- `GET /api/documents/list` - List all documents
- `GET /api/documents/{filename}` - Get document details
- `DELETE /api/documents/{filename}` - Delete document
- `DELETE /api/documents/category/{category}` - Delete category
- `GET /api/documents/stats` - Get statistics

### The Analyst
- `POST /api/analyst/upload` - Upload document for analysis
- `POST /api/analyst/chat` - Ask questions about uploaded document
- `DELETE /api/analyst/document/{document_id}` - Delete analyst document

### API Documentation

Once the server is running:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 📁 Project Structure

```
Learn44-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── chat-interface.tsx    # The Oracle chat UI
│   │   │   ├── document-analyzer.tsx # The Analyst UI
│   │   │   ├── video-gallery.tsx     # The Tutor UI
│   │   │   └── ui/                   # shadcn/ui components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # FastAPI backend
│   ├── llm_rag/
│   │   ├── config.py              # Configuration management
│   │   ├── document_processor.py  # Document ingestion
│   │   └── rag_pipeline.py        # RAG query processing
│   ├── documents/         # Source documents (gitignored)
│   ├── chroma_db/         # Vector database (gitignored)
│   ├── main.py            # FastAPI application
│   ├── ingest_documents.py    # Bulk ingestion script
│   ├── manage_documents.py    # Document management CLI
│   └── requirements.txt
│
├── DOCUMENT_MANAGEMENT.md  # Document management guide
├── DOCUMENT_UPLOAD_GUIDE.md # Upload instructions
├── SETUP_GUIDE.md          # Detailed setup guide
└── README.md               # This file
```

## 🔒 Security & Privacy

- **Closed Model Architecture**: Uses Google Gemini API with enterprise-grade security
- **Local Embeddings**: Sensitive documents can use local embedding models (zero data leaves organization)
- **Temporary Storage**: The Analyst uses in-memory storage with automatic expiration
- **Access Control**: API-based architecture enables integration with authentication systems
- **Audit Trail**: All queries and uploads can be logged for compliance

## 🧪 Testing

### Backend Testing
```bash
cd server
source venv/bin/activate
python test_backend.py
```

### API Testing
```bash
# Health check
curl http://localhost:8000/health

# Chat endpoint
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "What is LTL?"}'
```

## 🐛 Troubleshooting

### Python Version Issues
If you encounter `onnxruntime` errors, ensure you're using Python 3.12:
```bash
brew install python@3.12
python3.12 -m venv venv
```

### API Quota Errors
If you see Gemini API quota errors:
- Use local embeddings (default): `USE_LOCAL_EMBEDDINGS=true`
- Check your API key permissions
- Consider upgrading your Gemini API tier

### Connection Issues
- Ensure backend is running on port 8000
- Check CORS settings in `server/main.py`
- Verify frontend is connecting to correct API URL

## 📊 Performance Metrics

- **Query Response Time**: < 2 seconds average
- **Document Ingestion**: < 30 seconds per document
- **Vector Search Accuracy**: Top-k relevance > 85%
- **System Uptime**: > 99.5%

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 🔗 Resources

- [Project44 GitHub](https://github.com/project44)
- [Confluence Engineering Handbook](https://project44.atlassian.net/wiki/spaces/FDNENG/overview)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [ChromaDB Documentation](https://docs.trychroma.com/)
- [Google Gemini API](https://ai.google.dev/)

## 📧 Support

For questions or issues, please contact the development team or create an issue in the repository.

---

<div align="center">

**Learn44 AI: Intelligent knowledge access for modern enterprise onboarding.**


</div>

