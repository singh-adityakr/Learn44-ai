"""
FastAPI backend for Learn44 AI Onboarding Assistant
Main entry point for the RAG-powered chatbot API
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from dotenv import load_dotenv
import os

from llm_rag.rag_pipeline import RAGPipeline
from llm_rag.document_processor import DocumentProcessor

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Learn44 AI Onboarding Assistant",
    description="RAG-powered chatbot for onboarding new hires",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default port
        "http://localhost:3000",  # Alternative React port
        "http://127.0.0.1:5173",   # Alternative localhost format
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG pipeline and document processor
rag_pipeline = None
document_processor = None

@app.on_event("startup")
async def startup_event():
    """Initialize RAG pipeline on startup"""
    global rag_pipeline, document_processor
    try:
        rag_pipeline = RAGPipeline()
        document_processor = DocumentProcessor()
        print("✅ RAG pipeline initialized successfully")
    except Exception as e:
        print(f"❌ Error initializing RAG pipeline: {e}")
        raise

# Request/Response models
class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[str]
    conversation_id: str

class HealthResponse(BaseModel):
    status: str
    message: str

# API Endpoints
@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="Learn44 AI Onboarding Assistant API is running"
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed health check"""
    if rag_pipeline is None:
        raise HTTPException(status_code=503, detail="RAG pipeline not initialized")
    
    return HealthResponse(
        status="healthy",
        message="Service is operational"
    )

@app.post("/api/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """
    Main chat endpoint - processes user questions using RAG
    """
    if rag_pipeline is None:
        raise HTTPException(status_code=503, detail="RAG pipeline not initialized")
    
    try:
        # Get response from RAG pipeline
        response, sources = await rag_pipeline.query(
            query=message.message,
            conversation_id=message.conversation_id
        )
        
        return ChatResponse(
            response=response,
            sources=sources,
            conversation_id=message.conversation_id or "default"
        )
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"❌ Error processing chat request:")
        print(f"Query: {message.message}")
        print(f"Error: {str(e)}")
        print(f"Traceback:\n{error_details}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing chat: {str(e)}"
        )

@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    category: Optional[str] = None
):
    """
    Upload and process documents for RAG
    Supports: PDF, DOCX, TXT, MD files
    """
    if document_processor is None:
        raise HTTPException(status_code=503, detail="Document processor not initialized")
    
    try:
        # Process and ingest document
        result = await document_processor.process_and_ingest(
            file=file,
            category=category or "general"
        )
        
        return JSONResponse(content={
            "status": "success",
            "message": f"Document '{file.filename}' processed successfully",
            "chunks_created": result.get("chunks_created", 0),
            "category": category or "general"
        })
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"❌ Error uploading document:")
        print(f"Filename: {file.filename}")
        print(f"Category: {category or 'general'}")
        print(f"Error: {str(e)}")
        print(f"Traceback:\n{error_details}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing document: {str(e)}"
        )

@app.post("/api/documents/batch-upload")
async def batch_upload_documents(
    files: List[UploadFile] = File(...),
    category: Optional[str] = None
):
    """
    Upload multiple documents at once
    """
    if document_processor is None:
        raise HTTPException(status_code=503, detail="Document processor not initialized")
    
    results = []
    for file in files:
        try:
            result = await document_processor.process_and_ingest(
                file=file,
                category=category or "general"
            )
            results.append({
                "filename": file.filename,
                "status": "success",
                "chunks_created": result.get("chunks_created", 0)
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "status": "error",
                "error": str(e)
            })
    
    return JSONResponse(content={
        "status": "completed",
        "results": results
    })

@app.get("/api/documents/stats")
async def get_document_stats():
    """Get statistics about ingested documents"""
    if rag_pipeline is None:
        raise HTTPException(status_code=503, detail="RAG pipeline not initialized")
    
    try:
        stats = await rag_pipeline.get_collection_stats()
        return JSONResponse(content=stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="localhost",
        port=8000,
        reload=True
    )

