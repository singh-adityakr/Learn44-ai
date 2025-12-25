#!/bin/bash
# Script to upload all documents from the documents/ folder

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

API_URL="http://localhost:8000/api/documents/upload"
DOCUMENTS_DIR="server/documents"

echo "📁 Uploading documents from $DOCUMENTS_DIR..."

# Check if backend is running
if ! curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${RED}❌ Backend is not running!${NC}"
    echo "Start it with: cd server && source venv/bin/activate && python main.py"
    exit 1
fi

# Function to upload a file
upload_file() {
    local file=$1
    local category=$2
    
    echo -e "${YELLOW}📄 Uploading: $(basename $file) (category: $category)${NC}"
    
    response=$(curl -s -X POST "$API_URL" \
        -F "file=@$file" \
        -F "category=$category")
    
    if echo "$response" | grep -q "success"; then
        echo -e "${GREEN}✅ Successfully uploaded: $(basename $file)${NC}"
    else
        echo -e "${RED}❌ Failed to upload: $(basename $file)${NC}"
        echo "Response: $response"
    fi
}

# Upload files based on filename patterns or directory structure
if [ -d "$DOCUMENTS_DIR" ]; then
    # Upload all .txt files
    for file in "$DOCUMENTS_DIR"/*.txt; do
        if [ -f "$file" ]; then
            # Determine category from filename
            filename=$(basename "$file" .txt)
            category="general"
            
            if [[ "$filename" == *"dev"* ]] || [[ "$filename" == *"setup"* ]] || [[ "$filename" == *"install"* ]]; then
                category="dev_setup"
            elif [[ "$filename" == *"supply"* ]] || [[ "$filename" == *"chain"* ]]; then
                category="supply_chain"
            elif [[ "$filename" == *"culture"* ]] || [[ "$filename" == *"company"* ]]; then
                category="company_culture"
            elif [[ "$filename" == *"team"* ]] || [[ "$filename" == *"member"* ]]; then
                category="teams"
            fi
            
            upload_file "$file" "$category"
        fi
    done
    
    # Upload all .md files
    for file in "$DOCUMENTS_DIR"/*.md; do
        if [ -f "$file" ]; then
            filename=$(basename "$file" .md)
            category="general"
            
            if [[ "$filename" == *"dev"* ]] || [[ "$filename" == *"setup"* ]]; then
                category="dev_setup"
            elif [[ "$filename" == *"supply"* ]]; then
                category="supply_chain"
            elif [[ "$filename" == *"culture"* ]]; then
                category="company_culture"
            fi
            
            upload_file "$file" "$category"
        fi
    done
    
    # Upload all .pdf files
    for file in "$DOCUMENTS_DIR"/*.pdf; do
        if [ -f "$file" ]; then
            upload_file "$file" "general"
        fi
    done
    
    echo ""
    echo -e "${GREEN}✅ Upload complete!${NC}"
    echo "Check stats: curl http://localhost:8000/api/documents/stats"
else
    echo -e "${RED}❌ Documents directory not found: $DOCUMENTS_DIR${NC}"
    exit 1
fi

