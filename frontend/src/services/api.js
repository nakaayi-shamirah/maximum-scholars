/**
 * API Service - Centralized API calls for the frontend
 * This file handles all communication with the backend
 */

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error.message);
    throw error;
  }
};

/* =========================
   AUTH ENDPOINTS
========================= */
export const authAPI = {
  register: (payload) =>
    apiCall("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (email, password) =>
    apiCall("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("paid");
    localStorage.removeItem("subjects");
  },

  verifyToken: (token) =>
    apiCall("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
};

/* =========================
   USER ENDPOINTS
========================= */
export const userAPI = {
  getProfile: () =>
    apiCall("/api/user/profile", {
      method: "GET",
    }),

  updateProfile: (payload) =>
    apiCall("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  getAllUsers: () =>
    apiCall("/api/users", {
      method: "GET",
    }),

  getUserById: (id) =>
    apiCall(`/api/users/${id}`, {
      method: "GET",
    }),

  updateUser: (id, payload) =>
    apiCall(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteUser: (id) =>
    apiCall(`/api/users/${id}`, {
      method: "DELETE",
    }),
};

/* =========================
   MATERIALS ENDPOINTS
========================= */
export const materialsAPI = {
  getAllMaterials: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/api/materials?${params}`, {
      method: "GET",
    });
  },

  getMaterialById: (id) =>
    apiCall(`/api/materials/${id}`, {
      method: "GET",
    }),

  createMaterial: (payload) =>
    apiCall("/api/materials", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateMaterial: (id, payload) =>
    apiCall(`/api/materials/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteMaterial: (id) =>
    apiCall(`/api/materials/${id}`, {
      method: "DELETE",
    }),

  uploadMaterial: (formData) => {
    const token = localStorage.getItem("token");
    return fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }).then((res) => res.json());
  },
};

/* =========================
   LIVE CLASSES ENDPOINTS
========================= */
export const liveClassesAPI = {
  getAllClasses: () =>
    apiCall("/api/live", {
      method: "GET",
    }),

  getClassById: (id) =>
    apiCall(`/api/live/${id}`, {
      method: "GET",
    }),

  createClass: (payload) =>
    apiCall("/api/live", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateClass: (id, payload) =>
    apiCall(`/api/live/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteClass: (id) =>
    apiCall(`/api/live/${id}`, {
      method: "DELETE",
    }),

  joinClass: (id) =>
    apiCall(`/api/live/${id}/join`, {
      method: "POST",
    }),
};

/* =========================
   PAYMENT ENDPOINTS
========================= */
export const paymentAPI = {
  initiatePayment: (payload) =>
    apiCall("/api/payment", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verifyPayment: (reference) =>
    apiCall(`/api/payment/verify/${reference}`, {
      method: "GET",
    }),

  getPaymentHistory: () =>
    apiCall("/api/payment/history", {
      method: "GET",
    }),
};

/* =========================
   ADMIN ENDPOINTS
========================= */
export const adminAPI = {
  getDashboardStats: () =>
    apiCall("/api/admin/stats", {
      method: "GET",
    }),

  getAllSettings: () =>
    apiCall("/api/admin/settings", {
      method: "GET",
    }),

  updateSettings: (payload) =>
    apiCall("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};

export default {
  authAPI,
  userAPI,
  materialsAPI,
  liveClassesAPI,
  paymentAPI,
  adminAPI,
};
