import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Subjects() {
  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  const role =
    localStorage.getItem("role");

  const paid =
    localStorage.getItem("paid");

  const subjectsList = [
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "Agriculture",
    "Geography",
    "History",
    "Divinity",
    "Economics",
    "Entrepreneurship",
    "SUB ICT",
    "SUB MATH"
  ];

  const subsidiarySubjects = [
    "SUB ICT",
    "SUB MATH"
  ];

  const plans = {
    A: {
      title: "Plan A",
      price: "UGX 100,000",
      subjects: 4
    },
    B: {
      title: "Plan B",
      price: "UGX 70,000",
      subjects: 3
    },
    C: {
      title: "Plan C",
      price: "UGX 40,000",
      subjects: 2
    }
  };

  const [plan, setPlan] =
    useState("");

  const [selected, setSelected] =
    useState([]);

  useEffect(() => {
    const sub =
      typeof user?.subscription ===
      "string"
        ? JSON.parse(
            user.subscription
          )
        : user?.subscription || {};

    if (
      role === "student" &&
      (paid === "true" ||
        sub.status ===
          "approved")
    ) {
      navigate("/dashboard");
    }
  }, [navigate, user, role, paid]);

  const toggleSubject = (
    subject
  ) => {
    if (!plan) {
      alert(
        "Select a plan first."
      );
      return;
    }

    const max =
      plans[plan].subjects;

    if (
      selected.includes(subject)
    ) {
      setSelected(
        selected.filter(
          (s) => s !== subject
        )
      );
      return;
    }

    if (
      selected.length >= max
    ) {
      alert(
        `Only ${max} subjects allowed in ${plans[plan].title}`
      );
      return;
    }

    setSelected([
      ...selected,
      subject
    ]);
  };

  const validatePlan = () => {
    const subsidiary =
      selected.filter((s) =>
        subsidiarySubjects.includes(
          s
        )
      ).length;

    const principal =
      selected.length -
      subsidiary;

    if (plan === "A") {
      if (
        principal !== 3 ||
        subsidiary !== 1
      ) {
        return "Plan A requires 3 principal subjects and 1 subsidiary.";
      }
    }

    if (plan === "B") {
      if (
        principal !== 2 ||
        subsidiary !== 1
      ) {
        return "Plan B requires 2 principal subjects and 1 subsidiary.";
      }
    }

    if (plan === "C") {
      if (
        principal !== 1 ||
        subsidiary !== 1
      ) {
        return "Plan C requires 1 principal subject and 1 subsidiary.";
      }
    }

    return null;
  };

  const proceed = () => {
    if (!plan) {
      alert("Choose a plan.");
      return;
    }

    if (
      selected.length === 0
    ) {
      alert(
        "Select subjects first."
      );
      return;
    }

    const error =
      validatePlan();

    if (error) {
      alert(error);
      return;
    }

    localStorage.setItem(
      "plan",
      plan
    );

    localStorage.setItem(
      "subjects",
      JSON.stringify(
        selected
      )
    );

    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-700">
            Choose Your Subjects
          </h1>

          <p className="text-gray-600 mt-3">
            Select a study plan and choose your subjects.
          </p>

          <p className="text-red-600 font-bold mt-4">
            A subsidiary is a must.
          </p>
        </div>

        {/* PLANS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          {Object.entries(plans).map(
            ([key, item]) => (
              <div
                key={key}
                onClick={() => {
                  setPlan(key);
                  setSelected([]);
                }}
                className={`cursor-pointer rounded-3xl p-7 shadow transition ${
                  plan === key
                    ? "bg-blue-600 text-white scale-105"
                    : "bg-white hover:shadow-xl"
                }`}
              >
                <h2 className="text-2xl font-bold">
                  {item.title}
                </h2>

                <p className="text-3xl font-bold mt-4">
                  {item.price}
                </p>

                <p className="mt-3">
                  {item.subjects} Subjects
                </p>
              </div>
            )
          )}

        </div>

        {/* SUBJECT COUNTER */}
        {plan && (
          <div className="mb-6 bg-white rounded-2xl p-5 shadow">
            <p className="font-semibold text-blue-700">
              Selected:
              {" "}
              {selected.length} /{" "}
              {
                plans[plan]
                  .subjects
              }
            </p>
          </div>
        )}

        {/* SUBJECTS */}
        <div className="grid md:grid-cols-4 gap-5 mb-10">

          {subjectsList.map(
            (subject) => (
              <div
                key={subject}
                onClick={() =>
                  toggleSubject(
                    subject
                  )
                }
                className={`cursor-pointer rounded-2xl p-5 text-center font-semibold shadow transition ${
                  selected.includes(
                    subject
                  )
                    ? "bg-green-500 text-white"
                    : "bg-white hover:shadow-xl"
                }`}
              >
                {subject}
              </div>
            )
          )}

        </div>

        {/* SELECTED */}
        <div className="bg-white rounded-2xl p-6 shadow mb-8">

          <h2 className="text-xl font-bold mb-4">
            Selected Subjects
          </h2>

          <div className="flex flex-wrap gap-3">

            {selected.length ===
            0 ? (
              <p className="text-gray-500">
                No subjects selected
              </p>
            ) : (
              selected.map(
                (item) => (
                  <span
                    key={item}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
                  >
                    {item}
                  </span>
                )
              )
            )}

          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-4">

          <button
            onClick={() =>
              navigate("/")
            }
            className="px-6 py-3 rounded-xl border"
          >
            Back
          </button>

          <button
            onClick={proceed}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold"
          >
            Continue to Payment →
          </button>

        </div>

      </div>

    </div>
  );
}