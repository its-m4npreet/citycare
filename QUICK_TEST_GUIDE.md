# 🚀 Quick Start - Test Database Storage

## Step-by-Step Testing Guide

### 1️⃣ Test Database Connection (30 seconds)

```bash
cd backend
node testDatabase.js
```

**Should show:**
```
✅ MongoDB Connected: cluster0-shard-00-02.qf8cytb.mongodb.net
📊 Database: citycare
📂 Available collections: users, issues
📊 Document counts: Users: X, Issues: Y
```

**If it fails** → Check MongoDB Atlas credentials in `backend/.env`

---

### 2️⃣ Start Backend Server

```bash
cd backend
npm start
```

**Should show:**
```
✅ MongoDB Connected
📊 Database: citycare  
🚀 Server running on port 5000
```

**Leave this terminal open** and watch for logs!

---

### 3️⃣ Start Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

**Should show:**
```
Local: http://localhost:5173/
```

---

### 4️⃣ Test Issue Creation

1. **Open browser**: http://localhost:5173
2. **Open Console** (Press F12 → Console tab)
3. **Sign in** with your account
4. **Watch console** - Should see: `"User synced to database: {...}"`
5. **Go to**: Report New Issue
6. **Fill form**:
   - Title: **Test Database Issue**
   - Category: **Potholes**
   - Description: **Testing if issues save to MongoDB**
   - Location: **Test Location**
   - Urgency: **Medium**
7. **Click**: Submit Report

---

### 5️⃣ Check Logs

#### In Browser Console (F12):
```
📝 Submitting issue data: {...}
🚀 Sending request to backend...
✅ Backend response: { _id: "67f8...", ... }
```

#### In Backend Terminal:
```
Creating issue with data: {...}
✅ Issue created successfully: 67f8a9b2c3d4e5f6g7h8i9j0
✅ User stats updated
POST /api/issues 201 234ms
```

---

### 6️⃣ Verify Storage (Back to Terminal)

```bash
# In backend folder
node testDatabase.js
```

**Should now show:**
```
📊 Document counts:
  - Issues: 1  ← INCREASED! ✅

📋 Sample issues:
  - Test Database Issue (pending) - 2025-10-15...
```

---

## ✅ Success Checklist

- [ ] `testDatabase.js` shows MongoDB connected
- [ ] Backend server running without errors
- [ ] Frontend running on localhost
- [ ] User signed in and synced to database
- [ ] Issue creation shows success alert with ID
- [ ] Browser console shows ✅ Backend response
- [ ] Backend terminal shows ✅ Issue created successfully
- [ ] `testDatabase.js` shows increased issue count
- [ ] Issue appears in My Reports page
- [ ] Issue appears in Dashboard page

---

## 🐛 Quick Troubleshooting

### Backend won't start?
```bash
cd backend
npm install
npm start
```

### Frontend won't start?
```bash
cd frontend
npm install
npm run dev
```

### MongoDB connection fails?
1. Check `backend/.env` file exists
2. Verify `MONGODB_URI` is correct
3. Check MongoDB Atlas cluster is running
4. Whitelist your IP in MongoDB Atlas

### User not synced?
1. Refresh browser (Ctrl+R)
2. Sign out and sign in again
3. Check browser console for errors
4. Verify `VITE_API_URL` in `frontend/.env`

### Issue not saving?
1. Check backend terminal for errors
2. Check browser console for errors
3. Verify all form fields are filled
4. Try running `testDatabase.js` to check connection

---

## 📊 What to Watch

### Backend Terminal:
```
✅ = Success
❌ = Error
📊 = Database info
🚀 = Server info
```

### Browser Console:
```
📝 = Data being sent
🚀 = Request sent
✅ = Success response
❌ = Error
```

---

## 🎯 Expected Result

After creating an issue:
1. ✅ Success alert appears
2. ✅ Redirected to My Reports
3. ✅ Issue visible in My Reports
4. ✅ Issue visible in Dashboard
5. ✅ Issue stored in MongoDB (verify with `testDatabase.js`)

---

**Status**: Ready to test! Run the steps above to verify everything works. 🚀
