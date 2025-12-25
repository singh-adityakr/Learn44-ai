# Python Version Compatibility Fix

## Problem

Python 3.14 is too new - ChromaDB (our vector database) requires Python <3.13. You'll see errors like:

```
ERROR: Could not find a version that satisfies the requirement onnxruntime>=1.14.1
ERROR: No matching distribution found for onnxruntime>=1.14.1
```

## Solution: Install Python 3.12

### Step 1: Install Python 3.12

```bash
brew install python@3.12
```

### Step 2: Remove old virtual environment

```bash
cd server
rm -rf venv
```

### Step 3: Create new virtual environment with Python 3.12

```bash
python3.12 -m venv venv
```

### Step 4: Activate and install dependencies

```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Step 5: Verify Python version

```bash
python --version
# Should show: Python 3.12.x
```

## Alternative: Use pyenv (Recommended for managing multiple Python versions)

If you want to easily switch between Python versions:

```bash
# Install pyenv
brew install pyenv

# Install Python 3.12
pyenv install 3.12.8

# Set local Python version for this project
cd server
pyenv local 3.12.8

# Now python3 will use 3.12.8
python3 --version  # Should show 3.12.8

# Create virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Quick Fix Script

Run this in the `server/` directory:

```bash
# Remove old venv
rm -rf venv

# Create with Python 3.12
python3.12 -m venv venv

# Activate and install
source venv/bin/activate
pip install -r requirements.txt

# Start server
python main.py
```

## Why Python 3.12?

- ChromaDB supports Python 3.9-3.12
- Python 3.12 is stable and well-tested
- All our dependencies work with Python 3.12
- It's the latest supported version for ChromaDB

## Verify Installation

After setup, verify everything works:

```bash
cd server
source venv/bin/activate
python --version  # Should be 3.12.x
python -c "import chromadb; print('ChromaDB OK')"
python -c "import fastapi; print('FastAPI OK')"
```

