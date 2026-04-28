import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const API = "https://maximum-scholars-1-api.onrender.com";

  const [active, setActive] =
    useState("dashboard");

  const [darkMode, setDarkMode] =
    useState(false);

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [teacherForm, setTeacherForm] =
    useState({
      name: "",
      email: "",
      password: "",
      subjects: ""
    });

  const admin =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    ) || {};

  const materials =
    JSON.parse(
      localStorage.getItem(
        "materials"
      )
    ) || [];

  const results =
    JSON.parse(
      localStorage.getItem(
        "quizResults"
      )
    ) || [];

  const photo =
    localStorage.getItem(
      "adminPhoto"
    ) || "";

  const liveStatus =
    localStorage.getItem(
      "liveClassStatus"
    );

  const liveTeacher =
    localStorage.getItem(
      "liveTeacher"
    );

  const liveSubject =
    localStorage.getItem(
      "liveSubject"
    );

  const allSubjects = [
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

  const theme =
    darkMode
      ? "bg-gray-900 text-white"
      : "bg-gray-100 text-black";

  const card =
    darkMode
      ? "bg-gray-800 text-white"
      : "bg-white text-black";

  const fetchUsers =
    async () => {
      try {
        const res =
          await fetch(
            `${API}/api/users`
          );

        const data =
          await res.json();

        setUsers(data);

      } catch (error) {
        console.error(error);

      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchUsers();
  }, []);

  const parseSub = (v) => {
    if (!v) return {};

    if (
      typeof v ===
      "string"
    ) {
      try {
        return JSON.parse(v);
      } catch {
        return {};
      }
    }

    return v;
  };

  const approveUser =
    async (id) => {
      await fetch(
        `${API}/api/users/approve/${id}`,
        {
          method: "PUT"
        }
      );

      fetchUsers();
    };

  const rejectUser =
    async (id) => {
      await fetch(
        `${API}/api/users/reject/${id}`,
        {
          method: "PUT"
        }
      );

      fetchUsers();
    };

  const deleteUser =
    async (id) => {
      const ok =
        window.confirm(
          "Delete user?"
        );

      if (!ok) return;

      await fetch(
        `${API}/api/users/${id}`,
        {
          method:
            "DELETE"
        }
      );

      fetchUsers();
    };

  const createTeacher =
    async () => {
      if (
        !teacherForm.name ||
        !teacherForm.email ||
        !teacherForm.password
      ) {
        alert(
          "Fill all teacher fields"
        );
        return;
      }

      const token =
        localStorage.getItem(
          "token"
        );

      const subjects =
        teacherForm.subjects
          .split(",")
          .map((s) =>
            s.trim()
          )
          .filter(Boolean);

      const res =
        await fetch(
          `${API}/api/auth/create-teacher`,
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`
            },
            body: JSON.stringify(
              {
                name:
                  teacherForm.name,
                email:
                  teacherForm.email,
                password:
                  teacherForm.password,
                assignedSubjects:
                  subjects
              }
            )
          }
        );

      const data =
        await res.json();

      alert(
        data.message
      );

      setTeacherForm({
        name: "",
        email: "",
        password: "",
        subjects: ""
      });

      fetchUsers();
    };

  const endLiveClass =
    () => {
      localStorage.setItem(
        "liveClassStatus",
        "ended"
      );

      localStorage.removeItem(
        "liveTeacher"
      );

      localStorage.removeItem(
        "liveSubject"
      );

      alert(
        "Live class ended"
      );

      window.location.reload();
    };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const students =
    users.filter(
      (u) =>
        u.role ===
        "student"
    );

  const teachers =
    users.filter(
      (u) =>
        u.role ===
        "teacher"
    );

  const pending =
    students.filter(
      (u) =>
        parseSub(
          u.subscription
        ).status ===
        "pending"
    );

  const approved =
    students.filter(
      (u) =>
        parseSub(
          u.subscription
        ).status ===
        "approved"
    );

  const filtered =
    users.filter(
      (u) =>
        u.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        u.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const ranked =
    [...results].sort(
      (a, b) =>
        b.score -
        a.score
    );

  return (
    <div className={`flex min-h-screen ${theme}`}>

      {/* SIDEBAR */}
      <div className="w-72 bg-gradient-to-b from-indigo-700 to-blue-900 text-white p-6">

        <h1 className="text-3xl font-bold mb-8">
          Admin Panel
        </h1>

        <ul className="space-y-3 text-sm">

          <li onClick={()=>setActive("dashboard")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">📊 Dashboard</li>

          <li onClick={()=>setActive("teachers")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">👨‍🏫 Teachers</li>

          <li onClick={()=>setActive("payments")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">💳 Payments</li>

          <li onClick={()=>setActive("users")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">👥 Users</li>

          <li onClick={()=>setActive("reports")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">📈 Reports</li>

          <li onClick={()=>setActive("materials")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">📚 Materials</li>

          <li onClick={()=>setActive("live")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">🎥 Live Classes</li>

          <li onClick={()=>setActive("profile")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">👤 Profile</li>

          <li onClick={()=>setActive("settings")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">⚙️ Settings</li>

          <li onClick={()=>setActive("about")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">ℹ️ About</li>

        </ul>

        <button
          onClick={logout}
          className="mt-8 w-full bg-red-500 py-3 rounded-xl"
        >
          Logout
        </button>

      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Welcome, {admin.name || "Admin"} 👑
        </h1>

        {loading && (
          <p>Loading...</p>
        )}

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div className="grid md:grid-cols-4 gap-6">

            <div className={`${card} p-6 rounded-2xl shadow`}>
              <p>Students</p>
              <h2 className="text-3xl font-bold text-blue-500">
                {students.length}
              </h2>
            </div>

            <div className={`${card} p-6 rounded-2xl shadow`}>
              <p>Teachers</p>
              <h2 className="text-3xl font-bold text-green-500">
                {teachers.length}
              </h2>
            </div>

            <div className={`${card} p-6 rounded-2xl shadow`}>
              <p>Pending</p>
              <h2 className="text-3xl font-bold text-orange-500">
                {pending.length}
              </h2>
            </div>

            <div className={`${card} p-6 rounded-2xl shadow`}>
              <p>Approved</p>
              <h2 className="text-3xl font-bold text-purple-500">
                {approved.length}
              </h2>
            </div>

          </div>
        )}

        {/* TEACHERS */}
        {active === "teachers" && (
          <div className={`${card} p-8 rounded-2xl shadow space-y-4`}>

            <h2 className="text-2xl font-bold">
              Create Teacher
            </h2>

            <input placeholder="Full Name" value={teacherForm.name} onChange={(e)=>setTeacherForm({...teacherForm,name:e.target.value})} className="w-full border p-3 rounded-xl text-black" />

            <input placeholder="Email" value={teacherForm.email} onChange={(e)=>setTeacherForm({...teacherForm,email:e.target.value})} className="w-full border p-3 rounded-xl text-black" />

            <input placeholder="Password" value={teacherForm.password} onChange={(e)=>setTeacherForm({...teacherForm,password:e.target.value})} className="w-full border p-3 rounded-xl text-black" />

            <input placeholder="Subjects separated by commas" value={teacherForm.subjects} onChange={(e)=>setTeacherForm({...teacherForm,subjects:e.target.value})} className="w-full border p-3 rounded-xl text-black" />

            <button onClick={createTeacher} className="bg-green-500 text-white px-6 py-3 rounded-xl">
              Create Teacher
            </button>

          </div>
        )}

        {/* PAYMENTS */}
        {active === "payments" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            <h2 className="text-2xl font-bold mb-6">
              Payment Requests
            </h2>

            {pending.map((u)=>(
              <div key={u.id} className="border-b py-4 flex justify-between">

                <div>
                  <p className="font-bold">{u.name}</p>
                  <p>{u.email}</p>
                </div>

                <div className="space-x-2">
                  <button onClick={()=>approveUser(u.id)} className="bg-green-500 text-white px-4 py-2 rounded-xl">
                    Approve
                  </button>

                  <button onClick={()=>rejectUser(u.id)} className="bg-red-500 text-white px-4 py-2 rounded-xl">
                    Reject
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

        {/* USERS */}
        {active === "users" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            <input
              placeholder="Search users..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="w-full border p-3 rounded-xl mb-6 text-black"
            />

            {filtered.map((u)=>(
              <div key={u.id} className="border-b py-4 flex justify-between">

                <div>
                  <p className="font-bold">{u.name}</p>
                  <p>{u.email} ({u.role})</p>
                </div>

                <button onClick={()=>deleteUser(u.id)} className="bg-red-500 text-white px-4 py-2 rounded-xl">
                  Delete
                </button>

              </div>
            ))}

          </div>
        )}

        {/* REPORTS */}
        {active === "reports" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            <h2 className="text-2xl font-bold mb-6">
              Student Ranking
            </h2>

            {ranked.map((r,index)=>(
              <div key={index} className="border-b py-3">
                {index+1}. {r.student} - {r.subject} ({r.score}%)
              </div>
            ))}

          </div>
        )}

        {/* MATERIALS */}
        {active === "materials" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            <h2 className="text-2xl font-bold mb-6">
              All Materials
            </h2>

            {materials.map((m)=>(
              <div key={m.id} className="border-b py-4">
                <p className="font-bold">{m.title}</p>
                <p>{m.subject}</p>
              </div>
            ))}

          </div>
        )}

        {/* LIVE */}
        {active === "live" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            <h2 className="text-2xl font-bold mb-6">
              Live Classes
            </h2>

            <p className="mb-2">
              Status: {liveStatus === "started" ? "🟢 LIVE" : "🔴 OFFLINE"}
            </p>

            <p className="mb-2">
              Teacher: {liveTeacher || "None"}
            </p>

            <p className="mb-6">
              Subject: {liveSubject || "None"}
            </p>

            <div className="grid md:grid-cols-3 gap-5">

              {allSubjects.map((item)=>(
                <div
                  key={item}
                  className="border rounded-2xl p-5"
                >
                  <h3 className="font-bold text-lg mb-4">
                    {item}
                  </h3>

                  {liveStatus === "started" &&
                  liveSubject === item ? (
                    <>
                      <p className="text-green-600 font-semibold mb-4">
                        LIVE NOW
                      </p>

                      <div className="flex gap-3">

                        <button
                          onClick={()=>navigate("/live")}
                          className="bg-green-500 text-white px-4 py-2 rounded-xl"
                        >
                          Join
                        </button>

                        <button
                          onClick={endLiveClass}
                          className="bg-red-500 text-white px-4 py-2 rounded-xl"
                        >
                          End
                        </button>

                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">
                      Offline
                    </p>
                  )}

                </div>
              ))}

            </div>

          </div>
        )}

        {/* PROFILE */}
        {active === "profile" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            {photo && (
              <img
                src={photo}
                alt=""
                className="w-28 h-28 rounded-full mb-4 object-cover"
              />
            )}

            <p><strong>Name:</strong> {admin.name}</p>
            <p><strong>Email:</strong> {admin.email}</p>

          </div>
        )}

        {/* SETTINGS */}
        {active === "settings" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            <button
              onClick={()=>setDarkMode(!darkMode)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
            >
              Toggle {darkMode ? "Light" : "Dark"} Mode
            </button>

          </div>
        )}

        {/* ABOUT */}
        {active === "about" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            <h2 className="text-3xl font-bold mb-4">
              About Maximo Scholars Uganda
            </h2>

            <p>
              Your premier learning platform for students.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}