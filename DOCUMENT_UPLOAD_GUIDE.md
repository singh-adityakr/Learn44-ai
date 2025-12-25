# Document Upload Guide

## Where to Place Documents

Place your documents in the `server/documents/` folder:

```
server/
├── documents/              ← Put your files here!
│   ├── supply_chain.txt
│   ├── company_culture.md
│   ├── dev_setup.txt
│   └── teams.pdf
├── main.py
└── ...
```

**Supported file types:**
- `.txt` - Plain text files
- `.md` - Markdown files
- `.pdf` - PDF documents
- `.docx` - Word documents

## Method 1: Upload via API (Recommended)

### Using curl

```bash
# Upload a single document
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@server/documents/your-file.txt" \
  -F "category=dev_setup"
```

### Using Swagger UI (Easiest!)

1. Start your backend: `python main.py`
2. Open browser: http://localhost:8000/docs
3. Find `/api/documents/upload` endpoint
4. Click "Try it out"
5. Click "Choose File" and select your document
6. Enter category in the `category` field
7. Click "Execute"

### Upload Multiple Files

```bash
curl -X POST "http://localhost:8000/api/documents/batch-upload" \
  -F "files=@server/documents/file1.txt" \
  -F "files=@server/documents/file2.md" \
  -F "category=supply_chain"
```

## Method 2: Use the Ingest Script

For bulk uploads from the `documents/` folder:

```bash
cd server
source venv/bin/activate

# Ingest all files from a directory
python ingest_documents.py server/documents dev_setup

# Ingest a single file
python ingest_documents.py server/documents/dev_setup.txt dev_setup
```

## Document Categories

Use these categories when uploading:

| Category | Use For |
|----------|---------|
| `supply_chain` | Supply chain domain knowledge, terminology, concepts |
| `company_culture` | Company values, culture, mission, vision |
| `teams` | Team information, member bios, org structure |
| `dev_setup` | Developer environment setup (Homebrew, JDK, IntelliJ, Cursor, etc.) |
| `general` | Other documentation, general knowledge |

**Example:**
```bash
# Supply chain documents
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@server/documents/supply_chain_glossary.txt" \
  -F "category=supply_chain"

# Company culture
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@server/documents/company_values.md" \
  -F "category=company_culture"

# Developer setup guides
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@server/documents/dev_setup.txt" \
  -F "category=dev_setup"
```

## Verify Documents Are Uploaded

Check how many documents are in your database:

```bash
curl http://localhost:8000/api/documents/stats
```

Should return something like:
```json
{
  "total_chunks": 150,
  "collection_name": "learn44_documents",
  "status": "healthy"
}
```

## Organizing Your Documents

### Recommended Structure

```
server/documents/
├── supply_chain/
│   ├── glossary.txt
│   ├── concepts.pdf
│   └── terminology.md
├── company_culture/
│   ├── values.txt
│   └── mission.md
├── teams/
│   ├── org_chart.pdf
│   └── members.txt
└── dev_setup/
    ├── homebrew.txt
    ├── jdk_setup.txt
    ├── intellij.txt
    └── cursor.txt
```

Then upload by category:
```bash
# Upload all supply chain docs
for file in server/documents/supply_chain/*; do
  curl -X POST "http://localhost:8000/api/documents/upload" \
    -F "file=@$file" \
    -F "category=supply_chain"
done
```

## Tips for Best Results

1. **Use descriptive filenames** - They'll appear as sources in responses
   - Good: `homebrew_installation_guide.txt`
   - Bad: `doc1.txt`

2. **Organize by category** - Makes it easier to manage and query

3. **Keep documents focused** - One topic per document works best

4. **Use clear headings** - Markdown headings help with chunking

5. **Upload related documents together** - The RAG system will find connections

## Example: Upload Your Existing dev_setup.txt

```bash
# From the project root
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@server/documents/dev_setup.txt" \
  -F "category=dev_setup"
```

## Troubleshooting

**"Document processor not initialized"**
- Make sure backend is running: `python main.py`
- Check that RAG pipeline started successfully

**"No chunks created"**
- File might be empty or unreadable
- Check file encoding (should be UTF-8)

**Documents not appearing in responses**
- Upload documents first before asking questions
- Check stats: `curl http://localhost:8000/api/documents/stats`
- Try rephrasing your question

## Next Steps

1. Upload your documents using one of the methods above
2. Verify upload: `curl http://localhost:8000/api/documents/stats`
3. Test in chat: Ask a question related to your documents
4. Check sources: The chat will show which documents were used

