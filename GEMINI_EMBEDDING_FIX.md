# Fix: Gemini Embedding Quota Exceeded

## Problem

Google Gemini's **free tier does NOT support embedding API calls**. You're getting:
```
Quota exceeded for metric: embed_content_free_tier_requests, limit: 0
```

The free tier has **zero quota** for embeddings.

## Solution: Use OpenAI Embeddings

Since Gemini free tier doesn't support embeddings, use OpenAI for embeddings while keeping Gemini for the LLM.

### Step 1: Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it

### Step 2: Update `.env` File

Edit `server/.env` and add:

```env
# Keep Gemini for LLM
GOOGLE_API_KEY=your-google-api-key-here
GEMINI_MODEL=gemini-1.5-flash

# Use OpenAI for embeddings
USE_OPENAI_EMBEDDINGS=true
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

### Step 3: Restart Backend

```bash
# Stop current server (Ctrl+C)
cd server
source venv/bin/activate
python main.py
```

### Step 4: Try Uploading Again

```bash
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@server/documents/dev_setup.txt" \
  -F "category=dev_setup"
```

## Alternative: Use Local Embeddings (Free, No API Needed)

If you don't want to use OpenAI, you can use a local embedding model:

### Option: Use sentence-transformers (Local)

This uses a local model - no API calls needed!

1. Install additional dependency:
```bash
cd server
source venv/bin/activate
pip install sentence-transformers
```

2. Update `server/llm_rag/document_processor.py` to use local embeddings (I can help with this)

## Why This Happens

- **Gemini Free Tier**: No embedding API access (limit: 0)
- **Gemini Paid Tier**: Has embedding access
- **OpenAI**: Free tier includes embedding API access
- **Local Models**: Free, but slower and uses more memory

## Recommended Setup

**Best for development:**
- LLM: Gemini (free tier works fine)
- Embeddings: OpenAI (free tier includes embeddings)

**Best for production:**
- LLM: Gemini Pro (paid)
- Embeddings: OpenAI or local sentence-transformers

## Cost Comparison

- **OpenAI Embeddings**: ~$0.0001 per 1K tokens (very cheap)
- **Gemini Embeddings**: Requires paid tier
- **Local Embeddings**: Free, but slower

For your use case, OpenAI embeddings are the best option!

