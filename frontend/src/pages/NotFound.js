import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 to-indigo-900 px-4">

      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">

        <h1 className="text-7xl font-bold text-blue-700 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-bold mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist
          or may have been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold"
        >
          Back to Home
        </button>

      </div>

    </div>
  );
}