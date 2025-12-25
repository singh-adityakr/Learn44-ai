# Migration to Google Gemini

The system has been updated to use **Google Gemini** instead of OpenAI. Here's what changed:

## Changes Made

### 1. Dependencies Updated
- Added `google-generativeai` and `langchain-google-genai`
- Kept OpenAI packages as optional (for embedding fallback)

### 2. Configuration Changes

**Old (OpenAI):**
```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
```

**New (Gemini):**
```env
GOOGLE_API_KEY=your-google-api-key
GEMINI_MODEL=gemini-1.5-flash
EMBEDDING_MODEL=models/embedding-001
```

### 3. Code Changes

- `rag_pipeline.py`: Now uses `ChatGoogleGenerativeAI` instead of `ChatOpenAI`
- `document_processor.py`: Uses `GoogleGenerativeAIEmbeddings` by default
- `config.py`: Updated to use Gemini settings

### 4. Optional: OpenAI Embeddings

If you prefer OpenAI embeddings (sometimes better quality), you can set:

```env
USE_OPENAI_EMBEDDINGS=true
OPENAI_API_KEY=sk-...
```

This allows you to use Gemini for LLM but OpenAI for embeddings.

## Getting Your Google API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env` file

## Available Gemini Models

- `gemini-1.5-flash` (default) - Fast and efficient
- `gemini-1.5-pro` - More capable, slower
- `gemini-pro` - Previous generation

Update `GEMINI_MODEL` in `.env` to switch models.

## Benefits of Gemini

- **Cost-effective**: Often cheaper than OpenAI
- **Fast**: Gemini Flash is very fast
- **Good quality**: Excellent for RAG applications
- **Long context**: Supports large context windows

## Migration Steps

1. **Update dependencies:**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

2. **Update `.env` file:**
   ```bash
   cp .env.example .env
   # Add GOOGLE_API_KEY=your-key-here
   ```

3. **Restart the server:**
   ```bash
   python main.py
   ```

That's it! The system will now use Gemini for all LLM operations.

## Troubleshooting

**Error: "GOOGLE_API_KEY not found"**
- Make sure you've set `GOOGLE_API_KEY` in your `.env` file
- Restart the server after updating `.env`

**Poor embedding quality?**
- Try setting `USE_OPENAI_EMBEDDINGS=true` to use OpenAI embeddings
- Make sure you have `OPENAI_API_KEY` set if using this option

**Model not found?**
- Check that your API key has access to the model
- Try `gemini-pro` if `gemini-1.5-flash` doesn't work
- Verify your Google Cloud project has the API enabled

