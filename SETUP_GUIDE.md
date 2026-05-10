# Backend & Frontend Connection Guide

This document explains how to run and connect the Maximum Scholars application locally.

## Project Structure

```
maximum-scholars/
├── backend/          # Node.js/Express API server
│   ├── routes/       # API endpoints
│   ├── models/       # Database models
│   ├── middleware/   # Auth & other middleware
│   ├── utils/        # Helper utilities
│   ├── server.js     # Main server file
│   ├── package.json  # Dependencies
│   └── .env          # Environment variables
└── frontend/         # React application
    ├── src/
    │   ├── pages/    # Page components
    │   ├── services/ # API service file (new)
    │   └── App.js    # Main app component
    ├── package.json  # Dependencies
    └── .env.local    # Environment variables
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Git

## Backend Setup

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Edit `.env` file and set:
```
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
DATABASE_URL=sqlite://./database.db
NODE_ENV=development

# Optional: Add Cloudinary keys for image uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Optional: Add email configuration
EMAIL_USER=
EMAIL_PASS=

# Optional: Add payment gateway keys
FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_KEY=
```

### 4. Start the backend server
```bash
npm start
```

The server will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to frontend folder
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Edit `.env.local` file and set:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### 4. Start the frontend development server
```bash
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## Running Both Servers

### Option 1: Terminal Tabs (Recommended)

1. **Tab 1 - Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Tab 2 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```

### Option 2: VS Code Tasks

VS Code can run both servers from tasks.json configuration if set up.

## API Integration

### How the Frontend Connects to Backend

The frontend uses a centralized API service located at `frontend/src/services/api.js`.

#### Key Features:
- **Centralized API calls**: All API endpoints in one place
- **Automatic token handling**: JWT tokens automatically sent in headers
- **Environment-based URLs**: API URL from `.env.local`
- **Error handling**: Consistent error handling across all requests

### Using the API Service

The API service provides organized endpoints:

```javascript
// Import the API service
import { authAPI, userAPI, materialsAPI, liveClassesAPI, paymentAPI, adminAPI } from "../services/api";

// Example: Login
const handleLogin = async (email, password) => {
  try {
    const data = await authAPI.login(email, password);
    localStorage.setItem("token", data.token);
    // ... handle success
  } catch (err) {
    // ... handle error
  }
};

// Example: Get all materials
const handleGetMaterials = async () => {
  try {
    const materials = await materialsAPI.getAllMaterials();
    // ... use materials
  } catch (err) {
    // ... handle error
  }
};
```

### Available API Endpoints

#### Authentication
- `authAPI.register(payload)` - Register new user
- `authAPI.login(email, password)` - Login user
- `authAPI.logout()` - Clear local auth data
- `authAPI.verifyToken(token)` - Verify JWT token

#### Users
- `userAPI.getProfile()` - Get current user profile
- `userAPI.updateProfile(payload)` - Update current user
- `userAPI.getAllUsers()` - Get all users (admin only)
- `userAPI.getUserById(id)` - Get user by ID
- `userAPI.updateUser(id, payload)` - Update user (admin)
- `userAPI.deleteUser(id)` - Delete user (admin)

#### Materials
- `materialsAPI.getAllMaterials(filters)` - Get all materials
- `materialsAPI.getMaterialById(id)` - Get single material
- `materialsAPI.createMaterial(payload)` - Create material
- `materialsAPI.updateMaterial(id, payload)` - Update material
- `materialsAPI.deleteMaterial(id)` - Delete material
- `materialsAPI.uploadMaterial(formData)` - Upload file

#### Live Classes
- `liveClassesAPI.getAllClasses()` - Get all classes
- `liveClassesAPI.getClassById(id)` - Get single class
- `liveClassesAPI.createClass(payload)` - Create class
- `liveClassesAPI.updateClass(id, payload)` - Update class
- `liveClassesAPI.deleteClass(id)` - Delete class
- `liveClassesAPI.joinClass(id)` - Join class

#### Payments
- `paymentAPI.initiatePayment(payload)` - Start payment
- `paymentAPI.verifyPayment(reference)` - Verify payment
- `paymentAPI.getPaymentHistory()` - Get user payments

#### Admin
- `adminAPI.getDashboardStats()` - Get stats
- `adminAPI.getAllSettings()` - Get settings
- `adminAPI.updateSettings(payload)` - Update settings

## CORS Configuration

The backend is configured to allow requests from the frontend. Ensure:
- `FRONTEND_URL` in backend `.env` is set to `http://localhost:3000` (development)
- CORS is enabled in `backend/server.js` (already configured)

## Database Setup

The backend uses SQLite (configurable). Database migrations and setup:

1. SQLite will automatically create `database.db` on first run
2. For production, configure MongoDB or PostgreSQL in `.env`

## Testing the Connection

### 1. Check backend is running
```bash
curl http://localhost:5000
```

### 2. Test login endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Verify frontend can reach backend
Open browser console and run:
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Troubleshooting

### CORS Errors
- Ensure backend `.env` has `FRONTEND_URL=http://localhost:3000`
- Verify both servers are running
- Check browser console for detailed error messages

### Connection Refused
- Make sure backend is running on port 5000
- Check if port is already in use: `netstat -ano | findstr :5000` (Windows)
- Change port in backend `.env` if needed

### API Returns 401 (Unauthorized)
- Token may have expired
- Clear localStorage and login again
- Check JWT_SECRET in backend .env

### Pages Not Updating with API Data
- Check browser Network tab for API calls
- Verify response status (200 = success)
- Check browser Console for errors
- Ensure API service is imported correctly

## Production Deployment

When deploying to production:

1. **Backend:**
   - Set `FRONTEND_URL` to your frontend domain
   - Use strong `JWT_SECRET`
   - Set `NODE_ENV=production`
   - Configure real database (MongoDB/PostgreSQL)
   - Add production API keys (Cloudinary, email, payment)

2. **Frontend:**
   - Set `REACT_APP_API_URL` to production backend URL
   - Build the app: `npm run build`
   - Deploy build folder to hosting (Vercel, Netlify, etc.)

Example production `.env`:
```
FRONTEND_URL=https://yourfrontenddomain.com
REACT_APP_API_URL=https://yourbackenddomain.com
```

## Development Tips

- Use Redux or Context API for global state management
- Log API calls in development: `console.log(response)` in api.js
- Use Postman/Thunder Client for testing backend endpoints
- Always check `.env.local` changes don't get committed to git
- Add `.env` files to `.gitignore`

## Next Steps

1. Update all pages to use the API service (see `frontend/src/services/api.js`)
2. Set up database models and migrations
3. Configure real payment gateway (if needed)
4. Set up email notifications
5. Deploy to production

---

For more help, check individual component files or backend route files.
