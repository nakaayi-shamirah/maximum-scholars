# 🎓 Maximum Scholars - Backend & Frontend Connection Summary

## ✅ What's Been Set Up

### 1. **Environment Configuration**
- ✅ Backend `.env` file created with all configuration options
- ✅ Frontend `.env.local` file created with API URL configuration
- ✅ CORS properly configured in backend
- ✅ Development environment ready

### 2. **API Service Layer**
- ✅ Centralized API service created at `frontend/src/services/api.js`
- ✅ All API endpoints organized by module (auth, user, materials, etc.)
- ✅ Automatic JWT token handling
- ✅ Error handling and logging built-in
- ✅ Environment-based URL configuration

### 3. **Frontend Updates**
- ✅ Login.js updated to use API service instead of hardcoded URL
- ✅ Removed hardcoded API URLs (`https://maximum-scholars-1-api.onrender.com`)
- ✅ Clean, reusable API integration pattern established

### 4. **Documentation**
- ✅ Complete setup guide (`SETUP_GUIDE.md`)
- ✅ API integration guide with examples (`API_INTEGRATION_GUIDE.md`)
- ✅ Quick start scripts for Windows and Linux/Mac

### 5. **Dev Scripts**
- ✅ `start-dev.bat` - One-click start for Windows
- ✅ `start-dev.sh` - Start script for Linux/Mac

---

## 🚀 Quick Start Guide

### Local Development (http://localhost:3000)

**On Windows:**
```bash
# Option 1: Click and Run (Easiest)
# Double-click: start-dev.bat

# Option 2: Command Line
# Open PowerShell in project root and run:
.\start-dev.bat
```

**On Mac/Linux:**
```bash
# Make script executable
chmod +x start-dev.sh

# Run the script
./start-dev.sh
```

**Manual Start (Both Platforms):**
```bash
# Terminal 1: Start Backend
cd backend
npm install
npm start

# Terminal 2: Start Frontend
cd frontend
npm install
npm start
```

### Production Deployment (Render)

See **[RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)** for complete Render deployment steps.

**Quick Summary:**
1. Push both backend and frontend to GitHub
2. Create Web Service for backend on Render
3. Create Static Site for frontend on Render
4. Set environment variables in Render dashboard
5. Wait for auto-deployment
6. Visit your Render URLs

---

## 📋 What Still Needs to Be Updated

The following pages should be updated to use the new API service. Here's a checklist:

### Priority 1 (Critical)
- [ ] **Register.js** - Update registration API call
- [ ] **Dashboard.js** - Update to fetch materials and user data
- [ ] **Payment.js** - Update payment API integration

### Priority 2 (Important)
- [ ] **Subjects.js** - Update to fetch materials by subject
- [ ] **LiveClasses.js** - Update to fetch and join classes
- [ ] **Admin.js** - Update to fetch admin stats and user management
- [ ] **Teacher.js** - Update teacher-specific data fetching

### Priority 3 (Enhancement)
- [ ] **Profile.js** - Update profile fetch and update
- [ ] **student.js** - Update student-specific features
- [ ] **NotFound.js** - Already static, no updates needed
- [ ] **Landing.js** - May need stats from backend

---

## 🔄 How to Update a Page

### Step 1: Import the API service
```javascript
import { materialsAPI } from "../services/api";  // or whichever module you need
```

### Step 2: Replace fetch calls
**Before:**
```javascript
const res = await fetch(`${API}/api/materials`, {
  headers: { "Authorization": `Bearer ${token}` }
});
const data = await res.json();
```

**After:**
```javascript
const data = await materialsAPI.getAllMaterials();
```

### Step 3: Test the page
- Clear browser cache
- Check browser DevTools > Network tab
- Verify API calls are being made to `http://localhost:5000`

---

## 📚 API Service Reference

### Available Modules

```javascript
// Authentication
import { authAPI } from "../services/api";
authAPI.login(email, password)
authAPI.register(payload)
authAPI.logout()

// Users
import { userAPI } from "../services/api";
userAPI.getProfile()
userAPI.updateProfile(payload)
userAPI.getAllUsers()

// Materials
import { materialsAPI } from "../services/api";
materialsAPI.getAllMaterials(filters)
materialsAPI.getMaterialById(id)
materialsAPI.createMaterial(payload)

// Live Classes
import { liveClassesAPI } from "../services/api";
liveClassesAPI.getAllClasses()
liveClassesAPI.joinClass(id)

// Payments
import { paymentAPI } from "../services/api";
paymentAPI.initiatePayment(payload)
paymentAPI.verifyPayment(reference)

// Admin
import { adminAPI } from "../services/api";
adminAPI.getDashboardStats()
adminAPI.getAllSettings()
```

---

## � Configuration Details

### Backend Configuration

**Local Development (.env.local):**
```
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=dev_secret_key
DATABASE_URL=sqlite://./database.db
NODE_ENV=development
```

**Production (.env for Render):**
```
PORT=5000
FRONTEND_URL=https://maximum-scholars-frontend.onrender.com
JWT_SECRET=your_strong_secret_key
DATABASE_URL=sqlite://./database.db
NODE_ENV=production
```

**On Render:** Set these variables in the Environment tab of your backend service

### Frontend Configuration

**Local Development (.env.local):**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

**Production (.env.production for Render build):**
```
REACT_APP_API_URL=https://maximum-scholars-backend.onrender.com
REACT_APP_ENV=production
```

**Note:** Environment variables must start with `REACT_APP_` to be accessible in React

### Important Notes

- Local files: Use `.env.local` (NOT tracked by git)
- Production files: Use `.env` and `.env.production` (tracked with placeholder values)
- Never commit real secrets to GitHub
- Set real secrets in Render dashboard instead

---

## 🧪 Testing the Connection

### Test 1: Backend is running
```bash
curl http://localhost:5000
# Should get a response
```

### Test 2: CORS is configured
```bash
# From frontend console
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'test' })
})
.then(r => r.json())
.then(d => console.log(d))
```

### Test 3: API Service works
```javascript
// In browser console on frontend
import * as api from './services/api';
// Try a simple call
api.authAPI.login('test@example.com', 'password').catch(e => console.log(e));
```

---

## 🚨 Common Issues & Solutions

### ❌ "Cannot find module '../services/api'"
- **Solution:** Make sure the file exists at `frontend/src/services/api.js`

### ❌ CORS Error (Failed to fetch)
- **Solution:** 
  - Check backend is running on port 5000
  - Verify `FRONTEND_URL` in backend `.env` is correct
  - Check browser console for specific error

### ❌ 401 Unauthorized Error
- **Solution:**
  - Token may have expired, clear localStorage
  - Login again to get fresh token
  - Check JWT_SECRET in backend

### ❌ Port already in use
- **Solution:**
  - Backend: Change PORT in `.env` (or kill process using port 5000)
  - Frontend: Change port in npm script or kill process using port 3000

### ❌ "Cannot read property 'token' of undefined"
- **Solution:**
  - Check backend response structure matches what frontend expects
  - Verify backend routes are properly returning data

---

## 🌐 Render Deployment URLs

After deploying to Render, you'll get these URLs:

**Backend API:** `https://maximum-scholars-backend.onrender.com`
- Replace `maximum-scholars-backend` with your actual Render service name

**Frontend:** `https://maximum-scholars-frontend.onrender.com`
- Replace `maximum-scholars-frontend` with your actual Render service name

### Update Configuration for Render

1. **Backend .env** (commit to GitHub):
```
FRONTEND_URL=https://maximum-scholars-frontend.onrender.com
NODE_ENV=production
```

2. **Frontend .env.production** (commit to GitHub):
```
REACT_APP_API_URL=https://maximum-scholars-backend.onrender.com
REACT_APP_ENV=production
```

3. **In Render Dashboard:** Set the same environment variables for production values

See [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) for detailed deployment steps.

---

```
┌─────────────────────────────────────────────┐
│          Frontend (React)                   │
│  localhost:3000                             │
├─────────────────────────────────────────────┤
│  Pages (Login, Dashboard, etc.)             │
│         ↓                                   │
│  Components                                 │
│         ↓                                   │
│  services/api.js ← API Service Layer       │
│         ↓                                   │
└────────────────────────────────────────────┬┘
                      ↓ HTTP (fetch)
                      │ Bearer Token
                      ↓
┌─────────────────────────────────────────────┐
│          Backend (Node.js/Express)          │
│  localhost:5000                             │
├─────────────────────────────────────────────┤
│  routes/ (auth, user, materials, etc.)     │
│         ↓                                   │
│  middleware/ (auth verification)            │
│         ↓                                   │
│  models/ (User, Material, LiveClass)       │
│         ↓                                   │
│  Database (SQLite/MongoDB)                 │
└─────────────────────────────────────────────┘
```

---

## 📋 Checklist to Complete

- [ ] Run `npm install` in both backend and frontend folders
- [ ] Configure `.env` files with correct values
- [ ] Start both servers (`start-dev.bat` or terminal)
- [ ] Test frontend can reach backend (http://localhost:5000)
- [ ] Verify Login page works with API service
- [ ] Update remaining pages to use API service
- [ ] Test all endpoints in browser DevTools
- [ ] Set up database properly
- [ ] Configure real environment variables for production
- [ ] Deploy to production servers

---

## 🎯 Next Steps

1. **Immediate:** Start both servers and test the login page
2. **Short-term:** Update all pages to use the API service
3. **Medium-term:** Set up real database and configure production variables
4. **Long-term:** Deploy to production and monitor

---

## 📞 Support Resources

- **Backend Routes:** Check `/backend/routes/*.js` for endpoint details
- **Database Models:** Check `/backend/models/*.js` for data structure
- **Frontend Components:** Check `/frontend/src/pages/*.js` for UI patterns
- **API Docs:** See `SETUP_GUIDE.md` and `API_INTEGRATION_GUIDE.md`

---

## 🎉 Summary

Your Maximum Scholars application is now properly connected! The backend and frontend can communicate through a clean, centralized API service. All that's left is to:

1. Update the remaining pages to use the API service
2. Test everything works together
3. Deploy to production

Good luck with your project! 🚀

---

**Last Updated:** May 11, 2026
**Status:** ✅ Backend-Frontend Connection Established
