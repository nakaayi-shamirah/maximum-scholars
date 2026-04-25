import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const storedUser =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  const role =
    localStorage.getItem("role") ||
    "student";

  const [name, setName] =
    useState(
      storedUser.name || ""
    );

  const [email, setEmail] =
    useState(
      storedUser.email || ""
    );

  const [password, setPassword] =
    useState("");

  const saveProfile = () => {
    const updatedUser = {
      ...storedUser,
      name,
      email
    };

    localStorage.setItem(
      "user",
      JSON.stringify(
        updatedUser
      )
    );

    if (password) {
      localStorage.setItem(
        "password",
        password
      );
    }

    alert(
      "Profile updated successfully."
    );
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-blue-700">
            My Profile 👤
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your account information
          </p>

        </div>

        <div className="space-y-5">

          <div>
            <label className="block mb-2 font-semibold">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="w-full border p-3 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full border p-3 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Leave blank if unchanged"
              className="w-full border p-3 rounded-xl"
            />
          </div>

          <div className="bg-gray-100 p-4 rounded-xl">
            <p>
              <strong>
                Role:
              </strong>{" "}
              {role}
            </p>
          </div>

          <button
            onClick={
              saveProfile
            }
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            Save Changes
          </button>

          <button
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="w-full border py-3 rounded-xl"
          >
            Back
          </button>

          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-3 rounded-xl"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}