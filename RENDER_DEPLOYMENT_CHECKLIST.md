# 📝 RENDER DEPLOYMENT CHECKLIST

Complete this checklist to deploy Maximum Scholars to Render.

---

## Phase 1: Local Setup & Testing ✅ (DONE)

- [x] Environment files created
- [x] API service layer created
- [x] Login page updated
- [x] Documentation created
- [x] Configuration files set up

### What to do:
```bash
# Test locally first
start-dev.bat  (Windows)
# or
./start-dev.sh (Mac/Linux)

# Visit http://localhost:3000 and test login
```

---

## Phase 2: Prepare GitHub Repositories ⭕ (TODO)

### Backend Repository

- [ ] Create new GitHub repository named: `maximum-scholars-backend`
- [ ] Initialize Git in backend folder:
  ```bash
  cd backend
  git init
  ```

- [ ] Add files to Git:
  ```bash
  git add .
  ```

- [ ] Create initial commit:
  ```bash
  git commit -m "Initial backend setup"
  ```

- [ ] Set main branch:
  ```bash
  git branch -M main
  ```

- [ ] Add remote:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/maximum-scholars-backend.git
  ```

- [ ] Push to GitHub:
  ```bash
  git push -u origin main
  ```

**Verify:** Backend repo appears on GitHub ✓

---

### Frontend Repository

- [ ] Create new GitHub repository named: `maximum-scholars-frontend`
- [ ] Initialize Git in frontend folder:
  ```bash
  cd frontend
  git init
  ```

- [ ] Add files to Git:
  ```bash
  git add .
  ```

- [ ] Create initial commit:
  ```bash
  git commit -m "Initial frontend setup"
  ```

- [ ] Set main branch:
  ```bash
  git branch -M main
  ```

- [ ] Add remote:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/maximum-scholars-frontend.git
  ```

- [ ] Push to GitHub:
  ```bash
  git push -u origin main
  ```

**Verify:** Frontend repo appears on GitHub ✓

---

## Phase 3: Deploy Backend to Render ⭕ (TODO)

### Create Render Account

- [ ] Go to https://render.com
- [ ] Sign up (free account)
- [ ] Verify email
- [ ] Login to dashboard

### Deploy Backend Service

- [ ] Visit https://dashboard.render.com
- [ ] Click "New +" button
- [ ] Select "Web Service"
- [ ] Click "Connect" next to your GitHub username
- [ ] Authorize Render to access GitHub
- [ ] Select `maximum-scholars-backend` repository
- [ ] Click "Connect"

### Configure Backend Service

- [ ] **Name:** `maximum-scholars-backend`
- [ ] **Environment:** Node
- [ ] **Region:** (closest to you)
- [ ] **Build Command:** `npm install`
- [ ] **Start Command:** `npm start`
- [ ] **Plan:** Free

### Add Environment Variables

- [ ] Click "Environment" section
- [ ] Add each variable:

  | Key | Value |
  |-----|-------|
  | PORT | 5000 |
  | FRONTEND_URL | https://maximum-scholars-frontend.onrender.com |
  | JWT_SECRET | (generate strong random string) |
  | DATABASE_URL | sqlite://./database.db |
  | NODE_ENV | production |
  | CLOUDINARY_CLOUD_NAME | (if needed) |
  | CLOUDINARY_API_KEY | (if needed) |
  | CLOUDINARY_API_SECRET | (if needed) |
  | EMAIL_USER | (if needed) |
  | EMAIL_PASS | (if needed) |
  | FLUTTERWAVE_PUBLIC_KEY | (if needed) |
  | FLUTTERWAVE_SECRET_KEY | (if needed) |

- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Check build logs for errors

**Verify:** Backend service shows "Live" status ✓

### Test Backend

- [ ] Note your backend URL from dashboard
- [ ] Open terminal and test:
  ```bash
  curl https://maximum-scholars-backend.onrender.com
  ```
- [ ] Should get a response (not an error)

**Verify:** Backend is responding ✓

---

## Phase 4: Deploy Frontend to Render ⭕ (TODO)

### Deploy Frontend Service

- [ ] Visit https://dashboard.render.com
- [ ] Click "New +" button
- [ ] Select "Static Site"
- [ ] Click "Connect" next to your GitHub username
- [ ] Select `maximum-scholars-frontend` repository
- [ ] Click "Connect"

### Configure Frontend Service

- [ ] **Name:** `maximum-scholars-frontend`
- [ ] **Build Command:** `npm install && npm run build`
- [ ] **Publish Directory:** `build`
- [ ] **Plan:** Free

### Add Environment Variables

- [ ] Click "Environment" section
- [ ] Add these variables:

  | Key | Value |
  |-----|-------|
  | REACT_APP_API_URL | https://maximum-scholars-backend.onrender.com |
  | REACT_APP_ENV | production |

- [ ] Click "Create Static Site"
- [ ] Wait for deployment (3-5 minutes)
- [ ] Check build logs for errors

**Verify:** Frontend service shows "Live" status ✓

### Test Frontend

- [ ] Note your frontend URL from dashboard
- [ ] Visit URL in browser (might take 30 seconds to load)
- [ ] Page should load successfully

**Verify:** Frontend loads without errors ✓

---

## Phase 5: Test Connection ⭕ (TODO)

### Test Backend URL

- [ ] Terminal command:
  ```bash
  curl https://maximum-scholars-backend.onrender.com
  ```
- [ ] Should respond (not error 404)

### Test Frontend → Backend

- [ ] Visit your frontend URL
- [ ] Open browser Developer Console (F12)
- [ ] Paste and run:
  ```javascript
  fetch('https://maximum-scholars-backend.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email: 'test@example.com', 
      password: 'test' 
    })
  })
  .then(r => r.json())
  .then(d => console.log('Success!', d))
  .catch(e => console.log('Error:', e))
  ```
- [ ] Should see response (not CORS error)

### Test Login Page

- [ ] Visit frontend URL
- [ ] Click on Login link
- [ ] Try to login with test credentials
- [ ] Check browser Network tab to see API calls
- [ ] Verify calls go to your backend URL

**Verify:** All connection tests pass ✓

---

## Phase 6: Update Configuration ⭕ (TODO)

### Update Backend .env File

- [ ] Edit `backend/.env`
- [ ] Set FRONTEND_URL to your actual frontend URL
- [ ] Example: `FRONTEND_URL=https://maximum-scholars-frontend.onrender.com`

### Update Frontend .env.production File

- [ ] Edit `frontend/.env.production`
- [ ] Set REACT_APP_API_URL to your actual backend URL
- [ ] Example: `REACT_APP_API_URL=https://maximum-scholars-backend.onrender.com`

### Commit and Push

- [ ] Backend:
  ```bash
  cd backend
  git add .env
  git commit -m "Update production URLs for Render"
  git push origin main
  ```

- [ ] Frontend:
  ```bash
  cd frontend
  git add .env.production
  git commit -m "Update production URLs for Render"
  git push origin main
  ```

- [ ] Wait for Render to auto-deploy (2-5 minutes per service)

**Verify:** Both services redeploy successfully ✓

---

## Phase 7: Update Remaining Pages ⭕ (TODO)

See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for detailed examples.

### Priority 1 - Update These Now

- [ ] `frontend/src/pages/Register.js`
  - [ ] Import `{ authAPI }`
  - [ ] Replace fetch with `authAPI.register()`
  - [ ] Test registration

- [ ] `frontend/src/pages/Dashboard.js`
  - [ ] Import needed APIs
  - [ ] Fetch and display materials
  - [ ] Test page loads

- [ ] `frontend/src/pages/Payment.js`
  - [ ] Import `{ paymentAPI }`
  - [ ] Update payment flow
  - [ ] Test payment

### Priority 2 - Update These Week

- [ ] `frontend/src/pages/Subjects.js`
- [ ] `frontend/src/pages/LiveClasses.js`
- [ ] `frontend/src/pages/Admin.js`
- [ ] `frontend/src/pages/Teacher.js`

### Priority 3 - Enhance These

- [ ] `frontend/src/pages/Profile.js`
- [ ] `frontend/src/pages/student.js`

**Pattern for all updates:**
```javascript
// 1. Import the API module
import { materialsAPI } from "../services/api";

// 2. Replace fetch calls with:
const data = await materialsAPI.getAllMaterials();

// 3. Test in browser
// Done!
```

---

## Phase 8: Full Testing ⭕ (TODO)

### Functionality Testing

- [ ] Login works
- [ ] Register new user works
- [ ] Dashboard loads
- [ ] Materials display
- [ ] Live classes work
- [ ] Payment flow works
- [ ] Admin functions work

### Security Testing

- [ ] No hardcoded URLs in code
- [ ] No hardcoded secrets in code
- [ ] JWT token is stored correctly
- [ ] Logout clears token
- [ ] Protected routes require login

### Performance Testing

- [ ] Pages load within reasonable time
- [ ] No console errors
- [ ] API responses are fast
- [ ] No memory leaks

---

## Phase 9: Production Optimization ⭕ (TODO)

- [ ] Set up custom domain (optional)
  - [ ] Go to Render service settings
  - [ ] Add custom domain
  - [ ] Update DNS records
  - [ ] Wait for SSL certificate

- [ ] Configure MongoDB Atlas (instead of SQLite)
  - [ ] Create MongoDB account
  - [ ] Create cluster
  - [ ] Get connection string
  - [ ] Update DATABASE_URL in Render

- [ ] Set up error monitoring (optional)
  - [ ] Create Sentry account
  - [ ] Add Sentry to backend
  - [ ] Add Sentry to frontend
  - [ ] Test error reporting

- [ ] Configure email service (optional)
  - [ ] Set up Gmail/SendGrid/Mailgun
  - [ ] Update EMAIL_USER and EMAIL_PASS
  - [ ] Test email sending

---

## Phase 10: Post-Deployment Monitoring ⭕ (TODO)

### Daily Checks

- [ ] Visit frontend URL
- [ ] Try to login
- [ ] Check backend in Render dashboard
- [ ] Monitor error logs

### Weekly Maintenance

- [ ] Check Render usage stats
- [ ] Review error logs
- [ ] Test all major features
- [ ] Check database size

### Monthly Tasks

- [ ] Update dependencies
- [ ] Review security
- [ ] Backup data
- [ ] Analyze performance

---

## 🎉 Success Indicators

When you complete all phases, you should have:

✅ Backend running on Render
✅ Frontend running on Render
✅ Both URLs publicly accessible
✅ Login working end-to-end
✅ All pages updated to use API service
✅ Database properly configured
✅ Error monitoring set up
✅ Custom domain (optional)

---

## 🆘 Troubleshooting Quick Links

If you encounter issues:

1. **Backend won't deploy:** Check Render build logs
2. **CORS Error:** Verify FRONTEND_URL in backend
3. **Login not working:** Check backend logs + API URL in console
4. **Frontend blank:** Check build command in Render
5. **Database errors:** Check DATABASE_URL in environment

See [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) for detailed troubleshooting.

---

## 📞 Resources

- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs
- Your Backend: (after deployment)
- Your Frontend: (after deployment)

---

## 📊 Deployment Progress

**Phase 1 (Local):** ✅ Complete
**Phase 2 (GitHub):** ⭕ To Do
**Phase 3 (Backend Render):** ⭕ To Do
**Phase 4 (Frontend Render):** ⭕ To Do
**Phase 5 (Connection Testing):** ⭕ To Do
**Phase 6 (Configuration Update):** ⭕ To Do
**Phase 7 (Page Updates):** ⭕ To Do
**Phase 8 (Full Testing):** ⭕ To Do
**Phase 9 (Optimization):** ⭕ To Do
**Phase 10 (Monitoring):** ⭕ To Do

---

## 🚀 Ready to Deploy?

1. ✅ Follow Phase 2: Create GitHub repositories
2. ✅ Follow Phase 3: Deploy backend
3. ✅ Follow Phase 4: Deploy frontend
4. ✅ Follow Phase 5: Test connection

**Then your app is LIVE!** 🎉

---

**Start:** Begin with Phase 2 (GitHub Repositories)
**Last Updated:** May 11, 2026
**Estimated Time:** 2-3 hours total
