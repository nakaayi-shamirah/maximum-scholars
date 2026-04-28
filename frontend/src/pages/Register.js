import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      school: "",
      referral: "",
      password: "",
      confirmPassword: ""
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });

    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.school.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      return "Please fill all required fields.";
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        form.email
      )
    ) {
      return "Enter a valid email address.";
    }

    if (
      form.password.length < 6
    ) {
      return "Password must be at least 6 characters.";
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      return "Passwords do not match.";
    }

    return null;
  };

  const handleRegister =
    async (e) => {
      e.preventDefault();

      const validation =
        validate();

      if (validation) {
        setError(
          validation
        );
        return;
      }

      setLoading(true);

      try {
        const res =
          await fetch(
            "https://maximum-scholars-1-api.onrender.com",
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify(
                {
                  name:
                    form.name,
                  email:
                    form.email,
                  school:
                    form.school,
                  referral:
                    form.referral,
                  password:
                    form.password
                }
              )
            }
          );

        const data =
          await res.json();

        if (res.ok) {
          setSuccess(
            "Account created successfully."
          );

          setTimeout(
            () => {
              navigate(
                "/login"
              );
            },
            1500
          );
        } else {
          setError(
            data.message ||
              "Registration failed."
          );
        }

      } catch (error) {
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
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-indigo-900 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-blue-700">
            Maximo Scholars Uganda
          </h1>

          <p className="text-gray-500 mt-2">
            Create Your Student Account
          </p>

        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl text-sm mb-4 text-center">
            {success}
          </div>
        )}

        <form
          onSubmit={
            handleRegister
          }
          className="space-y-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={
              form.name
            }
            onChange={
              handleChange
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={
              form.email
            }
            onChange={
              handleChange
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            name="school"
            placeholder="School Name"
            value={
              form.school
            }
            onChange={
              handleChange
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            name="referral"
            placeholder="Referral (Optional)"
            value={
              form.referral
            }
            onChange={
              handleChange
            }
            className="w-full border p-3 rounded-xl"
          />

          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              className="w-full border p-3 rounded-xl"
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

          <div className="relative">

            <input
              type={
                showConfirm
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm Password"
              value={
                form.confirmPassword
              }
              onChange={
                handleChange
              }
              className="w-full border p-3 rounded-xl"
            />

            <span
              onClick={() =>
                setShowConfirm(
                  !showConfirm
                )
              }
              className="absolute right-4 top-3 cursor-pointer"
            >
              {showConfirm
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
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-600">

          Already have an account?{" "}

          <button
            onClick={() =>
              navigate(
                "/login"
              )
            }
            className="text-blue-600 font-semibold"
          >
            Login
          </button>

        </div>

        <button
          onClick={() =>
            navigate("/")
          }
          className="mt-5 w-full border py-3 rounded-xl"
        >
          Back to Home
        </button>

      </div>

    </div>
  );
}