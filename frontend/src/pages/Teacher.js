import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Teacher() {
  const navigate = useNavigate();

  const [active, setActive] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  /* =========================
     ✅ LIVE CLASS FUNCTION (ONLY ONCE)
  ========================= /
  const startLiveClass = async (subject) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch(
        "https://maximum-scholars-1-api.onrender.com/api/live/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            subject,
            teacherId: user?.id,
            teacherName: user?.name,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Live class started 🚀");
      } else {
        alert(data.message || "Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  / =========================
     YOUR ORIGINAL STATES (UNCHANGED)
  ========================= /
  const [photo, setPhoto] = useState(localStorage.getItem("teacherPhoto") || "");

  const teacher = JSON.parse(localStorage.getItem("user")) || {};

  const teacherName = teacher.name || "Teacher";
  const teacherEmail = teacher.email || "teacher@gmail.com";

  const subjects =
    JSON.parse(localStorage.getItem("teacherSubjects")) ||
    teacher.assignedSubjects ||
    ["Mathematics"];

  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
  const results = JSON.parse(localStorage.getItem("quizResults")) || [];
  const materials = JSON.parse(localStorage.getItem("materials")) || [];
  const notifications =
    JSON.parse(localStorage.getItem("teacherNotifications")) || [];
  const attendance =
    JSON.parse(localStorage.getItem("liveAttendance")) || [];

  const liveStatus = localStorage.getItem("liveClassStatus");
  const liveSubject = localStorage.getItem("liveSubject");

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(subjects[0] || "");
  const [link, setLink] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const theme =
    darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black";

  const card =
    darkMode ? "bg-gray-800 text-white" : "bg-white text-black";

  const myQuizzes = quizzes.filter((q) => q.teacher === teacherName);
  const myResults = results.filter((r) =>
    subjects.includes(r.subject)
  );
  const myMaterials = materials.filter((m) =>
    subjects.includes(m.subject)
  );

  const average =
    myResults.length === 0
      ? 0
      : Math.round(
          myResults.reduce((a, b) => a + b.score, 0) /
            myResults.length
        );

  const uploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
      localStorage.setItem("teacherPhoto", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadMaterial = () => {
    if (!title || !subject || !link) {
      alert("Fill all fields");
      return;
    }

    const updated = [
      {
        id: Date.now(),
        title,
        subject,
        link,
        teacher: teacherName,
      },
      ...materials,
    ];

    localStorage.setItem("materials", JSON.stringify(updated));
    alert("Material uploaded");
    setTitle("");
    setLink("");
  };

  const createQuiz = () => {
    if (!quizTitle || !question || !answer) {
      alert("Fill all fields");
      return;
    }

    const updated = [
      {
        id: Date.now(),
        title: quizTitle,
        subject,
        question,
        answer,
        teacher: teacherName,
      },
      ...quizzes,
    ];

    localStorage.setItem("quizzes", JSON.stringify(updated));
    alert("Quiz created");
    setQuizTitle("");
    setQuestion("");
    setAnswer("");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  / =========================
     UI
  ========================= /
  return (
    <div className={flex min-h-screen ${theme}}>
      <div className="w-72 bg-gradient-to-b from-green-700 to-emerald-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-8">Teacher Panel</h1>

        <ul className="space-y-3 text-sm">
          <li onClick={()=>setActive("dashboard")} className="cursor-pointer p-3">Dashboard</li>
          <li onClick={()=>setActive("live")} className="cursor-pointer p-3">Live Classes</li>
        </ul>

        <button onClick={logout} className="mt-8 w-full bg-red-500 py-3 rounded-xl">
          Logout
        </button>
      </div>

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-8">
          Welcome, {teacherName}
        </h1>

        {/ LIVE */}
        {active === "live" && (
          <div className={`${card} p-6`}>
            <button
              onClick={() => startLiveClass("Mathematics")}
              className="bg-green-600 text-white px-4 py-2 rounded-xl mb-4"
            >
              Start Mathematics Live
            </button>

            {subjects.map((item) => (
              <button
                key={item}
                onClick={() => startLiveClass(item)}
                className="block bg-green-500 text-white px-5 py-3 rounded-xl mb-2"
              >
                Start {item}
              </button>
            ))}
              </div>
            );
            }
         
    