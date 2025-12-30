# Document Management Guide

This guide explains how to check and remove documents from the RAG system.

## Overview

Documents uploaded to the RAG system are stored in ChromaDB as chunks (small pieces of text). Each document is split into multiple chunks, and each chunk has:
- A unique ID
- The text content
- Metadata (filename, category, chunk index, etc.)

## Methods to Manage Documents

### Method 1: Using the Python Script (Recommended)

A helper script is provided at `server/manage_documents.py`:

```bash
cd server
python manage_documents.py list                    # List all documents
python manage_documents.py show <filename>         # Show document details
python manage_documents.py delete <filename>        # Delete a document
python manage_documents.py delete-category <cat>   # Delete by category
python manage_documents.py stats                   # Show statistics
python manage_documents.py delete-all              # Delete ALL documents (with confirmation)
```

**Examples:**

```bash
# List all documents
python manage_documents.py list

# Show details about a specific document
python manage_documents.py show supply_chain.txt

# Delete a specific document
python manage_documents.py delete supply_chain.txt

# Delete all documents in a category
python manage_documents.py delete-category dev_setup

# Show statistics
python manage_documents.py stats
```

### Method 2: Using API Endpoints Directly

#### List All Documents

```bash
curl http://localhost:8000/api/documents/list
```

Response:
```json
{
  "total_documents": 3,
  "total_chunks": 45,
  "documents": [
    {
      "filename": "supply_chain.txt",
      "category": "supply_chain",
      "total_chunks": 15,
      "chunk_count": 15
    },
    {
      "filename": "dev_setup.txt",
      "category": "dev_setup",
      "total_chunks": 20,
      "chunk_count": 20
    }
  ]
}
```

#### Get Document Details

```bash
curl http://localhost:8000/api/documents/supply_chain.txt
```

Response:
```json
{
  "filename": "supply_chain.txt",
  "category": "supply_chain",
  "total_chunks": 15,
  "chunk_ids": ["supply_chain.txt_supply_chain_0", "supply_chain.txt_supply_chain_1", ...],
  "sample_chunk": "Supply Chain Fundamentals and Project44 Company Information..."
}
```

#### Delete a Specific Document

```bash
curl -X DELETE http://localhost:8000/api/documents/supply_chain.txt
```

Response:
```json
{
  "status": "success",
  "message": "Document 'supply_chain.txt' deleted successfully",
  "chunks_deleted": 15
}
```

#### Delete by Category

```bash
curl -X DELETE http://localhost:8000/api/documents/category/dev_setup
```

Response:
```json
{
  "status": "success",
  "message": "All documents in category 'dev_setup' deleted successfully",
  "documents_deleted": 2,
  "chunks_deleted": 35
}
```

#### Delete All Documents

⚠️ **Warning**: This deletes ALL documents!

```bash
curl -X DELETE "http://localhost:8000/api/documents?confirm=true"
```

#### Get Statistics

```bash
curl http://localhost:8000/api/documents/stats
```

Response:
```json
{
  "total_chunks": 45,
  "collection_name": "learn44_documents",
  "status": "healthy"
}
```

### Method 3: Using Swagger UI

1. Start your backend server
2. Navigate to `http://localhost:8000/docs`
3. Find the document management endpoints:
   - `GET /api/documents/list` - List all documents
   - `GET /api/documents/{filename}` - Get document details
   - `DELETE /api/documents/{filename}` - Delete a document
   - `DELETE /api/documents/category/{category}` - Delete by category
   - `DELETE /api/documents` - Delete all documents
4. Click "Try it out" and execute the requests

## Understanding Document Structure

When you upload a document, it's processed as follows:

1. **Text Extraction**: The document is read and text is extracted
2. **Chunking**: The text is split into smaller chunks (default: 1000 characters with 200 character overlap)
3. **Embedding**: Each chunk is converted to a vector embedding
4. **Storage**: Chunks are stored in ChromaDB with metadata

**Example:**
- Document: `supply_chain.txt` (10,000 characters)
- Chunks created: ~10 chunks (depending on content)
- Each chunk has: ID, text, embedding, metadata

## Common Use Cases

### Check What Documents Are Loaded

```bash
python manage_documents.py list
```

### Remove a Specific Document

```bash
python manage_documents.py delete supply_chain.txt
```

### Remove All Documents in a Category

```bash
python manage_documents.py delete-category dev_setup
```

### Start Fresh (Delete Everything)

```bash
python manage_documents.py delete-all
# Type 'DELETE ALL' when prompted
```

### Check Document Details Before Deleting

```bash
python manage_documents.py show supply_chain.txt
```

## Notes

- **Document IDs**: Documents are identified by their filename (as stored in metadata)
- **Categories**: Documents are organized by category (e.g., `dev_setup`, `supply_chain`, `onboarding`)
- **Chunks**: Each document is split into multiple chunks for better retrieval
- **Permanent**: Deletions are permanent - make sure you want to delete before confirming
- **Re-upload**: You can always re-upload a document after deleting it

## Troubleshooting

### "Document not found" Error

- Check the exact filename (case-sensitive)
- Use `list` command to see all available documents
- Verify the document was uploaded successfully

### "Connection Error"

- Make sure the backend server is running on `http://localhost:8000`
- Check if the server started successfully
- Verify the API_BASE_URL in the script matches your server

### "Cannot delete" Error

- Make sure the server is running
- Check if you have the correct filename
- Verify the document exists using the `list` command

## Best Practices

1. **Regular Cleanup**: Periodically review and remove outdated documents
2. **Category Management**: Use consistent categories for easier management
3. **Backup**: Before deleting, ensure you have the original files
4. **Test First**: Use `show` command to verify before deleting
5. **Document Names**: Use descriptive filenames for easier identification

---

*For questions or issues, check the server logs or contact the development team.*

