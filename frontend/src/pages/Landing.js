import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const subjects = [
    "Biology",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Geography",
    "Economics",
    "History",
    "Divinity",
    "Entrepreneurship",
    "Agriculture",
    " SUB ICT",
    "SUB MATH"
  ];

  const features = [
    "Expert A-Level Teachers",
    "Live Interactive Classes",
    "Study Materials & Notes",
    "Quiz & Progress Tracking",
    "Learn Anywhere in Uganda",
    "Affordable Monthly Access"
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-5 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700">
          Maximum Scholars Uganda
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-xl border border-blue-600 text-blue-700 font-semibold"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 rounded-xl bg-green-500 text-white font-semibold"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white px-8 py-20">

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <div>
            <p className="uppercase tracking-widest text-sm mb-4">
              Uganda's Smart Learning Platform
            </p>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Learn Anytime,
              <br />
              Anywhere.
            </h1>

            <p className="text-lg text-blue-100 mb-8">
              Premium online learning for A-Level students in Uganda.
              Live classes, expert teachers, study materials,
              quizzes, and academic success.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => navigate("/register")}
                className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
              >
                Join Now
              </button>

              <button
                onClick={() => navigate("/login")}
                className="border border-white px-6 py-3 rounded-xl font-semibold"
              >
                Student Login
              </button>
            </div>
          </div>

          <div className="bg-white text-gray-800 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
              Why Students Choose Us
            </h2>

            <div className="space-y-4">
              {features.map((item) => (
                <div
                  key={item}
                  className="bg-gray-100 p-4 rounded-xl"
                >
                  ✅ {item}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ABOUT */}
      <div className="px-8 py-20 max-w-6xl mx-auto">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4 text-blue-700">
            About Maximum Scholars
          </h2>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Maximum Scholars Uganda is a modern online learning
            platform built to help A-Level students achieve academic
            excellence through expert guidance, flexible digital
            learning, and exam-focused teaching.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-blue-50 p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-3 text-blue-700">
              Professional Teachers
            </h3>

            <p>
              Learn from experienced educators committed to results.
            </p>
          </div>

          <div className="bg-green-50 p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-3 text-green-700">
              Flexible Learning
            </h3>

            <p>
              Study using your phone or laptop from anywhere.
            </p>
          </div>

          <div className="bg-indigo-50 p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-3 text-indigo-700">
              Better Performance
            </h3>

            <p>
              Practice with quizzes, materials, and live classes.
            </p>
          </div>

        </div>
      </div>

      {/* SUBJECTS */}
      <div className="bg-gray-100 px-8 py-20">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-700 mb-4">
              Subjects Offered
            </h2>

            <p className="text-gray-600">
              Carefully designed for Uganda A-Level learners.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-5">

            {subjects.map((subject) => (
              <div
                key={subject}
                className="bg-white p-5 rounded-2xl shadow text-center font-semibold"
              >
                {subject}
              </div>
            ))}

          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="px-8 py-20 text-center">

        <h2 className="text-4xl font-bold text-blue-700 mb-4">
          Ready to Unlock Your Potential?
        </h2>

        <p className="text-gray-600 text-lg mb-8">
          Join Maximum Scholars Uganda today and start learning smarter.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg"
        >
          Create Free Account
        </button>
      </div>

      {/* FOOTER */}
      <div className="bg-indigo-900 text-white px-8 py-10 text-center">
        <h2 className="text-2xl font-bold mb-2">
          Maximum Scholars Uganda
        </h2>

        <p className="text-blue-100">
          Learn Anytime, Anywhere.
        </p>

        <p className="mt-4 text-sm text-blue-200">
          © 2026 Maximum Scholars Uganda. All Rights Reserved.
        </p>
      </div>

    </div>
  );
}