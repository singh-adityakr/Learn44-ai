"""
Configuration settings for RAG pipeline
"""

import os
from pydantic_settings import BaseSettings
from typing import Optional

class RAGConfig(BaseSettings):
    """Configuration for RAG pipeline"""
    
    # Gemini settings (for LLM only)
    google_api_key: Optional[str] = os.getenv("GOOGLE_API_KEY")
    # Available models: gemini-pro (free), gemini-1.5-pro, gemini-1.5-flash, gemini-2.5-flash
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    # Embedding options (choose one):
    # Option 1: Local embeddings (FREE, no API needed) - DEFAULT & RECOMMENDED
    use_local_embeddings: bool = os.getenv("USE_LOCAL_EMBEDDINGS", "true").lower() == "true"
    local_embedding_model: str = os.getenv("LOCAL_EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    
    # Option 2: OpenAI embeddings (requires API key, very cheap ~$0.0001/1K tokens)
    use_openai_embeddings: bool = os.getenv("USE_OPENAI_EMBEDDINGS", "false").lower() == "true"
    openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
    openai_embedding_model: str = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
    
    # Option 3: Gemini embeddings (requires PAID account, free tier has limit: 0)
    use_gemini_embeddings: bool = os.getenv("USE_GEMINI_EMBEDDINGS", "false").lower() == "true"
    embedding_model: str = os.getenv("EMBEDDING_MODEL", "models/embedding-001")
    
    # Vector database settings
    chroma_db_path: str = os.getenv("CHROMA_DB_PATH", "./chroma_db")
    collection_name: str = os.getenv("COLLECTION_NAME", "learn44_documents")
    
    # RAG settings
    chunk_size: int = int(os.getenv("CHUNK_SIZE", "1000"))
    chunk_overlap: int = int(os.getenv("CHUNK_OVERLAP", "200"))
    top_k_retrieval: int = int(os.getenv("TOP_K_RETRIEVAL", "5"))
    
    # Document processing
    documents_path: str = os.getenv("DOCUMENTS_PATH", "./documents")
    max_file_size_mb: int = int(os.getenv("MAX_FILE_SIZE_MB", "50"))
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global config instance
config = RAGConfig()

