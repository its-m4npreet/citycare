# Fix for 500 Error on My Reports Page

## Error
```
GET http://localhost:5000/api/issues/user/user_3446t1Y8Kv9sjJZCbRi6EI6K9tc 500 (Internal Server Error)
Error fetching user issues
```

## Root Causes

### 1. Coordinate Format Mismatch
**Problem:**
- Frontend sends: `{ lat: number, lng: number }`
- Backend model expects: `{ latitude: number, longitude: number }`

**Impact:** This could cause validation errors when creating/fetching issues

### 2. Missing Error Logging
The backend wasn't logging enough details to debug the 500 error

## Fixes Applied

### 1. Updated Backend Coordinate Handling (`backend/controllers/issueController.js`)

**Before:**
```javascript
let parsedCoordinates = {};
if (coordinates) {
  if (typeof coordinates === 'string') {
    parsedCoordinates = JSON.parse(coordinates);
  } else {
    parsedCoordinates = coordinates;
  }
}
```

**After:**
```javascript
let parsedCoordinates = {};
if (coordinates) {
  if (typeof coordinates === 'string') {
    const parsed = JSON.parse(coordinates);
    // Convert lat/lng to latitude/longitude format
    parsedCoordinates = {
      latitude: parsed.lat || parsed.latitude,
      longitude: parsed.lng || parsed.longitude
    };
  } else {
    // Convert lat/lng to latitude/longitude format
    parsedCoordinates = {
      latitude: coordinates.lat || coordinates.latitude,
      longitude: coordinates.lng || coordinates.longitude
    };
  }
}
```

### 2. Added Enhanced Logging to `getUserIssues`

```javascript
exports.getUserIssues = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { status } = req.query;

    console.log('🔍 getUserIssues - clerkId:', clerkId);
    console.log('🔍 getUserIssues - status filter:', status);

    const filter = { clerkId };
    if (status) filter.status = status;

    console.log('🔍 Query filter:', JSON.stringify(filter, null, 2));

    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 });

    console.log('✅ Found issues:', issues.length);

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    console.error('❌ Error in getUserIssues:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching user issues',
      error: error.message
    });
  }
};
```

## How to Fix (IMPORTANT STEPS)

### Step 1: Restart Backend Server

The backend code has been updated, but you need to restart the server:

**Option A: If backend is running in a terminal**
1. Go to the backend terminal
2. Press `Ctrl+C` to stop it
3. Run: `npm start`

**Option B: If backend is running in background**
```powershell
# Find the Node process
Get-Process node | Where-Object {$_.Path -like "*backend*"}

# Kill it (replace XXXX with the actual PID)
Stop-Process -Id XXXX -Force

# Start backend again
cd "c:\Users\HP\Documents\copy Hackathon\backend"
npm start
```

### Step 2: Refresh Frontend

After backend restarts:
1. Refresh your browser (F5 or Ctrl+R)
2. Navigate to "My Reports" page
3. Check browser console for logs

## Expected Behavior After Fix

### Backend Console Should Show:
```
🔍 getUserIssues - clerkId: user_3446t1Y8Kv9sjJZCbRi6EI6K9tc
🔍 getUserIssues - status filter: undefined
🔍 Query filter: {
  "clerkId": "user_3446t1Y8Kv9sjJZCbRi6EI6K9tc"
}
✅ Found issues: X
```

### Frontend Should:
- ✅ Load without 500 error
- ✅ Display user's reports
- ✅ Show "No reports yet" if user has no issues

## Verification Steps

1. **Check Backend is Running:**
   ```powershell
   Get-Process node
   ```
   Should show node processes running

2. **Test the API Directly:**
   Open browser and go to:
   ```
   http://localhost:5000/api/issues/user/user_3446t1Y8Kv9sjJZCbRi6EI6K9tc
   ```
   Should return JSON with issues array

3. **Check Backend Logs:**
   Backend console should show the 🔍 logs when you visit My Reports

4. **Check Frontend:**
   My Reports page should load without errors

## Additional Issues to Check

### If Still Getting 500 Error:

1. **Check MongoDB Connection:**
   Backend should show: `✅ MongoDB Connected: ...`
   
   If not, check:
   - Is MongoDB Atlas accessible?
   - Is your IP whitelisted?
   - Is MONGODB_URI in .env correct?

2. **Check if User Exists:**
   The error might be because the user doesn't exist in database yet
   
   Solution: Sign out and sign in again to sync user to database

3. **Check Backend .env:**
   ```
   MONGODB_URI=mongodb+srv://...
   PORT=5000
   NODE_ENV=development
   ```

## Files Modified

1. ✅ `backend/controllers/issueController.js`
   - Fixed coordinate format conversion (lat/lng → latitude/longitude)
   - Added enhanced logging to getUserIssues

## Technical Details

### Coordinate Format Mapping

| Frontend Format | Backend Model Format |
|----------------|---------------------|
| `lat` | `latitude` |
| `lng` | `longitude` |

The backend now automatically converts between these formats.

### Issue Model Schema
```javascript
location: {
  address: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  }
}
```

### API Response Format
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "title": "Issue Title",
      "clerkId": "user_...",
      "location": {
        "address": "...",
        "coordinates": {
          "latitude": 31.481921,
          "longitude": 75.959285
        }
      },
      ...
    }
  ]
}
```

## Common Errors and Solutions

### Error: "Cannot read property 'length' of undefined"
**Cause:** Backend returned undefined instead of array
**Solution:** Check backend logs for actual error

### Error: "User not found"
**Cause:** User not synced to database
**Solution:** Sign out and sign in again

### Error: "Network Error"
**Cause:** Backend server not running
**Solution:** Start backend: `cd backend && npm start`

### Error: "CORS Error"
**Cause:** Backend CORS not configured
**Solution:** Already configured in server.js with `app.use(cors())`

## Success Criteria

✅ Backend starts without errors  
✅ MongoDB connection established  
✅ GET /api/issues/user/:clerkId returns 200  
✅ My Reports page loads without 500 error  
✅ Backend logs show 🔍 and ✅ messages  
✅ Issues are displayed correctly  

## Next Steps

1. **Restart backend server** (most important!)
2. Refresh frontend
3. Check console logs
4. Report any remaining errors with backend console output

---

**Remember:** The backend MUST be restarted for these changes to take effect!
