#!/usr/bin/env python3
"""
Helper script to manage documents in the RAG system
Usage:
    python manage_documents.py list                    # List all documents
    python manage_documents.py show <filename>          # Show document details
    python manage_documents.py delete <filename>        # Delete a document
    python manage_documents.py delete-category <cat>    # Delete by category
    python manage_documents.py stats                   # Show statistics
"""

import sys
import requests
import json
from typing import Optional

API_BASE_URL = "http://localhost:8000"

def list_documents():
    """List all documents in the collection"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/documents/list")
        response.raise_for_status()
        data = response.json()
        
        print("\n📚 Documents in RAG System:")
        print("=" * 60)
        print(f"Total Documents: {data['total_documents']}")
        print(f"Total Chunks: {data['total_chunks']}")
        print("=" * 60)
        
        if data['documents']:
            for i, doc in enumerate(data['documents'], 1):
                print(f"\n{i}. {doc['filename']}")
                print(f"   Category: {doc['category']}")
                print(f"   Chunks: {doc['chunk_count']}/{doc['total_chunks']}")
        else:
            print("\nNo documents found.")
        
        print("\n")
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to API. Make sure the server is running on http://localhost:8000")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

def show_document(filename: str):
    """Show details about a specific document"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/documents/{filename}")
        response.raise_for_status()
        data = response.json()
        
        print(f"\n📄 Document Details: {filename}")
        print("=" * 60)
        print(f"Category: {data['category']}")
        print(f"Total Chunks: {data['total_chunks']}")
        print(f"Chunk IDs: {len(data['chunk_ids'])}")
        
        if 'sample_chunk' in data:
            print(f"\nSample Content (first 200 chars):")
            print("-" * 60)
            print(data['sample_chunk'])
        
        print("\n")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print(f"❌ Document '{filename}' not found.")
        else:
            print(f"❌ Error: {e}")
        sys.exit(1)
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to API. Make sure the server is running on http://localhost:8000")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

def delete_document(filename: str, confirm: bool = False):
    """Delete a specific document"""
    if not confirm:
        print(f"⚠️  Warning: This will delete '{filename}' and all its chunks.")
        response = input("Are you sure? (yes/no): ")
        if response.lower() != 'yes':
            print("Cancelled.")
            return
    
    try:
        response = requests.delete(f"{API_BASE_URL}/api/documents/{filename}")
        response.raise_for_status()
        data = response.json()
        
        print(f"\n✅ {data['message']}")
        print(f"   Chunks deleted: {data['chunks_deleted']}\n")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print(f"❌ Document '{filename}' not found.")
        else:
            print(f"❌ Error: {e}")
        sys.exit(1)
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to API. Make sure the server is running on http://localhost:8000")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

def delete_category(category: str, confirm: bool = False):
    """Delete all documents in a category"""
    if not confirm:
        print(f"⚠️  Warning: This will delete ALL documents in category '{category}'.")
        response = input("Are you sure? (yes/no): ")
        if response.lower() != 'yes':
            print("Cancelled.")
            return
    
    try:
        response = requests.delete(f"{API_BASE_URL}/api/documents/category/{category}")
        response.raise_for_status()
        data = response.json()
        
        print(f"\n✅ {data['message']}")
        print(f"   Documents deleted: {data['documents_deleted']}")
        print(f"   Chunks deleted: {data['chunks_deleted']}\n")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print(f"❌ No documents found in category '{category}'.")
        else:
            print(f"❌ Error: {e}")
        sys.exit(1)
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to API. Make sure the server is running on http://localhost:8000")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

def delete_all(confirm: bool = False):
    """Delete all documents"""
    if not confirm:
        print("⚠️  WARNING: This will delete ALL documents from the RAG system!")
        response = input("Type 'DELETE ALL' to confirm: ")
        if response != 'DELETE ALL':
            print("Cancelled.")
            return
    
    try:
        response = requests.delete(f"{API_BASE_URL}/api/documents?confirm=true")
        response.raise_for_status()
        data = response.json()
        
        print(f"\n✅ {data['message']}")
        print(f"   Chunks deleted: {data['chunks_deleted']}\n")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 400:
            print(f"❌ {e.response.json()['detail']}")
        else:
            print(f"❌ Error: {e}")
        sys.exit(1)
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to API. Make sure the server is running on http://localhost:8000")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

def show_stats():
    """Show collection statistics"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/documents/stats")
        response.raise_for_status()
        data = response.json()
        
        print("\n📊 Collection Statistics:")
        print("=" * 60)
        print(f"Status: {data['status']}")
        print(f"Collection Name: {data['collection_name']}")
        print(f"Total Chunks: {data['total_chunks']}")
        print("\n")
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to API. Make sure the server is running on http://localhost:8000")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    if command == "list":
        list_documents()
    elif command == "show":
        if len(sys.argv) < 3:
            print("❌ Error: Please provide a filename")
            print("Usage: python manage_documents.py show <filename>")
            sys.exit(1)
        show_document(sys.argv[2])
    elif command == "delete":
        if len(sys.argv) < 3:
            print("❌ Error: Please provide a filename")
            print("Usage: python manage_documents.py delete <filename>")
            sys.exit(1)
        delete_document(sys.argv[2])
    elif command == "delete-category":
        if len(sys.argv) < 3:
            print("❌ Error: Please provide a category")
            print("Usage: python manage_documents.py delete-category <category>")
            sys.exit(1)
        delete_category(sys.argv[2])
    elif command == "delete-all":
        delete_all()
    elif command == "stats":
        show_stats()
    else:
        print(f"❌ Unknown command: {command}")
        print(__doc__)
        sys.exit(1)

if __name__ == "__main__":
    main()

