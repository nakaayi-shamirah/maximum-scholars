# Quick Reference: Updating Pages to Use API Service

This guide shows how to update your pages to use the centralized API service instead of hardcoding API calls.

## Pattern: Before → After

### Before (Hardcoded API URL)
```javascript
import { useState } from "react";

export default function MyPage() {
  const [data, setData] = useState(null);
  const API = "https://maximum-scholars-1-api.onrender.com";

  const handleFetch = async () => {
    try {
      const res = await fetch(`${API}/api/endpoint`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      setData(data);
    } catch (err) {
      console.error(err);
    }
  };

  return <div><!-- UI here --></div>;
}
```

### After (Using API Service)
```javascript
import { useState } from "react";
import { userAPI } from "../services/api"; // Import specific API

export default function MyPage() {
  const [data, setData] = useState(null);

  const handleFetch = async () => {
    try {
      const data = await userAPI.getProfile(); // Use API service
      setData(data);
    } catch (err) {
      console.error(err);
    }
  };

  return <div><!-- UI here --></div>;
}
```

## Pages to Update

Below are pages that likely need updating. Check each for API calls:

### 1. **Register.js**
```javascript
// Before
const res = await fetch(`${API}/api/auth/register`, { ... });

// After
import { authAPI } from "../services/api";
const data = await authAPI.register({ name, email, password, school, referral });
```

### 2. **Dashboard.js**
```javascript
// After adding to Dashboard
import { materialsAPI, userAPI } from "../services/api";
const materials = await materialsAPI.getAllMaterials();
const profile = await userAPI.getProfile();
```

### 3. **Subjects.js**
```javascript
import { materialsAPI } from "../services/api";
const materials = await materialsAPI.getAllMaterials({ subject: subjectName });
```

### 4. **LiveClasses.js**
```javascript
import { liveClassesAPI } from "../services/api";
const classes = await liveClassesAPI.getAllClasses();
const joinedClass = await liveClassesAPI.joinClass(classId);
```

### 5. **Payment.js**
```javascript
import { paymentAPI } from "../services/api";
const payment = await paymentAPI.initiatePayment({ amount, email });
const verified = await paymentAPI.verifyPayment(reference);
```

### 6. **Admin.js**
```javascript
import { adminAPI, userAPI } from "../services/api";
const stats = await adminAPI.getDashboardStats();
const users = await userAPI.getAllUsers();
```

### 7. **Teacher.js**
```javascript
import { materialsAPI, liveClassesAPI } from "../services/api";
const materials = await materialsAPI.getAllMaterials();
const classes = await liveClassesAPI.getAllClasses();
```

### 8. **Profile.js**
```javascript
import { userAPI } from "../services/api";
const profile = await userAPI.getProfile();
const updated = await userAPI.updateProfile({ name, email, ... });
```

## Common Patterns

### Get Data on Page Load
```javascript
import { useEffect, useState } from "react";
import { userAPI } from "../services/api";

export default function MyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await userAPI.getProfile();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render data */}</div>;
}
```

### Handle Form Submission
```javascript
import { useState } from "react";
import { authAPI } from "../services/api";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await authAPI.login(formData.email, formData.password);
      localStorage.setItem("token", response.token);
      // Redirect or update state
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### File Upload
```javascript
import { materialsAPI } from "../services/api";

const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", "Material Title");

  try {
    const response = await materialsAPI.uploadMaterial(formData);
    console.log("Upload successful:", response);
  } catch (err) {
    console.error("Upload failed:", err);
  }
};
```

### With Filters/Query Parameters
```javascript
import { materialsAPI } from "../services/api";

const handleSearch = async (subject, level) => {
  try {
    const materials = await materialsAPI.getAllMaterials({
      subject,
      level,
      limit: 10
    });
    // Use materials
  } catch (err) {
    console.error(err);
  }
};
```

## Important Notes

1. **Token Handling**: The API service automatically includes JWT token from localStorage
2. **Error Messages**: All errors are caught and logged. Access via `err.message`
3. **Environment Variables**: API URL comes from `.env.local` (REACT_APP_API_URL)
4. **Development vs Production**: Different `.env` files for dev/prod
5. **CORS**: Ensure backend .env has correct FRONTEND_URL

## Testing API Calls

### Browser Console Test
```javascript
import * as api from './services/api';

// Test login
const result = await api.authAPI.login('test@example.com', 'password');
console.log(result);

// Test getting materials
const materials = await api.materialsAPI.getAllMaterials();
console.log(materials);
```

### Debugging
```javascript
// Check if token exists
console.log("Token:", localStorage.getItem("token"));

// Check API URL
console.log("API URL:", process.env.REACT_APP_API_URL);

// Check response
try {
  const data = await api.userAPI.getProfile();
  console.log("Profile:", data);
} catch (err) {
  console.error("Error details:", err);
}
```

## Next: Update All Pages

Once you understand the pattern, go through each page file and replace fetch calls with the corresponding API service calls. This will centralize all API logic and make maintenance easier.

---

Need help with a specific page? Check the Backend Routes documentation or the API service file comments.
