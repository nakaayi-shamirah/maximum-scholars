import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [active, setActive] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  /* MOBILE MENU */
  const [menuOpen, setMenuOpen] = useState(false);

  const [photo, setPhoto] = useState(
    localStorage.getItem("studentPhoto") || ""
  );

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const subjects =
    JSON.parse(localStorage.getItem("subjects")) || [];

  const materials =
    JSON.parse(localStorage.getItem("materials")) || [];

  const results =
    JSON.parse(localStorage.getItem("quizResults")) || [];

  console.log("USER:", user);
  console.log("SUBJECTS:", subjects);
  console.log("MATERIALS:", materials);
  console.log("RESULTS:", results);

  /* ✅ NEW STATE (ADDED — DO NOT REMOVE YOUR ORIGINALS) */
  const [userState, setUserState] = useState(user);
  const [subjectsState, setSubjectsState] = useState(subjects);

  const notices =
    JSON.parse(localStorage.getItem("studentNotifications")) || [];

  const expiryDate = "1 June 2026";

  const liveStatus = localStorage.getItem("liveClassStatus");
  const liveTeacher = localStorage.getItem("liveTeacher");
  const liveSubject = localStorage.getItem("liveSubject");

  useEffect(() => {
    const API = "https://maximum-scholars-1-api.onrender.com";

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log("BACKEND USER:", data);

        // update localStorage
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem(
          "subjects",
          JSON.stringify(data.subjects || [])
        );

        /* ✅ UPDATE REACT STATE */
        setUserState(data);
        setSubjectsState(data.subjects || []);

      } catch (error) {
        console.error("FETCH USER ERROR:", error);
      }
    };

    fetchUser();

    const role = localStorage.getItem("role");

    if (role !== "student") {
      navigate("/login");
      return;
    }

    const currentUser =
      JSON.parse(localStorage.getItem("user")) || {};

    const sub =
      typeof currentUser?.subscription === "string"
        ? JSON.parse(currentUser.subscription)
        : currentUser.subscription || {};

    if (sub.status !== "approved") {
      navigate("/subjects");
      return;
    }

    const today = new Date();

    const expiry = new Date("2026-06-01T23:59:59");

    if (today > expiry) {
      localStorage.clear();
      alert("Subscription expired.");
      navigate("/subjects");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const uploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result);
      localStorage.setItem("studentPhoto", reader.result);
    };

    reader.readAsDataURL(file);
  };

  const myResults = results.filter(
    (item) => item.student === userState.name
  );

  const average =
    myResults.length === 0
      ? 0
      : Math.round(
          myResults.reduce((a, b) => a + b.score, 0) /
            myResults.length
        );

  const myMaterials = materials.filter((item) =>
    subjectsState.includes(item.subject)
  );

  const theme = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gray-100 text-black";

  const card = darkMode
    ? "bg-gray-800 text-white"
    : "bg-white text-black";

  const icons = {
    Mathematics: "🧮",
    Physics: "⚡",
    Chemistry: "🧪",
    Biology: "🌿",
    Geography: "🌍",
    Economics: "💰",
    History: "📜",
    Divinity: "⛪",
    Entrepreneurship: "🚀",
    ICT: "💻",
    Agriculture: "🌱",
    "SUB ICT": "💻",
    "SUB MATH": "🧮",
  };

  return (
    <div className={`flex min-h-screen ${theme}`}>
      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        fixed md:relative
        z-50 md:z-auto
        h-full
        w-72
        bg-gradient-to-b
        from-blue-700
        to-indigo-900
        text-white
        p-6
        transition-transform
        duration-300
      `}
      >
        <h1 className="text-3xl font-bold mb-8">
          Maximo Scholars
        </h1>

        <ul className="space-y-3 text-sm">
          <li onClick={()=>{setActive("dashboard");setMenuOpen(false);}} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">📊 Dashboard</li>
          <li onClick={()=>{setActive("subjects");setMenuOpen(false);}} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">📚 Subjects</li>
          <li onClick={()=>{setActive("materials");setMenuOpen(false);}} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">📄 Materials</li>
          <li onClick={()=>{setActive("quizzes");setMenuOpen(false);}} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">📝 Quizzes</li>
          <li onClick={()=>{setActive("live");setMenuOpen(false);}} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">🎥 Live Classes</li>
          <li onClick={()=>{setActive("timetable");setMenuOpen(false);}} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">🗓️ Timetable</li>
          <li onClick={()=>{setActive("profile");setMenuOpen(false);}} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">👤 Profile</li>
          <li onClick={()=>{setActive("settings");setMenuOpen(false);}} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">⚙️ Settings</li>
          <li onClick={()=>{setActive("about");setMenuOpen(false);}} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">ℹ️ About</li>
          <li onClick={()=>{setActive("support");setMenuOpen(false);}} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">💬 Support</li>
        </ul>

        <button
          onClick={logout}
          className="mt-8 w-full bg-red-500 py-3 rounded-xl"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-4 md:p-8 w-full">
        <h1 className="text-2xl md:text-4xl font-bold mb-8">
          Welcome, {userState.name} 👋
        </h1>

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className={`${card} p-6 rounded-2xl shadow`}>
              <p>Subjects</p>
              <h2 className="text-3xl font-bold text-blue-500">
                {subjectsState.length}
              </h2>
            </div>

            <div className={`${card} p-6 rounded-2xl shadow`}>
              <p>Materials</p>
              <h2 className="text-3xl font-bold text-green-500">
                {myMaterials.length}
              </h2>
            </div>

            <div className={`${card} p-6 rounded-2xl shadow`}>
              <p>Average Score</p>
              <h2 className="text-3xl font-bold text-purple-500">
                {average}%
              </h2>
            </div>

            <div className={`${card} p-6 rounded-2xl shadow`}>
              <p>Subscription</p>
              <h2 className="text-xl font-bold text-red-500">
                {expiryDate}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}