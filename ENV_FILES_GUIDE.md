# 📋 Environment Files Guide

## Overview

The project uses different environment files for **local development** and **production** (Render).

## File Structure

```
backend/
├── .env              ← Production (Render) - git tracked with templates
├── .env.local        ← Local development - DO NOT commit
└── package.json

frontend/
├── .env.local        ← Local development - DO NOT commit
├── .env.production   ← Production build - git tracked with templates
└── package.json
```

---

## Backend Environment Files

### `.env` (Production / Render)
**Location:** `backend/.env`
**Purpose:** Production environment on Render
**Git:** Tracked (with placeholder values)

```
PORT=5000
FRONTEND_URL=https://maximum-scholars-frontend.onrender.com
JWT_SECRET=your_jwt_secret_key_change_this_in_production
DATABASE_URL=sqlite://./database.db
NODE_ENV=production

# Add other production keys
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_KEY=
```

**When to use:** Render deployment, production servers

---

### `.env.local` (Local Development)
**Location:** `backend/.env.local`
**Purpose:** Local development on your machine
**Git:** ❌ NOT tracked (in .gitignore)

```
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=dev_secret_key
DATABASE_URL=sqlite://./database.db
NODE_ENV=development

# Local development values
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_KEY=
```

**When to use:** Running `npm start` locally

---

## Frontend Environment Files

### `.env.local` (Local Development)
**Location:** `frontend/.env.local`
**Purpose:** Local development on your machine
**Git:** ❌ NOT tracked (in .gitignore)

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

**When to use:** Running `npm start` locally (http://localhost:3000)

---

### `.env.production` (Production Build)
**Location:** `frontend/.env.production`
**Purpose:** Production build for Render
**Git:** Tracked (with placeholder values)

```
REACT_APP_API_URL=https://maximum-scholars-backend.onrender.com
REACT_APP_ENV=production
```

**When to use:** Production builds (`npm run build`), Render deployment

---

## How It Works

### Local Development

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   # Uses backend/.env.local
   # Serves on http://localhost:5000
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   # Uses frontend/.env.local
   # Serves on http://localhost:3000
   # Connects to backend at http://localhost:5000
   ```

---

### Production (Render)

**Backend Render Service:**
- Uses environment variables set in Render dashboard
- Effectively uses `.env` values (but set in dashboard, not file)
- Backend runs on Render server

**Frontend Render Service:**
- Build command: `npm install && npm run build`
- Uses `frontend/.env.production` during build
- Static files deployed to Render CDN
- Frontend runs on Render server

---

## Setting Up Environment Variables on Render

### For Backend Service:

1. Go to Render Dashboard → Select backend service
2. Go to Environment
3. Add each variable:

```
PORT=5000
FRONTEND_URL=https://your-frontend-url.onrender.com
JWT_SECRET=your_strong_secret_here
DATABASE_URL=sqlite://./database.db
NODE_ENV=production
... (other keys)
```

4. Click "Save"
5. Service auto-deploys

### For Frontend Service:

1. Go to Render Dashboard → Select frontend service
2. Go to Environment
3. Add variables:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_ENV=production
```

4. Click "Save"
5. Service auto-deploys

---

## .gitignore Configuration

The `.gitignore` file ensures sensitive local files aren't committed:

```
# Environment files - local development only
.env.local
.env.development.local

# Keep .env and .env.production for reference (with placeholder values)
# But NEVER commit real secrets!
```

---

## Security Best Practices

### ✅ DO:
- [ ] Commit `.env` and `.env.production` with **placeholder values only**
- [ ] Keep real secrets in `.env.local` (local only)
- [ ] Set real secrets in Render dashboard (not in files)
- [ ] Use strong JWT_SECRET (generate with `openssl rand -hex 32`)
- [ ] Rotate secrets regularly

### ❌ DON'T:
- [ ] Commit real API keys to GitHub
- [ ] Use same secrets for dev and production
- [ ] Share `.env.local` files
- [ ] Use weak/simple JWT secrets
- [ ] Leave default passwords in code

---

## Setting Up Secrets

### Generate Strong JWT Secret:

**On Mac/Linux:**
```bash
openssl rand -hex 32
# Output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))
```

Use this as your JWT_SECRET in:
- `backend/.env` (with placeholder)
- `backend/.env.local` (with real secret)
- Render dashboard (real secret)

---

## Switching Between Local and Production

### To run locally:
1. Use `.env.local` files (automatic via npm)
2. Run on `http://localhost:3000` and `http://localhost:5000`

### To test production config locally:
```bash
# Backend with .env (production config)
NODE_ENV=production node server.js

# Frontend with .env.production
REACT_APP_ENV=production npm start
```

### To deploy to Render:
1. Commit `.env` and `.env.production` with placeholder values
2. Set real secrets in Render dashboard
3. Push to GitHub
4. Render automatically deploys

---

## Troubleshooting

### "Cannot find variable REACT_APP_API_URL"
- Missing `.env.local` or `.env.production`
- Variable name must start with `REACT_APP_`
- Restart dev server after creating .env file

### "CORS Error" on production
- Check `FRONTEND_URL` in backend environment
- Must be full HTTPS URL: `https://...onrender.com`
- Clear browser cache

### "API endpoint not found"
- Check `REACT_APP_API_URL` in frontend
- Must point to correct backend URL
- Verify backend is running/deployed

### "Cannot read env variables"
- Local: Use `.env.local` in same folder as package.json
- Production: Set in Render dashboard, not in file
- Backend: Restart with `npm start`
- Frontend: Restart dev server

---

## Quick Reference

| Scenario | Backend File | Frontend File | URL |
|----------|-------------|--------------|-----|
| Local Dev | `.env.local` | `.env.local` | http://localhost:3000 |
| Render Production | Render Dashboard | `.env.production` | https://...onrender.com |
| Testing Prod Locally | `.env` | `.env.production` | http://localhost:3000 |

---

## Files to Track in Git

✅ **Track (include placeholder values):**
- `backend/.env`
- `frontend/.env.production`
- `.gitignore`

❌ **Don't Track (add to .gitignore):**
- `backend/.env.local`
- `frontend/.env.local`
- `node_modules/`
- `.DS_Store`
- `*.log`

---

## Next Steps

1. Create `backend/.env.local` with local values
2. Create `frontend/.env.local` with local values
3. Test locally: `npm start` both servers
4. Deploy to Render (see RENDER_DEPLOYMENT_GUIDE.md)
5. Set environment variables in Render dashboard
6. Test production: Visit Render URLs

---

**Last Updated:** May 11, 2026
