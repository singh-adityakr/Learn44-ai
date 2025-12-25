"""
Document processing module for ingesting various document types
"""

import os
import aiofiles
from typing import List, Dict, Optional
from fastapi import UploadFile
import PyPDF2
import docx
from markdown import markdown
from bs4 import BeautifulSoup
import chromadb
from chromadb.config import Settings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_openai import OpenAIEmbeddings
from sentence_transformers import SentenceTransformer  # Local embeddings (FREE)

from llm_rag.config import config


class DocumentProcessor:
    """Processes and ingests documents into the vector database"""
    
    def __init__(self):
        """Initialize document processor"""
        self.chroma_client = chromadb.PersistentClient(
            path=config.chroma_db_path,
            settings=Settings(anonymized_telemetry=False)
        )
        self.collection = self.chroma_client.get_or_create_collection(
            name=config.collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        # Initialize embeddings (priority: local > OpenAI > Gemini)
        if config.use_local_embeddings:
            # Use local embeddings (FREE, no API needed)
            print(f"📦 Loading local embedding model: {config.local_embedding_model}")
            self.embeddings = SentenceTransformer(config.local_embedding_model)
            self.embedding_type = "local"
            print("✅ Using local embeddings (free, no API calls)")
        elif config.use_openai_embeddings and config.openai_api_key:
            # Use OpenAI embeddings (requires API key, very cheap)
            self.embeddings = OpenAIEmbeddings(
                model=config.openai_embedding_model,
                openai_api_key=config.openai_api_key
            )
            self.embedding_type = "openai"
            print("✅ Using OpenAI embeddings")
        elif config.use_gemini_embeddings and config.google_api_key:
            # Use Gemini embeddings (requires PAID account)
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model=config.embedding_model,
                google_api_key=config.google_api_key
            )
            self.embedding_type = "gemini"
            print("✅ Using Gemini embeddings")
        else:
            # Default to local if nothing specified
            print("⚠️  No embedding provider specified, defaulting to local embeddings")
            self.embeddings = SentenceTransformer(config.local_embedding_model)
            self.embedding_type = "local"
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.chunk_size,
            chunk_overlap=config.chunk_overlap,
            length_function=len,
        )
        
        # Ensure documents directory exists
        os.makedirs(config.documents_path, exist_ok=True)
    
    async def _save_file(self, file: UploadFile) -> str:
        """Save uploaded file to disk"""
        file_path = os.path.join(config.documents_path, file.filename)
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        return file_path
    
    async def _extract_text_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        text = ""
        with open(file_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text
    
    async def _extract_text_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        doc = docx.Document(file_path)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text
    
    async def _extract_text_markdown(self, file_path: str) -> str:
        """Extract text from Markdown file"""
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            content = await f.read()
        # Convert markdown to HTML then extract text
        html = markdown(content)
        soup = BeautifulSoup(html, 'lxml')
        return soup.get_text()
    
    async def _extract_text_txt(self, file_path: str) -> str:
        """Extract text from plain text file"""
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            return await f.read()
    
    async def extract_text(self, file_path: str, file_type: str) -> str:
        """Extract text from various file types"""
        file_type_lower = file_type.lower()
        
        if file_type_lower == 'application/pdf' or file_path.endswith('.pdf'):
            return await self._extract_text_pdf(file_path)
        elif file_type_lower == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' or file_path.endswith('.docx'):
            return await self._extract_text_docx(file_path)
        elif file_type_lower == 'text/markdown' or file_path.endswith('.md'):
            return await self._extract_text_markdown(file_path)
        elif file_type_lower.startswith('text/') or file_path.endswith('.txt'):
            return await self._extract_text_txt(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    
    async def _create_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Create embeddings for text chunks"""
        import asyncio
        from functools import partial
        
        try:
            # Handle local embeddings (sentence-transformers)
            if self.embedding_type == "local":
                # Local embeddings are synchronous, run in executor
                loop = asyncio.get_event_loop()
                embed_func = partial(self.embeddings.encode, texts, convert_to_numpy=False)
                embeddings = await loop.run_in_executor(None, embed_func)
                # Convert to list of lists
                return [emb.tolist() if hasattr(emb, 'tolist') else list(emb) for emb in embeddings]
            
            # Handle API-based embeddings (OpenAI or Gemini)
            # Check if embeddings object has async method
            if hasattr(self.embeddings, 'aembed_documents'):
                try:
                    return await self.embeddings.aembed_documents(texts)
                except (AttributeError, NotImplementedError, TypeError):
                    # Fall back to sync if async not supported
                    pass
            
            # Use sync embedding (works for both Gemini and OpenAI)
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            embed_func = partial(self.embeddings.embed_documents, texts)
            return await loop.run_in_executor(None, embed_func)
            
        except Exception as e:
            import traceback
            print(f"❌ Error in _create_embeddings: {str(e)}")
            print(traceback.format_exc())
            # Final fallback - try sync directly
            try:
                if self.embedding_type == "local":
                    embeddings = self.embeddings.encode(texts, convert_to_numpy=False)
                    return [emb.tolist() if hasattr(emb, 'tolist') else list(emb) for emb in embeddings]
                else:
                    return self.embeddings.embed_documents(texts)
            except Exception as e2:
                raise Exception(f"Failed to create embeddings: {str(e2)}")
    
    async def process_and_ingest(
        self,
        file: UploadFile,
        category: str = "general"
    ) -> Dict:
        """
        Process a document and ingest it into the vector database
        
        Args:
            file: Uploaded file
            category: Document category (e.g., "supply_chain", "company_culture", "dev_setup")
        
        Returns:
            Dictionary with processing results
        """
        # Save file
        file_path = await self._save_file(file)
        
        try:
            # Extract text
            text = await self.extract_text(file_path, file.content_type or "")
            
            if not text.strip():
                raise ValueError("No text content extracted from document")
            
            # Split into chunks
            chunks = self.text_splitter.split_text(text)
            
            if not chunks:
                raise ValueError("No chunks created from document text")
            
            print(f"📄 Created {len(chunks)} chunks from document")
            
            # Create embeddings
            print(f"⏳ Creating embeddings...")
            try:
                embeddings = await self._create_embeddings(chunks)
                print(f"✅ Created {len(embeddings)} embeddings")
            except Exception as e:
                import traceback
                print(f"❌ Error creating embeddings: {str(e)}")
                print(traceback.format_exc())
                raise Exception(f"Failed to create embeddings: {str(e)}")
            
            # Prepare metadata
            metadata_list = [
                {
                    "source": file.filename,
                    "category": category,
                    "chunk_index": i,
                    "total_chunks": len(chunks)
                }
                for i in range(len(chunks))
            ]
            
            # Generate IDs
            ids = [f"{file.filename}_{category}_{i}" for i in range(len(chunks))]
            
            # Add to ChromaDB
            print(f"⏳ Adding to ChromaDB...")
            try:
                # ChromaDB expects embeddings as a list of lists
                self.collection.add(
                    embeddings=embeddings if isinstance(embeddings[0], list) else embeddings,
                    documents=chunks,
                    metadatas=metadata_list,
                    ids=ids
                )
                print(f"✅ Successfully added {len(chunks)} chunks to ChromaDB")
            except Exception as e:
                import traceback
                print(f"❌ Error adding to ChromaDB: {str(e)}")
                print(traceback.format_exc())
                raise Exception(f"Failed to add to ChromaDB: {str(e)}")
            
            return {
                "chunks_created": len(chunks),
                "filename": file.filename,
                "category": category
            }
        
        except Exception as e:
            # Clean up file on error
            if os.path.exists(file_path):
                os.remove(file_path)
            raise Exception(f"Error processing document: {str(e)}")
    
    def ingest_text_directly(
        self,
        text: str,
        source_name: str,
        category: str = "general"
    ) -> Dict:
        """
        Ingest text directly without file upload
        Useful for programmatic ingestion
        """
        # Split into chunks
        chunks = self.text_splitter.split_text(text)
        
        # Create embeddings (synchronous version)
        try:
            embeddings = self.embeddings.embed_documents(chunks)
        except Exception as e:
            raise Exception(f"Error creating embeddings: {str(e)}")
        
        # Prepare metadata
        metadata_list = [
            {
                "source": source_name,
                "category": category,
                "chunk_index": i,
                "total_chunks": len(chunks)
            }
            for i in range(len(chunks))
        ]
        
        # Generate IDs
        ids = [f"{source_name}_{category}_{i}" for i in range(len(chunks))]
        
        # Add to ChromaDB
        self.collection.add(
            embeddings=embeddings,
            documents=chunks,
            metadatas=metadata_list,
            ids=ids
        )
        
        return {
            "chunks_created": len(chunks),
            "source": source_name,
            "category": category
        }

