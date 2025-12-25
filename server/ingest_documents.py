"""
Script to help ingest documents programmatically
Useful for bulk ingestion of existing documents
"""

import os
import asyncio
from pathlib import Path
from llm_rag.document_processor import DocumentProcessor
from llm_rag.config import config


async def ingest_directory(directory_path: str, category: str = "general"):
    """
    Ingest all supported documents from a directory
    
    Args:
        directory_path: Path to directory containing documents
        category: Category to assign to all documents
    """
    processor = DocumentProcessor()
    
    supported_extensions = {'.pdf', '.docx', '.txt', '.md'}
    directory = Path('server/llm_rag/context_documents')
    
    if not directory.exists():
        print(f"❌ Directory not found: {directory_path}")
        return
    
    files = [f for f in directory.iterdir() if f.suffix.lower() in supported_extensions]
    
    if not files:
        print(f"❌ No supported documents found in {directory_path}")
        return
    
    print(f"📁 Found {len(files)} documents to process...")
    
    for file_path in files:
        try:
            print(f"📄 Processing: {file_path.name}...")
            
            # Read file content
            if file_path.suffix.lower() == '.pdf':
                import PyPDF2
                text = ""
                with open(file_path, 'rb') as f:
                    pdf_reader = PyPDF2.PdfReader(f)
                    for page in pdf_reader.pages:
                        text += page.extract_text() + "\n"
            elif file_path.suffix.lower() == '.docx':
                import docx
                doc = docx.Document(file_path)
                text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            else:
                with open(file_path, 'r', encoding='utf-8') as f:
                    text = f.read()
            
            # Ingest directly
            result = processor.ingest_text_directly(
                text=text,
                source_name=file_path.name,
                category=category
            )
            
            print(f"✅ Processed {file_path.name}: {result['chunks_created']} chunks created")
        
        except Exception as e:
            print(f"❌ Error processing {file_path.name}: {str(e)}")


async def ingest_text_file(file_path: str, category: str = "general"):
    """
    Ingest a single text file
    
    Args:
        file_path: Path to text file
        category: Category to assign
    """
    processor = DocumentProcessor()
    
    file = Path(file_path)
    if not file.exists():
        print(f"❌ File not found: {file_path}")
        return
    
    try:
        with open(file, 'r', encoding='utf-8') as f:
            text = f.read()
        
        result = processor.ingest_text_directly(
            text=text,
            source_name=file.name,
            category=category
        )
        
        print(f"✅ Processed {file.name}: {result['chunks_created']} chunks created")
    
    except Exception as e:
        print(f"❌ Error processing {file_path}: {str(e)}")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python ingest_documents.py <directory_path> [category]")
        print("  python ingest_documents.py <file_path> [category]")
        print("\nCategories: supply_chain, company_culture, teams, dev_setup, general")
        sys.exit(1)
    
    path = sys.argv[1]
    category = sys.argv[2] if len(sys.argv) > 2 else "general"
    
    if os.path.isdir(path):
        asyncio.run(ingest_directory(path, category))
    else:
        asyncio.run(ingest_text_file(path, category))

