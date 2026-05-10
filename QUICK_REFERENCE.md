# 🚀 Quick Reference: Local vs Render

## Side-by-Side Comparison

### Local Development

| Component | URL | Port | Env File |
|-----------|-----|------|----------|
| Backend | http://localhost:5000 | 5000 | .env.local |
| Frontend | http://localhost:3000 | 3000 | .env.local |
| Database | Local SQLite | - | .env.local |

**How to run:**
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm start
```

**Or click:** `start-dev.bat` (Windows) or `./start-dev.sh` (Mac/Linux)

---

### Render Production

| Component | URL | Port | Env Source |
|-----------|-----|------|-----------|
| Backend | https://maximum-scholars-backend.onrender.com | 5000 | Render Dashboard |
| Frontend | https://maximum-scholars-frontend.onrender.com | - | .env.production |
| Database | SQLite or MongoDB Atlas | - | DATABASE_URL env var |

**How to deploy:**
See [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)

---

## Environment Configuration

### Local Development (.env.local files)

**Backend (.env.local):**
```
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=dev_secret_here
DATABASE_URL=sqlite://./database.db
NODE_ENV=development
```

**Frontend (.env.local):**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### Production Render Deployment

**Backend (Set in Render Dashboard):**
```
PORT=5000
FRONTEND_URL=https://maximum-scholars-frontend.onrender.com
JWT_SECRET=strong_production_secret_here
DATABASE_URL=sqlite://./database.db
NODE_ENV=production
```

**Frontend (.env.production):**
```
REACT_APP_API_URL=https://maximum-scholars-backend.onrender.com
REACT_APP_ENV=production
```

---

## API Calls

### Local Development
```javascript
// Frontend automatically connects to http://localhost:5000
import { authAPI } from "../services/api";

const data = await authAPI.login(email, password);
// API URL: http://localhost:5000/api/auth/login
```

### Render Production
```javascript
// Frontend automatically connects to https://maximum-scholars-backend.onrender.com
import { authAPI } from "../services/api";

const data = await authAPI.login(email, password);
// API URL: https://maximum-scholars-backend.onrender.com/api/auth/login
```

**The API service automatically uses the correct URL based on environment variables!**

---

## Testing Connection

### Local Development

**Backend running?**
```bash
curl http://localhost:5000
```

**Frontend can reach backend?**
```javascript
// Browser console
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'test' })
})
.then(r => r.json())
.then(d => console.log(d))
```

### Render Production

**Backend running?**
```bash
curl https://maximum-scholars-backend.onrender.com
```

**Frontend can reach backend?**
```javascript
// Browser console
fetch('https://maximum-scholars-backend.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'test' })
})
.then(r => r.json())
.then(d => console.log(d))
```

---

## Debugging URLs

### Check API URL in Development
```javascript
// Browser console
console.log('API URL:', process.env.REACT_APP_API_URL);
// Output: http://localhost:5000
```

### Check API URL in Production
```javascript
// Browser console on https://your-frontend.onrender.com
console.log('API URL:', process.env.REACT_APP_API_URL);
// Output: https://maximum-scholars-backend.onrender.com
```

---

## File Checklist

### What to Commit to GitHub ✅
- `backend/.env` (with placeholder values)
- `frontend/.env.production` (with Render URLs)
- `frontend/.env.local` ❌ (NO - local only)
- `backend/.env.local` ❌ (NO - local only)

### Security Notes 🔒
- Never commit real secrets
- Use `.env.local` for local development
- Set real secrets in Render Dashboard
- Rotate secrets periodically

---

## Workflow Comparison

### Local Development Workflow
```
1. Create .env.local files with local URLs
2. Run: npm start (both backend & frontend)
3. Access: http://localhost:3000
4. Test: Login, features, API calls
5. Make changes
6. Changes auto-reload
```

### Render Deployment Workflow
```
1. Create .env and .env.production files
2. Commit to GitHub with production URLs
3. Push: git push origin main
4. Render auto-deploys from GitHub
5. Access: https://your-services.onrender.com
6. Monitor: Render Dashboard logs
7. Set: Environment variables in Render
```

---

## Common Commands

### Local Development
```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm start

# Or one-click start (Windows)
.\start-dev.bat

# Or one-click start (Mac/Linux)
./start-dev.sh
```

### Render Deployment
```bash
# Push changes to GitHub
git add .
git commit -m "Update features"
git push origin main

# Render automatically deploys
# Monitor in: https://dashboard.render.com
```

### Building for Production
```bash
# Frontend production build
cd frontend
npm run build

# This uses .env.production values
```

---

## Troubleshooting Quick Fixes

### CORS Error
```
Local: Check FRONTEND_URL in backend/.env.local
Render: Check FRONTEND_URL in Render Dashboard
```

### "Cannot find API URL"
```
Local: Create frontend/.env.local
Render: Check frontend build uses .env.production
```

### Login Not Working
```
Local: Verify backend running on http://localhost:5000
Render: Check backend logs in Render Dashboard
```

### Page Blank on Render
```
Local: Check frontend is building
Render: Check build command in Render Dashboard
```

---

## Next Steps

1. **Local:** Run `start-dev.bat` and test login
2. **GitHub:** Push code to GitHub
3. **Render:** Deploy using RENDER_DEPLOYMENT_GUIDE.md
4. **Production:** Set environment variables in Render
5. **Test:** Visit your Render URLs and test

---

## Resources

- 📖 [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Full setup instructions
- 🌐 [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) - Render deployment
- ⚙️ [ENV_FILES_GUIDE.md](./ENV_FILES_GUIDE.md) - Environment files
- 🔌 [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) - API integration
- 📋 [CONNECTION_SUMMARY.md](./CONNECTION_SUMMARY.md) - Full overview

---

**Quick Start:** Double-click `start-dev.bat` → Visit http://localhost:3000 → Test login

**Deploy to Render:** Follow [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
