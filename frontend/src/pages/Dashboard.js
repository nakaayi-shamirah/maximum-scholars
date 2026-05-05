import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "subjects", label: "Subjects" },
  { id: "materials", label: "Materials" },
  { id: "live", label: "Live Classes" },
  { id: "profile", label: "Profile" },
  { id: "about", label: "About" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [subjects, setSubjects] = useState(JSON.parse(localStorage.getItem("subjects")) || []);
  const [materials, setMaterials] = useState(JSON.parse(localStorage.getItem("materials")) || []);
  const [liveClasses, setLiveClasses] = useState([]);
  const [photo, setPhoto] = useState(localStorage.getItem("studentPhoto") || "");
  const [loading, setLoading] = useState(true);

  const API = "https://maximum-scholars-1-api.onrender.com";

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Could not fetch user");
        setUser(data);
        setSubjects(data.subjects || []);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("subjects", JSON.stringify(data.subjects || []));

        if (data.subscription?.status !== "approved") {
          navigate("/subjects");
          return;
        }
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };

    const fetchMaterials = async () => {
      try {
        const res = await fetch(`${API}/api/materials`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMaterials(data);
          localStorage.setItem("materials", JSON.stringify(data));
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchLive = async () => {
      try {
        const res = await fetch(`${API}/api/live`);
        const data = await res.json();
        if (Array.isArray(data)) setLiveClasses(data);
      } catch (error) {
        console.error(error);
      }
    };

    const load = async () => {
      await fetchUser();
      await fetchMaterials();
      await fetchLive();
      setLoading(false);
    };

    load();
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

  const myMaterials = materials.filter((material) => subjects.includes(material.subject));
  const currentLive = liveClasses.find((live) => subjects.includes(live.subject) && live.status === "live");

  const joinLive = () => {
    if (!currentLive) {
      alert("No active live class for your subjects.");
      return;
    }
    localStorage.setItem("liveClassStatus", "started");
    localStorage.setItem("liveTeacher", currentLive.teacherName || "Teacher");
    localStorage.setItem("liveSubject", currentLive.subject);
    localStorage.setItem("liveRoomId", currentLive.roomId);
    navigate("/live");
  };

  const theme = "bg-slate-100 text-slate-900";
  const card = "rounded-3xl bg-white p-6 shadow";

  return (
    <div className={`flex min-h-screen ${theme}`}>
      {menuOpen && <div onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-black/30 md:hidden" />}

      <aside className={`fixed z-50 h-full w-72 transform bg-gradient-to-b from-blue-700 to-indigo-900 text-white p-6 transition duration-300 md:relative md:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <h1 className="text-3xl font-bold mb-8">Maximo Scholars</h1>
        <nav className="space-y-3 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActive(tab.id);
                setMenuOpen(false);
              }}
              className={`w-full rounded-2xl px-4 py-3 text-left transition ${active === tab.id ? "bg-white/20" : "hover:bg-white/10"}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="mt-8 w-full rounded-2xl bg-red-500 py-3 font-semibold">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 md:ml-72">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 mb-2">Student Dashboard</p>
            <h1 className="text-4xl font-bold">Welcome back, {user.name}</h1>
            <p className="text-slate-600 mt-2 max-w-2xl">Your learning progress, materials, and live sessions are all organized in one responsive student dashboard.</p>
          </div>
          <button className="md:hidden rounded-2xl bg-slate-800 px-4 py-3 text-white" onClick={() => setMenuOpen(true)}>
            Menu
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-6">
          <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white shadow-xl">
            <p className="text-sm uppercase tracking-[0.2em]">Paid subjects</p>
            <p className="mt-4 text-4xl font-bold">{subjects.length}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Available materials</p>
            <p className="mt-4 text-4xl font-bold text-slate-900">{myMaterials.length}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Live sessions</p>
            <p className="mt-4 text-4xl font-bold text-slate-900">{currentLive ? 1 : 0}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Learning status</p>
            <p className="mt-4 text-4xl font-bold text-slate-900">Active</p>
          </div>
        </div>

        {loading ? (
          <div className={card}>Loading student dashboard...</div>
        ) : (
          <div className="space-y-6">
            {active === "dashboard" && (
              <div className="grid gap-6">
                <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Progress spotlight</p>
                      <h2 className="text-2xl font-semibold mt-2">Keep learning with your active subjects.</h2>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-4 py-3 text-slate-700">
                      Next live class: {currentLive ? currentLive.subject : "None scheduled"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {active === "subjects" && (
              <div className={card}>
                <h2 className="text-2xl font-semibold mb-4">Your Subjects</h2>
                {subjects.length === 0 ? (
                  <p className="text-slate-500">No paid subjects assigned yet.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {subjects.map((subject) => (
                      <div key={subject} className="rounded-3xl border p-5">
                        <p className="font-semibold">{subject}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {active === "materials" && (
              <div className={card}>
                <h2 className="text-2xl font-semibold mb-4">Materials</h2>
                {myMaterials.length === 0 ? (
                  <p className="text-slate-500">No materials available for your subjects.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {myMaterials.map((item) => (
                      <div key={item.id} className="rounded-3xl border border-slate-200 p-5 bg-slate-50 shadow-sm">
                        <div className="flex flex-col gap-4">
                          <div>
                            <p className="text-lg font-semibold">{item.title}</p>
                            <p className="text-sm text-slate-500">{item.subject}</p>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="rounded-full bg-white px-3 py-1 text-xs uppercase tracking-[0.15em] text-slate-600">{item.type || "Material"}</span>
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-2xl bg-blue-600 px-4 py-2 text-white"
                            >
                              Open
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {active === "live" && (
              <div className={card}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">Live Classes</h2>
                    <p className="text-slate-500">Join your scheduled and ongoing sessions from one place.</p>
                  </div>
                  {currentLive && (
                    <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">Live Now</span>
                  )}
                </div>

                {currentLive ? (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                      <p className="text-lg font-semibold">{currentLive.subject}</p>
                      <p className="mt-2 text-slate-600">Teacher: {currentLive.teacherName}</p>
                      <p className="text-sm text-slate-500">Room: {currentLive.roomId}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Ready to join?</p>
                        <p className="mt-2 text-xl font-semibold">Live session is available now.</p>
                      </div>
                      <button onClick={joinLive} className="rounded-2xl bg-blue-600 px-6 py-3 text-white">
                        Join Now
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
                    No active live class is running for your subjects yet. Check back later or contact your teacher for the next session.
                  </div>
                )}
              </div>
            )}

            {active === "profile" && (
              <div className={card}>
                <h2 className="text-2xl font-semibold mb-4">Profile</h2>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-slate-500">{user.email}</p>
                    <p className="text-slate-500">Role: Student</p>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold">Upload Photo</label>
                    <input type="file" onChange={uploadPhoto} className="w-full rounded-2xl border px-4 py-3" />
                    {photo && <img className="h-40 w-40 rounded-3xl object-cover" src={photo} alt="student" />}
                  </div>
                </div>
              </div>
            )}

            {active === "about" && (
              <div className={card}>
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <p>
                  Maximum Scholars connects paid students with live classes, teachers and learning materials. Only paid subjects are available after approval.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
