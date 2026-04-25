import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const API =
    "http://127.0.0.1:5000";

  const handleLogin =
    async (e) => {
      e.preventDefault();

      setError("");

      if (
        !email.trim() ||
        !password.trim()
      ) {
        setError(
          "Enter email and password."
        );
        return;
      }

      try {
        setLoading(true);

        const res =
          await fetch(
            `${API}/api/auth/login`,
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify(
                {
                  email,
                  password
                }
              )
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          setError(
            data.message ||
              "Login failed."
          );
          return;
        }

        const user =
          data.user;

        const token =
          data.token;

        const sub =
          typeof user
            .subscription ===
          "string"
            ? JSON.parse(
                user.subscription
              )
            : user
                .subscription ||
              {};

        /* SAVE SESSION */
        localStorage.setItem(
          "token",
          token
        );

        localStorage.setItem(
          "role",
          user.role
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            user
          )
        );

        localStorage.setItem(
          "subjects",
          JSON.stringify(
            user.subjects ||
              []
          )
        );

        /* PAYMENT STATUS */
        if (
          sub.status ===
          "approved"
        ) {
          localStorage.setItem(
            "paid",
            "true"
          );
        } else {
          localStorage.removeItem(
            "paid"
          );
        }

        /* EXPIRY CHECK */
        if (
          sub.expiresAt
        ) {
          const today =
            new Date();

          const expiry =
            new Date(
              sub.expiresAt
            );

          if (
            today > expiry
          ) {
            alert(
              "Subscription expired. Renew access."
            );

            localStorage.removeItem(
              "paid"
            );

            navigate(
              "/subjects"
            );

            return;
          }
        }

        /* ROUTING */
        if (
          user.role ===
          "admin"
        ) {
          navigate(
            "/admin"
          );
          return;
        }

        if (
          user.role ===
          "teacher"
        ) {
          navigate(
            "/teacher"
          );
          return;
        }

        if (
          sub.status ===
          "approved"
        ) {
          navigate(
            "/dashboard"
          );
        } else {
          navigate(
            "/subjects"
          );
        }

      } catch (
        error
      ) {
        console.error(
          error
        );

        setError(
          "Unable to connect to server."
        );

      } finally {
        setLoading(
          false
        );
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 to-indigo-900 px-4">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-blue-700">
            Maximum Scholars
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back
          </p>

        </div>

        {error && (
          <div className="mb-4 bg-red-100 text-red-600 p-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form
          onSubmit={
            handleLogin
          }
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full p-3 border rounded-xl"
          />

          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={
                password
              }
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full p-3 border rounded-xl"
            />

            <span
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-3 cursor-pointer"
            >
              {showPassword
                ? "🙈"
                : "👁️"}
            </span>

          </div>

          <button
            type="submit"
            disabled={
              loading
            }
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <div className="text-center mt-6 text-sm">

          Don’t have an account?{" "}

          <button
            onClick={() =>
              navigate(
                "/register"
              )
            }
            className="text-blue-600 font-semibold"
          >
            Register
          </button>

        </div>

        <button
          onClick={() =>
            navigate("/")
          }
          className="mt-5 w-full border py-3 rounded-xl"
        >
          Back Home
        </button>

      </div>

    </div>
  );
}