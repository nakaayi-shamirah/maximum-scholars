import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SUBJECT_OPTIONS = ["Mathematics","Biology","Chemistry","Physics","Agriculture","Geography","History","Divinity","Economics","Entrepreneurship","SUB ICT","SUB MATH"];
const TABS = ["dashboard","payments","users","teachers","materials","live","report","statistics","profile","settings","about"];

export default function Admin() {
  const navigate = useNavigate();
  const API = "https://maximum-scholars-1-api.onrender.com";
  const admin = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
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
      const headers = { Authorization: `Bearer ${token}`, ...(options.headers || {}) };
      const res = await fetch(url, { ...options, headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fetch failed");
      return data;
    } catch (err) { setError(err.message || "Unable to load admin data"); return null; }
  };

  const fetchUsers = async () => { const data = await safeFetch(`${API}/api/users`); setUsers(Array.isArray(data) ? data : []); };
  const fetchMaterials = async () => { const data = await safeFetch(`${API}/api/materials`); setMaterials(Array.isArray(data) ? data : []); };
  const fetchLiveClasses = async () => { const data = await safeFetch(`${API}/api/live?all=true`); setLiveClasses(Array.isArray(data) ? data : []); };

  useEffect(() => {
    (async () => { setLoading(true); await Promise.all([fetchUsers(), fetchMaterials(), fetchLiveClasses()]); setLoading(false); })();
    safeFetch(`${API}/api/settings`).then(data => { if (data) { setSiteStatus(data.siteStatus || "Live"); setDefaultCurrency(data.defaultCurrency || "UGX"); setSupportEmail(data.supportEmail || "support@maximumscholars.com"); setDefaultPaymentPlan(data.defaultPaymentPlan || "A"); setAutoApprovePayments(Boolean(data.autoApprovePayments)); setAnnouncements(data.announcements || ""); } });
  }, []);

  const requestRefresh = () => { fetchUsers(); fetchMaterials(); fetchLiveClasses(); };

  const handleRegisterTeacher = async () => {
    if (!teacherName || !teacherEmail || !teacherPassword) { setMessage("Fill all teacher fields."); return; }
    const data = await safeFetch(`${API}/api/auth/create-teacher`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: teacherName, email: teacherEmail, password: teacherPassword, assignedSubjects: teacherSubjects }) });
    if (data) { setMessage("Teacher registered successfully."); setTeacherName(""); setTeacherEmail(""); setTeacherPassword(""); setTeacherSubjects([]); requestRefresh(); }
  };

  const handleUploadMaterial = async () => {
    if (!newMaterialTitle || !newMaterialSubject || !newMaterialLink || !newMaterialType) { setMaterialError("Please fill all required fields."); setMaterialMessage(""); return; }
    setMaterialError(""); setMaterialMessage("");
    const data = await safeFetch(`${API}/api/materials`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: newMaterialTitle, subject: newMaterialSubject, link: newMaterialLink, teacher: newMaterialTeacher || admin.name || "System Admin", type: newMaterialType, description: newMaterialDescription }) });
    if (data) { setMaterialMessage("Material added successfully."); setNewMaterialTitle(""); setNewMaterialLink(""); setNewMaterialDescription(""); setNewMaterialType("Reading Material"); setNewMaterialSubject(SUBJECT_OPTIONS[0]); requestRefresh(); }
  };

  const handleDeleteMaterial = async (id) => { await safeFetch(`${API}/api/materials/${id}`, { method: "DELETE" }); requestRefresh(); };
  const handleSaveSettings = async () => {
    const data = await safeFetch(`${API}/api/settings`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ siteStatus, defaultCurrency, supportEmail, defaultPaymentPlan, autoApprovePayments, announcements }) });
    if (data) setSettingsMessage("Settings saved successfully.");
  };
  const handleApprove = async (id) => { await safeFetch(`${API}/api/users/approve/${id}`, { method: "PUT" }); requestRefresh(); };
  const handleReject = async (id) => { await safeFetch(`${API}/api/users/reject/${id}`, { method: "PUT" }); requestRefresh(); };
  const handleEndLive = async (id) => { await safeFetch(`${API}/api/live/end/${id}`, { method: "PUT" }); requestRefresh(); };
  const logout = () => { localStorage.clear(); navigate("/"); };

  const students = users.filter(u => u.role === "student");
  const teachers = users.filter(u => u.role === "teacher");
  const pendingPayments = students.filter(u => u.subscription?.status === "pending");
  const approvedStudents = students.filter(u => u.subscription?.status === "approved");
  const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  const TAB_ICONS = { dashboard:"⊞", payments:"💳", users:"👥", teachers:"👩‍🏫", materials:"📄", live:"📡", report:"📊", statistics:"📈", profile:"👤", settings:"⚙️", about:"ℹ️" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F7F9FC" }}>
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          Maximo Scholars<br />
          <span className="tag">Admin Panel</span>
        </div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, overflow: "auto" }}>
          {TABS.map(tab => (
            <button key={tab} className={`nav-btn ${active === tab ? "active" : ""}`} onClick={() => { setActive(tab); setMenuOpen(false); }}>
              <span>{TAB_ICONS[tab]}</span> {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 16, marginTop: 16 }}>
          <button onClick={logout} className="btn btn-sm" style={{ width: "100%", background: "rgba(220,38,38,.15)", color: "#FCA5A5", border: "1px solid rgba(220,38,38,.2)" }}>Sign Out</button>
        </div>
      </aside>

      <main className="main-content" style={{ flex: 1, padding: "32px 40px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div className="section-label">Administration</div>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "2rem", fontWeight: 700, marginBottom: 4 }}>Welcome, {admin.name || "Admin"}</h1>
            <p style={{ color: "#64748B", fontSize: "0.9rem" }}>Manage users, teachers, live classes and payments from one place.</p>
          </div>
          <button className="btn btn-outline" onClick={() => setMenuOpen(true)}>☰</button>
        </div>

        {loading ? (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "#64748B" }}>⏳ Loading dashboard data…</div>
        ) : (
          <div>
            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "12px 16px", borderRadius: 10, marginBottom: 20, fontSize: "0.875rem" }}>{error}</div>}

            {active === "dashboard" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                {[
                  { label: "Total Students", value: students.length, variant: "primary" },
                  { label: "Teachers", value: teachers.length, variant: "" },
                  { label: "Pending Payments", value: pendingPayments.length, variant: "gold" },
                  { label: "Approved Students", value: approvedStudents.length, variant: "" },
                ].map((s, i) => (
                  <div key={s.label} className={`stat-card ${s.variant} animate-fadeUp-${i + 1}`}>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value">{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            {active === "payments" && (
              <div className="card">
                <div className="section-label">Approvals</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20 }}>Payment Requests</h2>
                {pendingPayments.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>✅ No pending payments at the moment.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {pendingPayments.map(student => (
                      <div key={student.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#F7F9FC", borderRadius: 12, border: "1px solid #E2E8F2", gap: 16, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: 2 }}>{student.name}</div>
                          <div style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: 4 }}>{student.email}</div>
                          <div style={{ fontSize: "0.8rem" }}>Subjects: {(student.subjects || []).join(", ") || "None"}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => handleApprove(student.id)} className="btn btn-success btn-sm">✓ Approve</button>
                          <button onClick={() => handleReject(student.id)} className="btn btn-danger btn-sm">✗ Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {active === "users" && (
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div className="section-label">Directory</div>
                    <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>All Users</h2>
                  </div>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="input" style={{ maxWidth: 300 }} />
                </div>
                {filteredUsers.length === 0 ? <p style={{ color: "#64748B" }}>No users matched your search.</p> : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {filteredUsers.map(u => (
                      <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#F7F9FC", borderRadius: 10, border: "1px solid #E2E8F2", flexWrap: "wrap", gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: "0.8rem", color: "#64748B" }}>{u.email}</div>
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span className={`badge ${u.role === "admin" ? "badge-gold" : u.role === "teacher" ? "badge-blue" : "badge-gray"}`}>{u.role}</span>
                          <span className={`badge ${u.subscription?.status === "approved" ? "badge-green" : u.subscription?.status === "pending" ? "badge-gold" : "badge-gray"}`}>{u.subscription?.status || "inactive"}</span>
                          <span className="badge badge-gray">{(u.subjects || []).length} subjects</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {active === "teachers" && (
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
                <div className="card">
                  <div className="section-label">Register</div>
                  <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20 }}>Add Teacher</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <input value={teacherName} onChange={e => setTeacherName(e.target.value)} placeholder="Full name" className="input" />
                    <input value={teacherEmail} onChange={e => setTeacherEmail(e.target.value)} placeholder="Email address" className="input" />
                    <input type="password" value={teacherPassword} onChange={e => setTeacherPassword(e.target.value)} placeholder="Password" className="input" />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: 8 }}>Assign Subjects</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {SUBJECT_OPTIONS.map(sub => (
                        <button key={sub} type="button" onClick={() => setTeacherSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub])} className={`btn btn-sm ${teacherSubjects.includes(sub) ? "btn-primary" : "btn-outline"}`}>
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleRegisterTeacher} className="btn btn-gold">Create Teacher Account</button>
                  {message && <p style={{ color: "#059669", fontSize: "0.875rem", marginTop: 10 }}>✓ {message}</p>}
                </div>

                <div className="card">
                  <div className="section-label">List</div>
                  <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 16 }}>Teachers ({teachers.length})</h2>
                  {teachers.length === 0 ? <p style={{ color: "#94A3B8" }}>No teachers registered yet.</p> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {teachers.map(t => (
                        <div key={t.id} style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 10, padding: "14px 16px" }}>
                          <div style={{ fontWeight: 600 }}>{t.name}</div>
                          <div style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: 6 }}>{t.email}</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {(t.assignedSubjects || []).map(s => <span key={s} className="badge badge-blue">{s}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {active === "materials" && (
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <div className="section-label">Resources</div>
                    <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>Study Materials</h2>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["All","Reading Material","Test","Quiz","Other"].map(f => (
                      <button key={f} onClick={() => setMaterialFilter(f)} className={`btn btn-sm ${materialFilter === f ? "btn-primary" : "btn-outline"}`}>{f}</button>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 14, padding: 24, marginBottom: 24 }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, marginBottom: 16 }}>Add New Resource</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <input value={newMaterialTitle} onChange={e => setNewMaterialTitle(e.target.value)} placeholder="Resource title" className="input" />
                    <input value={newMaterialTeacher} onChange={e => setNewMaterialTeacher(e.target.value)} placeholder="Teacher / source" className="input" />
                    <select value={newMaterialSubject} onChange={e => setNewMaterialSubject(e.target.value)} className="input">
                      {SUBJECT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={newMaterialType} onChange={e => setNewMaterialType(e.target.value)} className="input">
                      {["Reading Material","Test","Quiz","Other"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <input value={newMaterialLink} onChange={e => setNewMaterialLink(e.target.value)} placeholder="Resource URL" className="input" style={{ marginBottom: 12 }} />
                  <textarea value={newMaterialDescription} onChange={e => setNewMaterialDescription(e.target.value)} placeholder="Short description (optional)" className="input" rows={3} style={{ resize: "vertical", marginBottom: 16 }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      {materialMessage && <p style={{ color: "#059669", fontSize: "0.875rem" }}>✓ {materialMessage}</p>}
                      {materialError && <p style={{ color: "#DC2626", fontSize: "0.875rem" }}>{materialError}</p>}
                    </div>
                    <button onClick={handleUploadMaterial} className="btn btn-gold">Upload Resource</button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {materials.filter(m => materialFilter === "All" || m.type === materialFilter).map(material => (
                    <div key={material.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "16px 20px", background: "#F7F9FC", borderRadius: 12, border: "1px solid #E2E8F2", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600 }}>{material.title}</span>
                          <span className="badge badge-blue">{material.type || "Resource"}</span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#64748B" }}>Subject: {material.subject} · By: {material.teacher}</div>
                        {material.description && <div style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: 4 }}>{material.description}</div>}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <a href={material.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>View</a>
                        <button onClick={() => handleDeleteMaterial(material.id)} className="btn btn-danger btn-sm">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "live" && (
              <div className="card">
                <div className="section-label">Sessions</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20 }}>Live Classes</h2>
                {liveClasses.length === 0 ? <p style={{ color: "#94A3B8" }}>No live class records found.</p> : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {liveClasses.map(live => (
                      <div key={live.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#F7F9FC", borderRadius: 12, border: "1px solid #E2E8F2", flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>{live.subject}</div>
                          <div style={{ fontSize: "0.8rem", color: "#64748B" }}>Teacher: {live.teacherName} · Room: {live.roomId}</div>
                          <span className={`badge ${live.status === "live" ? "badge-live" : "badge-gray"}`} style={{ marginTop: 6 }}>{live.status}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          {live.status === "live" && <button onClick={() => handleEndLive(live.id)} className="btn btn-danger btn-sm">End Class</button>}
                          <a href={`https://meet.jit.si/${encodeURIComponent(live.roomId)}#userInfo.displayName=${encodeURIComponent(admin.name || "Admin")}`} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>Open Meet</a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {active === "report" && (
              <div className="card">
                <div className="section-label">Overview</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20 }}>Reports</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
                  {[
                    { label: "Total Users", value: users.length },
                    { label: "Total Materials", value: materials.length },
                    { label: "Live Classes", value: liveClasses.length },
                    { label: "Pending Payments", value: pendingPayments.length },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "statistics" && (
              <div className="card">
                <div className="section-label">Analytics</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20 }}>Statistics</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
                  {[
                    { label: "Active Teachers", value: teachers.length },
                    { label: "Approved Students", value: approvedStudents.length },
                    { label: "Subjects Assigned", value: students.reduce((sum, s) => sum + (s.subjects || []).length, 0) },
                    { label: "Materials Available", value: materials.length },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "profile" && (
              <div className="card" style={{ maxWidth: 520 }}>
                <div className="section-label">Account</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20 }}>Admin Profile</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[["Full Name", admin.name], ["Email", admin.email], ["Role", "Administrator"]].map(([k, v]) => (
                    <div key={k} style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 10, padding: "14px 18px" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{k}</div>
                      <div style={{ fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "settings" && (
              <div className="card">
                <div className="section-label">Configuration</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 24 }}>Platform Settings</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Platform Status</div>
                      <select value={siteStatus} onChange={e => setSiteStatus(e.target.value)} className="input">
                        <option>Live</option><option>Maintenance</option><option>Read Only</option>
                      </select>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Default Currency</div>
                      <input value={defaultCurrency} onChange={e => setDefaultCurrency(e.target.value)} className="input" />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Support Email</div>
                      <input value={supportEmail} onChange={e => setSupportEmail(e.target.value)} className="input" />
                    </div>
                  </div>
                  <div style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Default Payment Plan</div>
                      <select value={defaultPaymentPlan} onChange={e => setDefaultPaymentPlan(e.target.value)} className="input">
                        <option value="A">Plan A</option><option value="B">Plan B</option><option value="C">Plan C</option>
                      </select>
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, background: "white", border: "1px solid #E2E8F2", borderRadius: 10, padding: "12px 14px", cursor: "pointer" }}>
                      <input type="checkbox" checked={autoApprovePayments} onChange={e => setAutoApprovePayments(e.target.checked)} />
                      <span style={{ fontSize: "0.875rem" }}>Auto-approve low-risk payments</span>
                    </label>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Global Announcement</div>
                      <textarea value={announcements} onChange={e => setAnnouncements(e.target.value)} placeholder="Message for teachers and students…" className="input" rows={4} style={{ resize: "vertical" }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
                  {settingsMessage && <p style={{ color: "#059669", fontSize: "0.875rem" }}>✓ {settingsMessage}</p>}
                  <div />
                  <button onClick={handleSaveSettings} className="btn btn-primary">Save Settings</button>
                </div>
              </div>
            )}

            {active === "about" && (
              <div className="card" style={{ maxWidth: 600 }}>
                <div className="section-label">Platform</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 16 }}>About Maximo Scholars</h2>
                <p style={{ color: "#64748B", lineHeight: 1.75 }}>Maximum Scholars is a student-first platform for live classes, teacher management and paid student access. Built for Uganda A-Level learners.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
