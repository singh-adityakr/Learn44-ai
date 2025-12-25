# Free Embeddings Setup (No API Costs!)

## Problem

- **Gemini Free Tier**: No embedding quota (limit: 0) ❌
- **OpenAI**: Not free (but very cheap ~$0.0001/1K tokens) 💰

## Solution: Use Local Embeddings (100% FREE!)

I've updated the code to use **local embeddings** by default. This uses `sentence-transformers` which runs entirely on your machine - **no API calls, no costs!**

## How It Works

The system now uses `all-MiniLM-L6-v2` model which:
- ✅ **100% FREE** - No API calls needed
- ✅ **Runs locally** - Everything on your machine
- ✅ **Good quality** - Works great for RAG
- ✅ **Fast** - Processes embeddings quickly
- ⚠️ **First run**: Downloads model (~80MB, one-time)

## Setup (Already Done!)

The code is already configured to use local embeddings by default. Just restart your server:

```bash
cd server
source venv/bin/activate
python main.py
```

You should see:
```
📦 Loading local embedding model: all-MiniLM-L6-v2
✅ Using local embeddings (free, no API calls)
```

## Configuration Options

### Option 1: Local Embeddings (Default - FREE)

In `server/.env`:
```env
USE_LOCAL_EMBEDDINGS=true
LOCAL_EMBEDDING_MODEL=all-MiniLM-L6-v2
```

**Models available:**
- `all-MiniLM-L6-v2` - Fast, good quality (recommended)
- `all-mpnet-base-v2` - Better quality, slower
- `paraphrase-MiniLM-L6-v2` - Good for semantic search

### Option 2: OpenAI Embeddings (If you want)

If you prefer OpenAI (very cheap, but not free):
```env
USE_LOCAL_EMBEDDINGS=false
USE_OPENAI_EMBEDDINGS=true
OPENAI_API_KEY=sk-your-key-here
```

### Option 3: Gemini Embeddings (Paid Only)

Only if you have a paid Gemini account:
```env
USE_LOCAL_EMBEDDINGS=false
USE_GEMINI_EMBEDDINGS=true
GOOGLE_API_KEY=your-key-here
```

## Cost Comparison

| Option | Cost | Quality | Speed |
|--------|------|---------|-------|
| **Local (sentence-transformers)** | **FREE** ✅ | Good | Fast |
| OpenAI | ~$0.0001/1K tokens | Excellent | Very Fast |
| Gemini (Paid) | Paid tier only | Excellent | Very Fast |
| Gemini (Free) | ❌ Not available | N/A | N/A |

## First Run

On first run, the model will download automatically:
```
Downloading model: all-MiniLM-L6-v2
Downloading: 100%|██████████| 80.3M/80.3M [00:15<00:00, 5.2MB/s]
```

This is a one-time download (~80MB). After that, it's cached locally.

## Try It Now!

1. **Restart your backend:**
   ```bash
   cd server
   source venv/bin/activate
   python main.py
   ```

2. **Upload a document:**
   ```bash
   curl -X POST "http://localhost:8000/api/documents/upload" \
     -F "file=@server/documents/dev_setup.txt" \
     -F "category=dev_setup"
   ```

3. **It should work!** No API costs, no quota limits! 🎉

## Performance

- **First document**: May take 10-30 seconds (model loading + processing)
- **Subsequent documents**: Much faster (model already loaded)
- **Query speed**: Very fast (<1 second)

## Troubleshooting

**Model download fails?**
- Check internet connection
- Try manually: `python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"`

**Out of memory?**
- Use smaller model: `all-MiniLM-L6-v2` (default)
- Or reduce chunk size in `.env`: `CHUNK_SIZE=500`

**Want better quality?**
- Use OpenAI embeddings (very cheap)
- Or use larger local model: `all-mpnet-base-v2` (slower but better)

## Summary

✅ **Local embeddings are now the default**  
✅ **100% FREE - no API costs**  
✅ **Works immediately**  
✅ **Good quality for RAG**

Just restart your server and try uploading documents!

