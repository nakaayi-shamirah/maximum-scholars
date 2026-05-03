import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Payment from "./pages/Payment";

import Teacher from "./pages/Teacher";
import Admin from "./pages/Admin";

import LiveClasses from "./pages/LiveClasses";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

/* =========================
   PROTECTED ROUTE FINAL
========================= */
function ProtectedRoute({
  children,
  role
}) {
  const location =
    useLocation();

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    ) || null;

  const userRole =
    localStorage.getItem(
      "role"
    );

  const paid =
    localStorage.getItem(
      "paid"
    );

  const sub =
    typeof user
      ?.subscription ===
    "string"
      ? JSON.parse(
          user.subscription
        )
      : user
          ?.subscription ||
        {};

  const approved =
    paid ===
      "true" ||
    sub.status ===
      "approved";

  /* no login */
  if (!user || !userRole) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /* role check */
  if (
    role &&
    userRole !== role
  ) {
    if (
      userRole ===
      "admin"
    ) {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    if (
      userRole ===
      "teacher"
    ) {
      return (
        <Navigate
          to="/teacher"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  /* unpaid students */
  if (
    userRole ===
      "student" &&
    !approved
  ) {
    const allowed =
      [
        "/subjects",
        "/payment",
        "/profile",
        "/live"
      ];

    if (
      !allowed.includes(
        location.pathname
      )
    ) {
      return (
        <Navigate
          to="/subjects"
          replace
        />
      );
    }
  }

  return children;
}

/* =========================
   WHATSAPP BUTTON
========================= */
function WhatsAppButton() {
  return (
    <button
      onClick={() =>
        window.open(
          "https://wa.me/256762027171?text=Hello%20Maximo%20Scholars,%20I%20need%20help.",
          "_blank"
        )
      }
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-2xl z-50 text-2xl animate-bounce"
    >
      💬
    </button>
  );
}

/* =========================
   APP FINAL
========================= */
export default function App() {
  return (
    <Router>

      <Routes>

        {/* PUBLIC */}
        <Route
          path="/"
          element={
            <Landing />
          }
        />

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        <Route
          path="/register"
          element={
            <Register />
          }
        />

        {/* STUDENT */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="student">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects"
          element={
            <ProtectedRoute role="student">
              <Subjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute role="student">
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* TEACHER */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="teacher">
              <Teacher />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* SHARED */}
        <Route
          path="/live"
          element={
            <ProtectedRoute>
              <LiveClasses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <NotFound />
          }
        />

      </Routes>

      <WhatsAppButton />

    </Router>
  );
}