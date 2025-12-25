"""
Quick test script to verify backend setup
Run this to check if everything is configured correctly
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("🔍 Testing Backend Configuration...\n")

# Check Google API Key
google_api_key = os.getenv("GOOGLE_API_KEY")
if google_api_key:
    print(f"✅ GOOGLE_API_KEY found: {google_api_key[:10]}...")
else:
    print("❌ GOOGLE_API_KEY not found in .env file")
    print("   Get your key from: https://makersuite.google.com/app/apikey")

# Check OpenAI API Key (optional)
openai_api_key = os.getenv("OPENAI_API_KEY")
use_openai_embeddings = os.getenv("USE_OPENAI_EMBEDDINGS", "false").lower() == "true"
if use_openai_embeddings:
    if openai_api_key:
        print(f"✅ OPENAI_API_KEY found (for embeddings): {openai_api_key[:10]}...")
    else:
        print("⚠️  USE_OPENAI_EMBEDDINGS=true but OPENAI_API_KEY not found")

# Check ChromaDB path
chroma_db_path = os.getenv("CHROMA_DB_PATH", "./chroma_db")
print(f"📁 ChromaDB path: {chroma_db_path}")

# Try importing required modules
print("\n🔍 Checking Python modules...")
try:
    import fastapi
    print("✅ FastAPI installed")
except ImportError:
    print("❌ FastAPI not installed - run: pip install -r requirements.txt")

try:
    import chromadb
    print("✅ ChromaDB installed")
except ImportError:
    print("❌ ChromaDB not installed - run: pip install -r requirements.txt")

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    print("✅ langchain-google-genai installed")
except ImportError:
    print("❌ langchain-google-genai not installed - run: pip install -r requirements.txt")

# Try initializing RAG pipeline
print("\n🔍 Testing RAG Pipeline initialization...")
try:
    from llm_rag.rag_pipeline import RAGPipeline
    from llm_rag.config import config
    
    if not config.google_api_key:
        print("❌ Cannot test RAG pipeline - GOOGLE_API_KEY not set")
    else:
        print("⏳ Initializing RAG pipeline (this may take a moment)...")
        pipeline = RAGPipeline()
        print("✅ RAG pipeline initialized successfully!")
        
        # Check collection stats
        stats = pipeline.collection.count()
        print(f"📊 Documents in database: {stats} chunks")
        if stats == 0:
            print("⚠️  No documents found in database - upload some documents first!")
        
except Exception as e:
    print(f"❌ Error initializing RAG pipeline: {str(e)}")
    import traceback
    print("\nFull error:")
    print(traceback.format_exc())

print("\n✅ Configuration check complete!")
print("\nNext steps:")
print("1. Make sure GOOGLE_API_KEY is set in .env")
print("2. Upload documents using: POST /api/documents/upload")
print("3. Start server: python main.py")

