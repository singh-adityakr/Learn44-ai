"""
FastAPI backend for Learn44 AI Onboarding Assistant
Main entry point for the RAG-powered chatbot API
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn
from dotenv import load_dotenv
import os
import uuid
import asyncio
import aiofiles
from datetime import datetime, timedelta

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

# In-memory storage for analyst documents (session-based)
# In production, consider using Redis or a database
analyst_documents: Dict[str, Dict] = {}

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

class AnalystUploadResponse(BaseModel):
    document_id: str
    filename: str
    message: str

class AnalystChatRequest(BaseModel):
    document_id: str
    message: str

class AnalystChatResponse(BaseModel):
    response: str

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

# Analyst endpoints for document upload and chat
@app.post("/api/analyst/upload", response_model=AnalystUploadResponse)
async def analyst_upload(file: UploadFile = File(...)):
    """
    Upload a document for analysis in The Analyst section
    Documents are stored temporarily in memory for the session
    """
    if document_processor is None:
        raise HTTPException(status_code=503, detail="Document processor not initialized")
    
    try:
        # Generate unique document ID
        document_id = str(uuid.uuid4())
        
        # Extract text from the document using the document processor
        file_content = await file.read()
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        # Save file temporarily to extract text
        temp_path = f"/tmp/analyst_{document_id}{file_ext}"
        async with aiofiles.open(temp_path, 'wb') as f:
            await f.write(file_content)
        
        # Extract text using the document processor's public method
        try:
            text = await document_processor.extract_text(temp_path, file.content_type or "")
        except Exception as e:
            # Clean up temp file before raising error
            try:
                os.remove(temp_path)
            except:
                pass
            raise HTTPException(status_code=400, detail=f"Failed to extract text: {str(e)}")
        
        # Clean up temp file
        try:
            os.remove(temp_path)
        except:
            pass
        
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="No text content could be extracted from the document")
        
        # Store document in memory (with expiration after 24 hours)
        analyst_documents[document_id] = {
            "filename": file.filename,
            "text": text,
            "uploaded_at": datetime.now(),
            "expires_at": datetime.now() + timedelta(hours=24)
        }
        
        return AnalystUploadResponse(
            document_id=document_id,
            filename=file.filename,
            message=f"Document '{file.filename}' uploaded successfully. You can now ask questions about it."
        )
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"❌ Error uploading analyst document:")
        print(f"Filename: {file.filename}")
        print(f"Error: {str(e)}")
        print(f"Traceback:\n{error_details}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing document: {str(e)}"
        )

@app.post("/api/analyst/chat", response_model=AnalystChatResponse)
async def analyst_chat(request: AnalystChatRequest):
    """
    Ask questions about an uploaded document in The Analyst section
    Uses RAG on the specific document content
    """
    if rag_pipeline is None:
        raise HTTPException(status_code=503, detail="RAG pipeline not initialized")
    
    # Check if document exists
    if request.document_id not in analyst_documents:
        raise HTTPException(status_code=404, detail="Document not found. Please upload the document first.")
    
    doc_data = analyst_documents[request.document_id]
    
    # Check if document has expired
    if datetime.now() > doc_data["expires_at"]:
        del analyst_documents[request.document_id]
        raise HTTPException(status_code=410, detail="Document session has expired. Please upload again.")
    
    try:
        # Create a temporary RAG query with the document content as context
        # We'll use the document text directly as context instead of searching the vector DB
        document_text = doc_data["text"]
        
        # Use the LLM to answer questions based on the document
        from llm_rag.config import config
        import google.generativeai as genai
        
        if not config.google_api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        genai.configure(api_key=config.google_api_key)
        model = genai.GenerativeModel(config.gemini_model)
        
        # Create a prompt that includes the document content
        prompt = f"""You are an AI assistant helping analyze a document. Answer the user's question based ONLY on the following document content.

Document: {doc_data['filename']}

Document Content:
{document_text}

User Question: {request.message}

Please provide a helpful answer based on the document content. If the document doesn't contain information to answer the question, say so. Format your response using markdown for better readability (use headings, lists, code blocks, etc.).

Answer:"""
        
        # Get response from Gemini
        response = model.generate_content(prompt)
        answer = response.text
        
        return AnalystChatResponse(response=answer)
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"❌ Error processing analyst chat:")
        print(f"Document ID: {request.document_id}")
        print(f"Question: {request.message}")
        print(f"Error: {str(e)}")
        print(f"Traceback:\n{error_details}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing chat: {str(e)}"
        )

@app.delete("/api/analyst/document/{document_id}")
async def delete_analyst_document(document_id: str):
    """Delete an uploaded analyst document"""
    if document_id in analyst_documents:
        del analyst_documents[document_id]
        return JSONResponse(content={"status": "success", "message": "Document deleted"})
    else:
        raise HTTPException(status_code=404, detail="Document not found")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="localhost",
        port=8000,
        reload=True
    )

