"""
RAG Pipeline - Retrieval Augmented Generation for answering questions
"""

import os
from typing import List, Tuple, Dict, Optional
import chromadb
from chromadb.config import Settings
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_openai import OpenAIEmbeddings
from sentence_transformers import SentenceTransformer  # Local embeddings (FREE)
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage, AIMessage, SystemMessage

from llm_rag.config import config


class RAGPipeline:
    """RAG pipeline for question answering"""
    
    def __init__(self):
        """Initialize RAG pipeline"""
        if not config.google_api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        # Initialize ChromaDB
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
        
        # Initialize Gemini LLM
        # Available models: gemini-pro (free), gemini-1.5-pro, gemini-1.5-flash, gemini-2.5-flash
        if not config.google_api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        self.llm = ChatGoogleGenerativeAI(
            model=config.gemini_model,
            temperature=0.7,
            google_api_key=config.google_api_key
        )
        print(f"✅ Using Gemini model: {config.gemini_model}")
        
        # Conversation memory (in-memory for now, can be upgraded to Redis/DB)
        self.conversation_memories: Dict[str, ConversationBufferMemory] = {}
    
    def _get_memory(self, conversation_id: str) -> ConversationBufferMemory:
        """Get or create conversation memory"""
        if conversation_id not in self.conversation_memories:
            self.conversation_memories[conversation_id] = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True,
                output_key="answer"
            )
        return self.conversation_memories[conversation_id]
    
    def _retrieve_relevant_docs(self, query: str, top_k: int = None) -> Tuple[List[str], List[Dict]]:
        """
        Retrieve relevant documents from vector database
        
        Returns:
            Tuple of (documents, metadata_list)
        """
        top_k = top_k or config.top_k_retrieval
        
        try:
            # Create query embedding
            if self.embedding_type == "local":
                # Local embeddings use encode() method
                query_embedding = self.embeddings.encode(query, convert_to_numpy=True).tolist()
            else:
                # API-based embeddings use embed_query() method
                query_embedding = self.embeddings.embed_query(query)
            
            # Query ChromaDB
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            
            # Extract documents and metadata
            # ChromaDB returns results as lists of lists
            documents = results.get('documents', [[]])[0] if results.get('documents') and len(results.get('documents', [])) > 0 else []
            metadatas = results.get('metadatas', [[]])[0] if results.get('metadatas') and len(results.get('metadatas', [])) > 0 else []
            
            return documents, metadatas
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"❌ Error retrieving documents:")
            print(f"Query: {query}")
            print(f"Error: {str(e)}")
            print(f"Traceback:\n{error_details}")
            # Return empty results instead of crashing
            return [], []
    
    def _create_context(self, documents: List[str], metadatas: List[Dict]) -> str:
        """Create context string from retrieved documents"""
        context_parts = []
        seen_sources = set()
        
        for doc, metadata in zip(documents, metadatas):
            source = metadata.get('source', 'Unknown')
            category = metadata.get('category', 'general')
            
            # Add source to seen set for citation
            if source not in seen_sources:
                seen_sources.add(source)
            
            context_parts.append(f"[Source: {source} | Category: {category}]\n{doc}\n")
        
        return "\n---\n".join(context_parts)
    
    def _extract_sources(self, metadatas: List[Dict]) -> List[str]:
        """Extract unique source names from metadata"""
        sources = set()
        for meta in metadatas:
            source = meta.get('source', 'Unknown')
            category = meta.get('category', 'general')
            sources.add(f"{source} ({category})")
        return list(sources)
    
    async def query(
        self,
        query: str,
        conversation_id: Optional[str] = None
    ) -> Tuple[str, List[str]]:
        """
        Process a query using RAG
        
        Args:
            query: User's question
            conversation_id: Optional conversation ID for context
        
        Returns:
            Tuple of (response, sources)
        """
        conversation_id = conversation_id or "default"
        
        # Retrieve relevant documents
        documents, metadatas = self._retrieve_relevant_docs(query)
        
        if not documents:
            return (
                "I couldn't find relevant information in the knowledge base to answer your question. "
                "Please try rephrasing your question or contact support for assistance.",
                []
            )
        
        # Create context
        context = self._create_context(documents, metadatas)
        
        # Extract sources for citation
        sources = self._extract_sources(metadatas)
        
        # Get conversation memory
        memory = self._get_memory(conversation_id)
        chat_history = memory.chat_memory.messages
        
        # Build prompt for Gemini
        # Gemini works well with structured prompts that include system instructions
        system_instructions = """You are a helpful AI assistant for onboarding new hires at project44. 
Your role is to answer questions based on the provided context from company documentation, 
supply chain domain knowledge, and developer setup guides.

IMPORTANT: Format your responses using Markdown for better readability:
- Use **bold** for emphasis and important terms
- Use ## for section headings
- Use ### for subsections
- Use bullet points (-) or numbered lists (1.) for steps
- Use code blocks (```) for commands, code, file paths, and configuration
- Use `backticks` for inline code, commands, and technical terms
- Use > for important notes or warnings
- Structure your answers clearly with proper spacing

Guidelines:
1. Answer questions based ONLY on the provided context
2. If the context doesn't contain enough information, say so clearly
3. Be concise but thorough
4. For developer setup questions, provide step-by-step instructions with:
   - Clear headings for each section
   - Numbered steps for sequential processes
   - Code blocks for commands
   - Notes or warnings where relevant
5. For company culture questions, be friendly and welcoming
6. Always cite your sources when possible
7. If asked about something not in the context, politely redirect to relevant documentation

Example format for setup instructions:
## Setup Instructions

### Prerequisites
- Item 1
- Item 2

### Step 1: Install X
\`\`\`bash
command here
\`\`\`

### Step 2: Configure Y
\`\`\`bash
another command
\`\`\`

> **Note:** Important information here"""
        
        # Build conversation history string
        history_text = ""
        if chat_history:
            history_parts = []
            for msg in chat_history[-6:]:  # Keep last 3 exchanges (6 messages)
                if isinstance(msg, HumanMessage):
                    history_parts.append(f"User: {msg.content}")
                elif isinstance(msg, AIMessage):
                    history_parts.append(f"Assistant: {msg.content}")
            if history_parts:
                history_text = "\n\nPrevious conversation:\n" + "\n".join(history_parts)
        
        # Combine everything into a single prompt
        full_prompt = f"""{system_instructions}

Context from knowledge base:
{context}{history_text}

User question: {query}

Provide a helpful answer based on the context:"""
        
        # Get response from Gemini LLM (using simple string prompt)
        try:
            response = self.llm.invoke(full_prompt)
            answer = response.content
            
            # Save to memory
            memory.chat_memory.add_user_message(query)
            memory.chat_memory.add_ai_message(answer)
            
            return answer, sources
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"❌ Error calling Gemini LLM:")
            print(f"Error: {str(e)}")
            print(f"Traceback:\n{error_details}")
            raise Exception(f"Failed to get response from Gemini: {str(e)}")
    
    async def get_collection_stats(self) -> Dict:
        """Get statistics about the document collection"""
        try:
            count = self.collection.count()
            return {
                "total_chunks": count,
                "collection_name": config.collection_name,
                "status": "healthy"
            }
        except Exception as e:
            return {
                "error": str(e),
                "status": "error"
            }

