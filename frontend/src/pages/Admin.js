import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function Admin() {
  const navigate = useNavigate();
  const API = "https://maximum-scholars-1-api.onrender.com";
  const admin = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  const [active, setActive] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherSubjects, setTeacherSubjects] = useState([]);

  const [newMaterialTitle, setNewMaterialTitle] = useState("");
  const [newMaterialSubject, setNewMaterialSubject] = useState(SUBJECT_OPTIONS[0]);
  const [newMaterialType, setNewMaterialType] = useState("Reading Material");
  const [newMaterialLink, setNewMaterialLink] = useState("");
  const [newMaterialDescription, setNewMaterialDescription] = useState("");
  const [newMaterialTeacher, setNewMaterialTeacher] = useState(admin.name || "System Admin");
  const [materialMessage, setMaterialMessage] = useState("");
  const [materialError, setMaterialError] = useState("");
  const [materialFilter, setMaterialFilter] = useState("All");

  const [siteStatus, setSiteStatus] = useState("Live");
  const [defaultCurrency, setDefaultCurrency] = useState("UGX");
  const [supportEmail, setSupportEmail] = useState("support@maximumscholars.com");
  const [defaultPaymentPlan, setDefaultPaymentPlan] = useState("A");
  const [autoApprovePayments, setAutoApprovePayments] = useState(false);
  const [announcements, setAnnouncements] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");

  const safeFetch = async (url, options = {}) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      };
      const res = await fetch(url, { ...options, headers });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Fetch failed");
      }
      return data;
    } catch (error) {
      console.error(url, error);
      setError(error.message || "Unable to load admin data");
      return null;
    }
  };

  const fetchUsers = async () => {
    const data = await safeFetch(`${API}/api/users`);
    setUsers(Array.isArray(data) ? data : []);
  };

  const fetchMaterials = async () => {
    const data = await safeFetch(`${API}/api/materials`);
    setMaterials(Array.isArray(data) ? data : []);
  };

  const fetchLiveClasses = async () => {
    const data = await safeFetch(`${API}/api/live?all=true`);
    setLiveClasses(Array.isArray(data) ? data : []);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchMaterials(), fetchLiveClasses()]);
      setLoading(false);
    };
    load();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const requestRefresh = () => {
    fetchUsers();
    fetchMaterials();
    fetchLiveClasses();
  };

  const handleTeacherSubjectToggle = (subject) => {
    if (teacherSubjects.includes(subject)) {
      setTeacherSubjects(teacherSubjects.filter((item) => item !== subject));
      return;
    }
    setTeacherSubjects([...teacherSubjects, subject]);
  };

  const handleRegisterTeacher = async () => {
    if (!teacherName || !teacherEmail || !teacherPassword) {
      setMessage("Fill all teacher fields.");
      return;
    }

    const body = {
      name: teacherName,
      email: teacherEmail,
      password: teacherPassword,
      assignedSubjects: teacherSubjects,
    };

    const data = await safeFetch(`${API}/api/auth/create-teacher`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (data) {
      setMessage("Teacher registered successfully.");
      setTeacherName("");
      setTeacherEmail("");
      setTeacherPassword("");
      setTeacherSubjects([]);
      requestRefresh();
    }
  };

  const handleUploadMaterial = async () => {
    if (!newMaterialTitle || !newMaterialSubject || !newMaterialLink || !newMaterialType) {
      setMaterialError("Please fill in all required fields for the new material.");
      setMaterialMessage("");
      return;
    }

    setMaterialError("");
    setMaterialMessage("");

    const payload = {
      title: newMaterialTitle,
      subject: newMaterialSubject,
      link: newMaterialLink,
      teacher: newMaterialTeacher || admin.name || "System Admin",
      type: newMaterialType,
      description: newMaterialDescription,
    };

    const data = await safeFetch(`${API}/api/materials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (data) {
      setMaterialMessage("Material added successfully.");
      setNewMaterialTitle("");
      setNewMaterialLink("");
      setNewMaterialDescription("");
      setNewMaterialType("Reading Material");
      setNewMaterialSubject(SUBJECT_OPTIONS[0]);
      requestRefresh();
    }
  };

  const handleDeleteMaterial = async (id) => {
    await safeFetch(`${API}/api/materials/${id}`, {
      method: "DELETE",
    });
    requestRefresh();
  };

  const handleSaveSettings = async () => {
    const payload = {
      siteStatus,
      defaultCurrency,
      supportEmail,
      defaultPaymentPlan,
      autoApprovePayments,
      announcements,
    };

    const data = await safeFetch(`${API}/api/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (data) {
      setSettingsMessage("Settings saved successfully.");
    }
  };

  const handleLoadSettings = async () => {
    const data = await safeFetch(`${API}/api/settings`);
    if (data) {
      setSiteStatus(data.siteStatus || "Live");
      setDefaultCurrency(data.defaultCurrency || "UGX");
      setSupportEmail(data.supportEmail || "support@maximumscholars.com");
      setDefaultPaymentPlan(data.defaultPaymentPlan || "A");
      setAutoApprovePayments(Boolean(data.autoApprovePayments));
      setAnnouncements(data.announcements || "");
    }
  };

  useEffect(() => {
    handleLoadSettings();
  }, []);

  const handleApprove = async (id) => {
    await safeFetch(`${API}/api/users/approve/${id}`, { method: "PUT" });
    requestRefresh();
  };

  const handleReject = async (id) => {
    await safeFetch(`${API}/api/users/reject/${id}`, { method: "PUT" });
    requestRefresh();
  };

  const handleEndLive = async (id) => {
    await safeFetch(`${API}/api/live/end/${id}`, { method: "PUT" });
    requestRefresh();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const students = users.filter((u) => u.role === "student");
  const teachers = users.filter((u) => u.role === "teacher");
  const pendingPayments = students.filter(
    (u) => u.subscription?.status === "pending"
  );
  const approvedStudents = students.filter(
    (u) => u.subscription?.status === "approved"
  );
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const theme = "bg-slate-100 text-slate-900";
  const card = "bg-white shadow rounded-3xl p-6";

  return (
    <div className={`min-h-screen ${theme}`}>
      <div className="flex min-h-screen">
        <aside className="w-full md:w-72 bg-gradient-to-b from-blue-700 to-indigo-900 text-white p-6">
          <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
          <nav className="space-y-2 text-sm">
            {[
              "dashboard",
              "payments",
              "users",
              "teachers",
              "materials",
              "live",
              "report",
              "statistics",
              "profile",
              "settings",
              "about",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`w-full text-left rounded-2xl px-4 py-3 transition ${
                  active === tab ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
          <button
            onClick={logout}
            className="mt-8 w-full rounded-2xl bg-red-500 py-3 font-semibold"
          >
            Logout
          </button>
        </aside>

        <main className="flex-1 p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold">Welcome, {admin.name || "Admin"}</h1>
              <p className="text-slate-600 mt-2">
                Manage users, teachers, live classes and student payments from one place.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Email: {admin.email}</p>
              <p className="text-sm text-slate-500">Role: Admin</p>
            </div>
          </div>

          {loading ? (
            <div className={card}>Loading dashboard data...</div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="rounded-3xl border border-red-300 bg-red-50 p-4 text-red-700">
                  <strong>Admin load error:</strong> {error}
                </div>
              )}
              {active === "dashboard" && (
                <div className="grid gap-6 lg:grid-cols-4">
                  <div className={card}>
                    <p className="text-sm uppercase text-slate-500">Students</p>
                    <p className="mt-4 text-4xl font-bold">{students.length}</p>
                  </div>
                  <div className={card}>
                    <p className="text-sm uppercase text-slate-500">Teachers</p>
                    <p className="mt-4 text-4xl font-bold">{teachers.length}</p>
                  </div>
                  <div className={card}>
                    <p className="text-sm uppercase text-slate-500">Pending Payments</p>
                    <p className="mt-4 text-4xl font-bold">{pendingPayments.length}</p>
                  </div>
                  <div className={card}>
                    <p className="text-sm uppercase text-slate-500">Approved Students</p>
                    <p className="mt-4 text-4xl font-bold">{approvedStudents.length}</p>
                  </div>
                </div>
              )}

              {active === "payments" && (
                <div className={card}>
                  <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold">Payment Requests</h2>
                    {pendingPayments.length === 0 ? (
                      <p>No pending payments at the moment.</p>
                    ) : (
                      pendingPayments.map((student) => (
                        <div
                          key={student.id}
                          className="flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <p className="font-semibold">{student.name}</p>
                            <p className="text-sm text-slate-500">{student.email}</p>
                            <p className="text-sm">
                              Subjects: {(student.subjects || []).join(", ")}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleApprove(student.id)}
                              className="rounded-2xl bg-green-600 px-4 py-2 text-white"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(student.id)}
                              className="rounded-2xl bg-red-500 px-4 py-2 text-white"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {active === "users" && (
                <div className={card}>
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-2xl font-semibold">All Users</h2>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search users..."
                      className="w-full max-w-md rounded-2xl border px-4 py-3"
                    />
                  </div>
                  {filteredUsers.length === 0 ? (
                    <p>No users matched your search.</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredUsers.map((userItem) => (
                        <div
                          key={userItem.id}
                          className="flex flex-col gap-2 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-semibold">{userItem.name}</p>
                            <p className="text-sm text-slate-500">{userItem.email}</p>
                            <p className="text-sm">Role: {userItem.role}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm text-slate-700">
                            <span className="rounded-full bg-slate-100 px-3 py-1">{userItem.subscription?.status || "inactive"}</span>
                            <span className="rounded-full bg-slate-100 px-3 py-1">Subjects: {(userItem.subjects || []).length}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {active === "teachers" && (
                <div className={card}>
                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-semibold">Register Teacher</h2>
                        <p className="text-slate-500 mt-2">
                          Create teacher accounts and assign subjects.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <input
                          value={teacherName}
                          onChange={(e) => setTeacherName(e.target.value)}
                          placeholder="Full name"
                          className="rounded-2xl border px-4 py-3"
                        />
                        <input
                          value={teacherEmail}
                          onChange={(e) => setTeacherEmail(e.target.value)}
                          placeholder="Email address"
                          className="rounded-2xl border px-4 py-3"
                        />
                        <input
                          type="password"
                          value={teacherPassword}
                          onChange={(e) => setTeacherPassword(e.target.value)}
                          placeholder="Password"
                          className="rounded-2xl border px-4 py-3"
                        />
                      </div>

                      <div>
                        <p className="font-semibold mb-2">Assigned Subjects</p>
                        <div className="flex flex-wrap gap-2">
                          {SUBJECT_OPTIONS.map((subject) => (
                            <button
                              key={subject}
                              type="button"
                              onClick={() => handleTeacherSubjectToggle(subject)}
                              className={`rounded-full border px-4 py-2 text-sm ${
                                teacherSubjects.includes(subject)
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-slate-700"
                              }`}
                            >
                              {subject}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleRegisterTeacher}
                        className="rounded-2xl bg-green-600 px-6 py-3 text-white"
                      >
                        Create Teacher
                      </button>

                      {message && <p className="text-sm text-green-600">{message}</p>}
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold">Teacher List</h2>
                      {teachers.length === 0 ? (
                        <p>No teachers registered yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {teachers.map((teacher) => (
                            <div key={teacher.id} className="rounded-2xl border p-4">
                              <p className="font-semibold">{teacher.name}</p>
                              <p className="text-sm text-slate-500">{teacher.email}</p>
                              <p className="text-sm mt-2">Assigned: {(teacher.assignedSubjects || []).join(", ")}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {active === "materials" && (
                <div className={card}>
                  <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Materials</h2>
                      <p className="text-slate-500">
                        Add study resources, quizzes, tests and reading files across all subjects.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="font-semibold text-slate-700">Quick filters</p>
                      <div className="flex flex-wrap gap-2">
                        {['All', 'Reading Material', 'Test', 'Quiz', 'Other'].map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setMaterialFilter(filter)}
                            className={`rounded-full px-4 py-2 text-sm ${materialFilter === filter ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        value={newMaterialTitle}
                        onChange={(e) => setNewMaterialTitle(e.target.value)}
                        placeholder="Resource title"
                        className="rounded-2xl border px-4 py-3"
                      />
                      <input
                        value={newMaterialTeacher}
                        onChange={(e) => setNewMaterialTeacher(e.target.value)}
                        placeholder="Teacher / source"
                        className="rounded-2xl border px-4 py-3"
                      />
                      <select
                        value={newMaterialSubject}
                        onChange={(e) => setNewMaterialSubject(e.target.value)}
                        className="rounded-2xl border px-4 py-3"
                      >
                        {SUBJECT_OPTIONS.map((subject) => (
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
                    </div>

                    <input
                      value={newMaterialLink}
                      onChange={(e) => setNewMaterialLink(e.target.value)}
                      placeholder="Resource link"
                      className="mt-4 w-full rounded-2xl border px-4 py-3"
                    />
                    <textarea
                      value={newMaterialDescription}
                      onChange={(e) => setNewMaterialDescription(e.target.value)}
                      placeholder="Short description"
                      className="mt-4 w-full rounded-3xl border px-4 py-3"
                      rows={4}
                    />

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        {materialMessage && <p className="text-sm text-emerald-700">{materialMessage}</p>}
                        {materialError && <p className="text-sm text-red-600">{materialError}</p>}
                      </div>
                      <button
                        onClick={handleUploadMaterial}
                        className="rounded-2xl bg-emerald-600 px-6 py-3 text-white"
                      >
                        Upload New Resource
                      </button>
                    </div>
                  </div>

                  {materials.filter((material) => materialFilter === "All" || material.type === materialFilter).length === 0 ? (
                    <p className="text-slate-500">No materials match the selected filter.</p>
                  ) : (
                    <div className="grid gap-4">
                      {materials
                        .filter((material) => materialFilter === "All" || material.type === materialFilter)
                        .map((material) => (
                          <div key={material.id} className="rounded-3xl border p-5 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-lg font-semibold">{material.title}</p>
                                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs uppercase tracking-[0.08em] text-blue-700">
                                    {material.type || "Resource"}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-500">Subject: {material.subject}</p>
                                {material.description && <p className="text-slate-600">{material.description}</p>}
                                <p className="text-sm text-slate-500">Added by: {material.teacher}</p>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                <a
                                  href={material.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-2xl bg-blue-600 px-4 py-2 text-white"
                                >
                                  View
                                </a>
                                <button
                                  onClick={() => handleDeleteMaterial(material.id)}
                                  className="rounded-2xl bg-red-500 px-4 py-2 text-white"
                                >
                                  Remove
                                </button>
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
                  <h2 className="text-2xl font-semibold mb-4">Live Classes</h2>
                  {liveClasses.length === 0 ? (
                    <p>No live class records found.</p>
                  ) : (
                    <div className="space-y-4">
                      {liveClasses.map((live) => (
                        <div key={live.id} className="rounded-2xl border p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold">{live.subject}</p>
                              <p className="text-sm text-slate-500">Teacher: {live.teacherName}</p>
                              <p className="text-sm">Status: {live.status}</p>
                              <p className="text-sm">Room: {live.roomId}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {live.status === "live" && (
                                <button
                                  onClick={() => handleEndLive(live.id)}
                                  className="rounded-2xl bg-red-500 px-4 py-2 text-white"
                                >
                                  End Class
                                </button>
                              )}
                              <a
                                href={`https://meet.jit.si/${encodeURIComponent(live.roomId)}#userInfo.displayName=${encodeURIComponent(admin.name || "Admin")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-2xl bg-blue-600 px-4 py-2 text-white"
                              >
                                Open Meet
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {active === "report" && (
                <div className={card}>
                  <h2 className="text-2xl font-semibold mb-4">Reports</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border p-4">
                      <p className="text-sm uppercase text-slate-500">Total Users</p>
                      <p className="mt-3 text-3xl font-bold">{users.length}</p>
                    </div>
                    <div className="rounded-2xl border p-4">
                      <p className="text-sm uppercase text-slate-500">Total Materials</p>
                      <p className="mt-3 text-3xl font-bold">{materials.length}</p>
                    </div>
                    <div className="rounded-2xl border p-4">
                      <p className="text-sm uppercase text-slate-500">Live Classes</p>
                      <p className="mt-3 text-3xl font-bold">{liveClasses.length}</p>
                    </div>
                    <div className="rounded-2xl border p-4">
                      <p className="text-sm uppercase text-slate-500">Pending Payments</p>
                      <p className="mt-3 text-3xl font-bold">{pendingPayments.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {active === "statistics" && (
                <div className={card}>
                  <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border p-4">
                      <p className="text-sm uppercase text-slate-500">Active Teachers</p>
                      <p className="mt-3 text-3xl font-bold">{teachers.length}</p>
                    </div>
                    <div className="rounded-2xl border p-4">
                      <p className="text-sm uppercase text-slate-500">Approved Students</p>
                      <p className="mt-3 text-3xl font-bold">{approvedStudents.length}</p>
                    </div>
                    <div className="rounded-2xl border p-4">
                      <p className="text-sm uppercase text-slate-500">Subjects Assigned</p>
                      <p className="mt-3 text-3xl font-bold">{students.reduce((sum, student) => sum + (student.subjects || []).length, 0)}</p>
                    </div>
                  </div>
                </div>
              )}

              {active === "profile" && (
                <div className={card}>
                  <h2 className="text-2xl font-semibold mb-4">Profile</h2>
                  <div className="space-y-3">
                    <p className="text-slate-600">Name: {admin.name}</p>
                    <p className="text-slate-600">Email: {admin.email}</p>
                    <p className="text-slate-600">Role: Admin</p>
                  </div>
                </div>
              )}

              {active === "settings" && (
                <div className={card}>
                  <h2 className="text-2xl font-semibold mb-4">Platform Settings</h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Platform status</p>
                        <p className="mt-3 text-slate-700">Control whether new registrations and payment approvals are live.</p>
                      </div>
                      <select
                        value={siteStatus}
                        onChange={(e) => setSiteStatus(e.target.value)}
                        className="rounded-2xl border px-4 py-3"
                      >
                        <option>Live</option>
                        <option>Maintenance</option>
                        <option>Read Only</option>
                      </select>

                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Default currency</p>
                        <input
                          value={defaultCurrency}
                          onChange={(e) => setDefaultCurrency(e.target.value)}
                          className="mt-3 w-full rounded-2xl border px-4 py-3"
                        />
                      </div>

                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Support contact</p>
                        <input
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                          className="mt-3 w-full rounded-2xl border px-4 py-3"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Payment defaults</p>
                        <p className="mt-3 text-slate-700">Set default payment rules and approval workflows.</p>
                      </div>
                      <select
                        value={defaultPaymentPlan}
                        onChange={(e) => setDefaultPaymentPlan(e.target.value)}
                        className="rounded-2xl border px-4 py-3"
                      >
                        <option value="A">Plan A</option>
                        <option value="B">Plan B</option>
                        <option value="C">Plan C</option>
                      </select>

                      <label className="flex items-center gap-3 rounded-2xl border px-4 py-3">
                        <input
                          type="checkbox"
                          checked={autoApprovePayments}
                          onChange={(e) => setAutoApprovePayments(e.target.checked)}
                        />
                        <span className="text-sm text-slate-700">Allow automatic approval for low-risk payments</span>
                      </label>

                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Global announcement</p>
                        <textarea
                          value={announcements}
                          onChange={(e) => setAnnouncements(e.target.value)}
                          className="mt-3 w-full rounded-3xl border px-4 py-3"
                          rows={5}
                          placeholder="Share a message with teachers and students"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-500">Save configuration locally for your admin session.</p>
                      {settingsMessage && <p className="text-sm text-emerald-700">{settingsMessage}</p>}
                    </div>
                    <button
                      onClick={handleSaveSettings}
                      className="rounded-2xl bg-blue-600 px-6 py-3 text-white"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              )}

              {active === "about" && (
                <div className={card}>
                  <h2 className="text-2xl font-semibold mb-4">About Maximum Scholars</h2>
                  <p>
                    Maximum Scholars is a student-first platform for live classes, teacher management and paid student access.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
