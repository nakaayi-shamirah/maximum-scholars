import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Teacher() {
  const navigate = useNavigate();
  const API = "https://maximum-scholars-1-api.onrender.com";
  const [active, setActive] = useState("dashboard");
  const [teacher, setTeacher] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const SUBJECT_OPTIONS = [
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
    "SUB MATH",
  ];

  const [assignedSubjects, setAssignedSubjects] = useState(teacher.assignedSubjects || []);
  const [materials, setMaterials] = useState(JSON.parse(localStorage.getItem("materials")) || []);
  const [newMaterialTitle, setNewMaterialTitle] = useState("");
  const [newMaterialSubject, setNewMaterialSubject] = useState(teacher.assignedSubjects?.[0] || SUBJECT_OPTIONS[0]);
  const [newMaterialType, setNewMaterialType] = useState("Reading Material");
  const [newMaterialLink, setNewMaterialLink] = useState("");
  const [newMaterialDescription, setNewMaterialDescription] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "teacher") {
      navigate("/login");
      return;
    }

    const fetchTeacher = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Could not fetch teacher");
        setTeacher(data);
        setAssignedSubjects(data.assignedSubjects || []);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error(error);
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
        const res = await fetch(`${API}/api/live?all=true`);
        const data = await res.json();
        if (Array.isArray(data)) setLiveClasses(data);
      } catch (error) {
        console.error(error);
      }
    };

    const load = async () => {
      await fetchTeacher();
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

  const subjectMaterials = materials.filter((item) => assignedSubjects.includes(item.subject));
  const currentLive = liveClasses.filter((live) => live.teacherId === teacher.id && live.status === "live");

  const handleStartLive = async (subject) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/live/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          teacherId: teacher.id,
          teacherName: teacher.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to start live class");
      localStorage.setItem("liveClassStatus", "started");
      localStorage.setItem("liveTeacher", teacher.name);
      localStorage.setItem("liveSubject", data.subject);
      localStorage.setItem("liveRoomId", data.roomId);
      navigate("/live");
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to start live class.");
    }
  };

  const handleUploadMaterial = async () => {
    if (!newMaterialTitle || !newMaterialSubject || !newMaterialLink || !newMaterialType) {
      setUploadError("Please fill in all required material fields.");
      setUploadMessage("");
      return;
    }

    setUploadError("");
    setUploadMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/materials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newMaterialTitle,
          subject: newMaterialSubject,
          link: newMaterialLink,
          teacher: teacher.name || "Teacher",
          type: newMaterialType,
          description: newMaterialDescription,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to upload material");
      }

      setUploadMessage("Material uploaded successfully.");
      setNewMaterialTitle("");
      setNewMaterialLink("");
      setNewMaterialDescription("");
      setNewMaterialType("Reading Material");
      setNewMaterialSubject(assignedSubjects[0] || SUBJECT_OPTIONS[0]);
      await fetchMaterials();
    } catch (error) {
      console.error(error);
      setUploadError(error.message || "Upload failed.");
    }
  };

  const theme = "bg-slate-100 text-slate-900";
  const card = "rounded-3xl bg-white p-6 shadow";

  return (
    <div className={`flex min-h-screen ${theme}`}>
      <aside className="w-72 bg-gradient-to-b from-emerald-700 to-slate-900 text-white p-6 hidden md:block">
        <h1 className="text-3xl font-bold mb-8">Teacher Panel</h1>
        <nav className="space-y-3 text-sm">
          <button className={`w-full rounded-2xl px-4 py-3 text-left ${active === "dashboard" ? "bg-white/20" : "hover:bg-white/10"}`} onClick={() => setActive("dashboard")}>Dashboard</button>
          <button className={`w-full rounded-2xl px-4 py-3 text-left ${active === "live" ? "bg-white/20" : "hover:bg-white/10"}`} onClick={() => setActive("live")}>Live Classes</button>
          <button className={`w-full rounded-2xl px-4 py-3 text-left ${active === "materials" ? "bg-white/20" : "hover:bg-white/10"}`} onClick={() => setActive("materials")}>Materials</button>
          <button className={`w-full rounded-2xl px-4 py-3 text-left ${active === "profile" ? "bg-white/20" : "hover:bg-white/10"}`} onClick={() => setActive("profile")}>Profile</button>
        </nav>
        <button onClick={logout} className="mt-8 w-full rounded-2xl bg-red-500 py-3 font-semibold">Logout</button>
      </aside>

      <main className="flex-1 p-6 md:p-10 md:ml-72">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Welcome, {teacher.name}</h1>
            <p className="text-slate-600 mt-2">Manage your assigned subjects and launch live classes.</p>
          </div>
          <div className="space-y-2 text-right">
            <p className="text-slate-500">Subjects assigned: {assignedSubjects.length}</p>
            <p className="text-slate-500">Current live sessions: {currentLive.length}</p>
          </div>
        </div>

        {loading ? (
          <div className={card}>Loading teacher dashboard...</div>
        ) : (
          <div className="space-y-6">
            {active === "dashboard" && (
              <div className="grid gap-6 md:grid-cols-3">
                <div className={card}>
                  <p className="text-sm uppercase text-slate-500">Assigned Subjects</p>
                  <p className="mt-4 text-4xl font-bold">{assignedSubjects.length}</p>
                </div>
                <div className={card}>
                  <p className="text-sm uppercase text-slate-500">Materials</p>
                  <p className="mt-4 text-4xl font-bold">{subjectMaterials.length}</p>
                </div>
                <div className={card}>
                  <p className="text-sm uppercase text-slate-500">Live Sessions</p>
                  <p className="mt-4 text-4xl font-bold">{currentLive.length}</p>
                </div>
              </div>
            )}

            {active === "live" && (
              <div className={card}>
                <h2 className="text-2xl font-semibold mb-4">Start Live Class</h2>
                {assignedSubjects.length === 0 ? (
                  <p className="text-slate-500">No subjects assigned yet.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {assignedSubjects.map((subject) => (
                      <div key={subject} className="rounded-3xl border p-5">
                        <p className="font-semibold">{subject}</p>
                        <button
                          onClick={() => handleStartLive(subject)}
                          className="mt-4 w-full rounded-2xl bg-green-600 px-4 py-3 text-white"
                        >
                          Start {subject}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {active === "materials" && (
              <div className={card}>
                <div className="mb-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <h2 className="text-2xl font-semibold mb-3">Materials for your subjects</h2>
                    <p className="text-slate-500">
                      Upload reading materials, tests, quizzes, and reference resources for your assigned subjects.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 mb-6">
                  <div>
                    <p className="text-lg font-semibold mb-2">Add new material</p>
                    <p className="text-sm text-slate-500">Share useful material with students in a few clicks.</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={newMaterialTitle}
                      onChange={(e) => setNewMaterialTitle(e.target.value)}
                      placeholder="Title"
                      className="rounded-2xl border px-4 py-3"
                    />
                    <select
                      value={newMaterialSubject}
                      onChange={(e) => setNewMaterialSubject(e.target.value)}
                      className="rounded-2xl border px-4 py-3"
                    >
                      {(assignedSubjects.length ? assignedSubjects : SUBJECT_OPTIONS).map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    <select
                      value={newMaterialType}
                      onChange={(e) => setNewMaterialType(e.target.value)}
                      className="rounded-2xl border px-4 py-3"
                    >
                      <option>Reading Material</option>
                      <option>Test</option>
                      <option>Quiz</option>
                      <option>Other</option>
                    </select>
                    <input
                      value={newMaterialLink}
                      onChange={(e) => setNewMaterialLink(e.target.value)}
                      placeholder="Resource link"
                      className="rounded-2xl border px-4 py-3"
                    />
                  </div>

                  <textarea
                    value={newMaterialDescription}
                    onChange={(e) => setNewMaterialDescription(e.target.value)}
                    placeholder="Brief description (optional)"
                    className="w-full rounded-3xl border px-4 py-3"
                    rows={4}
                  />

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      {uploadMessage && <p className="text-sm text-emerald-700">{uploadMessage}</p>}
                      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                    </div>
                    <button
                      onClick={handleUploadMaterial}
                      className="w-full rounded-2xl bg-emerald-600 px-6 py-3 text-white sm:w-auto"
                    >
                      Upload Material
                    </button>
                  </div>
                </div>

                {subjectMaterials.length === 0 ? (
                  <p className="text-slate-500">No materials uploaded for your assigned subjects.</p>
                ) : (
                  <div className="grid gap-4">
                    {subjectMaterials.map((item) => (
                      <div key={item.id} className="rounded-3xl border p-5 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-lg font-semibold">{item.title}</p>
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.08em] text-slate-600">
                                {item.type || "Resource"}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500">Subject: {item.subject}</p>
                            {item.description && <p className="text-slate-600">{item.description}</p>}
                            <p className="text-sm text-slate-500">Uploaded by: {item.teacher}</p>
                          </div>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-2xl bg-blue-600 px-5 py-3 text-white"
                          >
                            Open Resource
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {active === "profile" && (
              <div className={card}>
                <h2 className="text-2xl font-semibold mb-4">Profile</h2>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-3">
                    <p className="text-lg font-semibold">{teacher.name}</p>
                    <p className="text-slate-500">{teacher.email}</p>
                    <p className="text-slate-500">Role: Teacher</p>
                    <p className="text-slate-500">Assigned subjects: {assignedSubjects.join(", ")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
