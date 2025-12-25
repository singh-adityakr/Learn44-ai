# Frontend-Backend Connection Troubleshooting

## Quick Check

1. **Is the backend running?**
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"healthy","message":"Service is operational"}`

2. **Is the frontend running?**
   - Should be at `http://localhost:5173`
   - Check browser console (F12) for connection errors

3. **Check CORS**
   - Backend allows: `http://localhost:5173`
   - Frontend calls: `http://localhost:8000/api/chat`

## Common Issues

### Issue 1: Backend Not Running
**Symptoms:** Frontend shows "trouble connecting to server"

**Fix:**
```bash
cd server
source venv/bin/activate
python main.py
```

### Issue 2: Wrong Port
**Symptoms:** Connection refused errors

**Check:**
- Backend should be on port 8000
- Frontend should be on port 5173 (Vite default)
- Check `server/main.py` for CORS origins
- Check `client/src/components/chat-interface.tsx` for API_BASE_URL

### Issue 3: CORS Errors
**Symptoms:** Browser console shows CORS policy errors

**Fix:**
- Make sure backend CORS includes your frontend URL
- Check `server/main.py` line 28-34
- Add your frontend URL to `allow_origins` list

### Issue 4: API Endpoint Mismatch
**Symptoms:** 404 errors

**Check:**
- Frontend calls: `/api/chat`
- Backend endpoint: `@app.post("/api/chat")`
- Should match exactly

## Testing the Connection

### Test Backend Directly
```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "conversation_id": "test"}'
```

### Test from Browser Console
Open browser console (F12) and run:
```javascript
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

### Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Send a message from the chat
4. Look for request to `http://localhost:8000/api/chat`
5. Check:
   - Status code (should be 200)
   - Response body
   - CORS headers

## Debugging Steps

1. **Check backend logs**
   - Look at terminal where `python main.py` is running
   - Should see request logs

2. **Check browser console**
   - Look for JavaScript errors
   - Check Network tab for failed requests

3. **Verify environment**
   - Backend: `GOOGLE_API_KEY` set in `.env`?
   - Frontend: `VITE_API_URL` set? (optional, defaults to localhost:8000)

4. **Test endpoints individually**
   ```bash
   # Health check
   curl http://localhost:8000/health
   
   # Chat endpoint
   curl -X POST http://localhost:8000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"test"}'
   ```

## Expected Behavior

When working correctly:
1. Frontend sends POST to `http://localhost:8000/api/chat`
2. Backend receives request and processes with RAG pipeline
3. Backend returns JSON: `{response: "...", sources: [...], conversation_id: "..."}`
4. Frontend displays the response

## Still Not Working?

1. Check that both servers are running
2. Verify ports are correct (8000 for backend, 5173 for frontend)
3. Check browser console for specific error messages
4. Check backend terminal for error logs
5. Try restarting both servers

