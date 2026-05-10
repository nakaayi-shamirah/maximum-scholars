# 🚀 Deploying Maximum Scholars to Render

This guide will help you deploy both backend and frontend to Render for public access.

## Prerequisites

- Render account (free at https://render.com)
- GitHub repository with your code
- Render accepts free tier for testing

## Part 1: Deploy Backend to Render

### Step 1: Push Backend to GitHub

```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/maximum-scholars-backend.git
git push -u origin main
```

### Step 2: Create New Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" button → Select "Web Service"
3. Connect your GitHub repository
4. Select the backend repository

### Step 3: Configure Backend Service

Fill in these details:

| Setting | Value |
|---------|-------|
| **Name** | maximum-scholars-backend |
| **Environment** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### Step 4: Add Environment Variables

In the "Environment" section, add:

```
PORT=5000
FRONTEND_URL=https://YOUR-FRONTEND-DOMAIN.onrender.com
JWT_SECRET=generate_a_strong_random_string_here
DATABASE_URL=sqlite://./database.db
NODE_ENV=production

# Add other keys as needed:
CLOUDINARY_CLOUD_NAME=your_value
CLOUDINARY_API_KEY=your_value
CLOUDINARY_API_SECRET=your_value
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FLUTTERWAVE_PUBLIC_KEY=your_value
FLUTTERWAVE_SECRET_KEY=your_value
```

### Step 5: Deploy

Click "Create Web Service" and wait for deployment (2-3 minutes)

Your backend URL will be: `https://maximum-scholars-backend.onrender.com`

### ✅ Verify Backend is Running

```bash
curl https://maximum-scholars-backend.onrender.com/api/auth/login
```

---

## Part 2: Deploy Frontend to Render

### Step 1: Push Frontend to GitHub

```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/maximum-scholars-frontend.git
git push -u origin main
```

### Step 2: Create Static Site on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" button → Select "Static Site"
3. Connect your frontend GitHub repository

### Step 3: Configure Frontend Service

Fill in these details:

| Setting | Value |
|---------|-------|
| **Name** | maximum-scholars-frontend |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |
| **Plan** | Free |

### Step 4: Add Environment Variables

In the "Environment" section, add:

```
REACT_APP_API_URL=https://maximum-scholars-backend.onrender.com
REACT_APP_ENV=production
```

### Step 5: Deploy

Click "Create Static Site" and wait for deployment (3-5 minutes)

Your frontend URL will be: `https://maximum-scholars-frontend.onrender.com`

### ✅ Verify Frontend is Running

Visit: `https://maximum-scholars-frontend.onrender.com`

---

## Part 3: Update Configuration Files

Update your repository configuration files:

### backend/.env (Production)
```
PORT=5000
FRONTEND_URL=https://maximum-scholars-frontend.onrender.com
JWT_SECRET=your_strong_secret_key
DATABASE_URL=sqlite://./database.db
NODE_ENV=production
```

### frontend/.env.production (Production)
```
REACT_APP_API_URL=https://maximum-scholars-backend.onrender.com
REACT_APP_ENV=production
```

### frontend/.env.local (Local Development)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### backend/.env.local (Local Development)
```
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=dev_secret_key
DATABASE_URL=sqlite://./database.db
NODE_ENV=development
```

---

## Part 4: Test Production Connection

### Test Backend API

```bash
curl https://maximum-scholars-backend.onrender.com/api/auth/login
```

### Test Frontend → Backend Connection

1. Open browser console on `https://maximum-scholars-frontend.onrender.com`
2. Run:
```javascript
fetch('https://maximum-scholars-backend.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'test' })
})
.then(r => r.json())
.then(d => console.log(d))
```

### Test Login Page

1. Visit `https://maximum-scholars-frontend.onrender.com`
2. Try to login with test credentials
3. Check Network tab for API calls

---

## Part 5: Custom Domain (Optional)

To use your own domain:

### For Frontend
1. In Render dashboard, select your frontend service
2. Go to Settings → Custom Domain
3. Add your domain: `www.maximumscholars.com`
4. Follow DNS configuration instructions

### For Backend
1. In Render dashboard, select your backend service
2. Go to Settings → Custom Domain  
3. Add your domain: `api.maximumscholars.com`
4. Follow DNS configuration instructions

---

## Troubleshooting

### ❌ Backend Deploy Failed
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify Node version compatibility

### ❌ "CORS Error" After Deployment
- Check backend `.env` has correct FRONTEND_URL
- Verify frontend URL is exactly right (including https://)
- Clear browser cache

### ❌ "Cannot find module" Error
- Ensure all dependencies are in package.json
- Run `npm install` locally to verify
- Check that .gitignore doesn't exclude node_modules (it should!)

### ❌ Frontend Shows 404 Not Found
- Ensure build command is `npm install && npm run build`
- Check Publish Directory is set to `build`
- Verify React Router redirects are configured

### ❌ Login Not Working
- Check Network tab for API response
- Verify API URL in browser console: `process.env.REACT_APP_API_URL`
- Check backend logs in Render dashboard

### ❌ Database Issues
- SQLite databases are per-instance and don't persist on free tier
- Consider upgrading to paid tier or using MongoDB Atlas

---

## Continuous Deployment

After first deployment, changes auto-deploy when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Render automatically redeploys
# Check dashboard for deployment status
```

---

## Environment Variables Summary

### Local Development
```
Backend:  http://localhost:5000
Frontend: http://localhost:3000
Env: .env.local files
```

### Production (Render)
```
Backend:  https://maximum-scholars-backend.onrender.com
Frontend: https://maximum-scholars-frontend.onrender.com
Env: .env files with production values
```

---

## Performance Tips

1. **Free Tier Limitation**: Free tier services spin down after 15 minutes of inactivity
   - First request will be slow (20-30 seconds)
   - Subsequent requests are fast

2. **Upgrade to Paid Tier** for production:
   - Always-on service (no spin-down)
   - Better performance
   - Custom domains included

3. **Database**: Use MongoDB Atlas for better persistence than SQLite

4. **Static Site Caching**: Enable caching for faster page loads

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Render
3. ✅ Test login and API connections
4. ✅ Update all pages to use the API service
5. ✅ Set up custom domain (optional)
6. ✅ Monitor logs and errors
7. ✅ Configure real database (MongoDB/PostgreSQL)
8. ✅ Set up email notifications
9. ✅ Enable error tracking (Sentry)
10. ✅ Upgrade to paid tier for production

---

## Useful Render Links

- [Render Dashboard](https://dashboard.render.com)
- [Render Documentation](https://render.com/docs)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Render Custom Domains](https://render.com/docs/custom-domains)
- [Render Web Services](https://render.com/docs/web-services)
- [Render Static Sites](https://render.com/docs/static-sites)

---

## Free Tier Limits

- **Backend**: Free tier available
- **Frontend**: Free tier available
- **Database**: SQLite (doesn't persist well, use MongoDB Atlas instead)
- **Inactivity**: Services spin down after 15 minutes

---

## Success Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Render
- [ ] Backend URL working
- [ ] Frontend URL working
- [ ] Login page accessible
- [ ] API calls working from frontend to backend
- [ ] Environment variables configured correctly
- [ ] Custom domain set up (optional)
- [ ] All pages updated to use API service
- [ ] Production database configured

---

**Deployment Status**: Ready for Render
**Last Updated**: May 11, 2026

