# Fix: Gemini Model Not Found Error

## Problem

Error: `404 models/gemini-1.5-flash is not found for API version v1beta`

The model name `gemini-1.5-flash` is not available in the free tier or needs a different format.

## Solution

I've updated the default model to `gemini-pro` which is available in the free tier.

## Available Gemini Models

### Free Tier Models:
- `gemini-pro` ✅ (Default - works with free tier)
- `gemini-pro-vision` (for image inputs)

### Paid Tier Models:
- `gemini-1.5-pro` (requires paid account)
- `gemini-1.5-flash` (requires paid account)

## Configuration

The code now defaults to `gemini-pro`. To change it, update `server/.env`:

```env
# Free tier (default)
GEMINI_MODEL=gemini-pro

# Or if you have paid tier:
# GEMINI_MODEL=gemini-1.5-pro
# GEMINI_MODEL=gemini-1.5-flash
```

## Restart Required

After updating, restart your backend:

```bash
cd server
source venv/bin/activate
python main.py
```

You should see:
```
✅ Using Gemini model: gemini-pro
✅ RAG pipeline initialized successfully
```

## Model Comparison

| Model | Tier | Speed | Quality | Context |
|-------|------|-------|---------|---------|
| `gemini-pro` | Free | Fast | Good | 32K tokens |
| `gemini-1.5-pro` | Paid | Medium | Excellent | 1M+ tokens |
| `gemini-1.5-flash` | Paid | Very Fast | Good | 1M+ tokens |

For most use cases, `gemini-pro` works great and is free!

