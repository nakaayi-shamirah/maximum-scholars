import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SUBJECT_OPTIONS = ["Mathematics","Biology","Chemistry","Physics","Agriculture","Geography","History","Divinity","Economics","Entrepreneurship","SUB ICT","SUB MATH"];
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "live", label: "Live Classes", icon: "📡" },
  { id: "materials", label: "Materials", icon: "📄" },
  { id: "profile", label: "Profile", icon: "👤" },
];

export default function Teacher() {
  const navigate = useNavigate();
  const API = "https://maximum-scholars-1-api.onrender.com";
  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [teacher, setTeacher] = useState(JSON.parse(localStorage.getItem("user")) || {});
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

  const fetchMaterials = async () => {
    try {
      const res = await fetch(`${API}/api/materials`);
      const data = await res.json();
      if (Array.isArray(data)) { setMaterials(data); localStorage.setItem("materials", JSON.stringify(data)); }
    } catch {}
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "teacher") { navigate("/login"); return; }

    const fetchTeacher = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Could not fetch teacher");
        setTeacher(data); setAssignedSubjects(data.assignedSubjects || []);
        localStorage.setItem("user", JSON.stringify(data));
      } catch {}
    };

    const fetchLive = async () => {
      try {
        const res = await fetch(`${API}/api/live?all=true`);
        const data = await res.json();
        if (Array.isArray(data)) setLiveClasses(data);
      } catch {}
    };

    (async () => { await fetchTeacher(); await fetchMaterials(); await fetchLive(); setLoading(false); })();
  }, [navigate]);

  const logout = () => { localStorage.clear(); navigate("/"); };

  const subjectMaterials = materials.filter(item => assignedSubjects.includes(item.subject));
  const currentLive = liveClasses.filter(live => live.teacherId === teacher.id && live.status === "live");

  const handleStartLive = async (subject) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/live/start`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ subject, teacherId: teacher.id, teacherName: teacher.name }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to start live class");
      localStorage.setItem("liveClassStatus", "started"); localStorage.setItem("liveTeacher", teacher.name);
      localStorage.setItem("liveSubject", data.subject); localStorage.setItem("liveRoomId", data.roomId);
      navigate("/live");
    } catch (err) { alert(err.message || "Unable to start live class."); }
  };

  const handleUploadMaterial = async () => {
    if (!newMaterialTitle || !newMaterialSubject || !newMaterialLink || !newMaterialType) { setUploadError("Please fill in all required fields."); setUploadMessage(""); return; }
    setUploadError(""); setUploadMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/materials`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ title: newMaterialTitle, subject: newMaterialSubject, link: newMaterialLink, teacher: teacher.name || "Teacher", type: newMaterialType, description: newMaterialDescription }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload material");
      setUploadMessage("Material uploaded successfully.");
      setNewMaterialTitle(""); setNewMaterialLink(""); setNewMaterialDescription(""); setNewMaterialType("Reading Material");
      setNewMaterialSubject(assignedSubjects[0] || SUBJECT_OPTIONS[0]);
      await fetchMaterials();
    } catch (err) { setUploadError(err.message || "Upload failed."); }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F7F9FC" }}>
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          Maximo Scholars<br />
          <span className="tag">Teacher Portal</span>
        </div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {TABS.map(tab => (
            <button key={tab.id} className={`nav-btn ${active === tab.id ? "active" : ""}`} onClick={() => { setActive(tab.id); setMenuOpen(false); }}>
              <span>{tab.icon}</span> {tab.label}
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
            <div className="section-label">Teacher Portal</div>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "2rem", fontWeight: 700, marginBottom: 4 }}>Welcome, {teacher.name?.split(" ")[0]}</h1>
            <p style={{ color: "#64748B", fontSize: "0.9rem" }}>Manage live classes, upload materials, and support your students.</p>
          </div>
          <button className="btn btn-outline" onClick={() => setMenuOpen(true)}>☰</button>
        </div>

        {loading ? (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "#64748B" }}>⏳ Loading…</div>
        ) : (
          <div>
            {active === "dashboard" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
                {[
                  { label: "Assigned Subjects", value: assignedSubjects.length, variant: "primary" },
                  { label: "Materials Uploaded", value: subjectMaterials.length, variant: "" },
                  { label: "Live Sessions Active", value: currentLive.length, variant: currentLive.length > 0 ? "gold" : "" },
                ].map((s, i) => (
                  <div key={s.label} className={`stat-card ${s.variant} animate-fadeUp-${i + 1}`}>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value">{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            {active === "live" && (
              <div className="card">
                <div className="section-label">Sessions</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20 }}>Start Live Class</h2>
                {assignedSubjects.length === 0 ? (
                  <p style={{ color: "#94A3B8" }}>No subjects assigned yet. Contact your admin.</p>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                    {assignedSubjects.map(subject => (
                      <div key={subject} style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 14, padding: "20px" }}>
                        <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>📡</div>
                        <div style={{ fontWeight: 700, marginBottom: 12 }}>{subject}</div>
                        <button onClick={() => handleStartLive(subject)} className="btn btn-gold btn-sm" style={{ width: "100%" }}>
                          Start Live
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {active === "materials" && (
              <div className="card">
                <div className="section-label">Resources</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20 }}>Upload Material</h2>

                <div style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 14, padding: 24, marginBottom: 24 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <input value={newMaterialTitle} onChange={e => setNewMaterialTitle(e.target.value)} placeholder="Resource title" className="input" />
                    <select value={newMaterialSubject} onChange={e => setNewMaterialSubject(e.target.value)} className="input">
                      {(assignedSubjects.length ? assignedSubjects : SUBJECT_OPTIONS).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={newMaterialType} onChange={e => setNewMaterialType(e.target.value)} className="input">
                      {["Reading Material","Test","Quiz","Other"].map(t => <option key={t}>{t}</option>)}
                    </select>
                    <input value={newMaterialLink} onChange={e => setNewMaterialLink(e.target.value)} placeholder="Resource URL" className="input" />
                  </div>
                  <textarea value={newMaterialDescription} onChange={e => setNewMaterialDescription(e.target.value)} placeholder="Short description (optional)" className="input" rows={3} style={{ resize: "vertical", marginBottom: 16 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      {uploadMessage && <p style={{ color: "#059669", fontSize: "0.875rem" }}>✓ {uploadMessage}</p>}
                      {uploadError && <p style={{ color: "#DC2626", fontSize: "0.875rem" }}>{uploadError}</p>}
                    </div>
                    <button onClick={handleUploadMaterial} className="btn btn-gold">Upload Material</button>
                  </div>
                </div>

                {subjectMaterials.length === 0 ? (
                  <div style={{ border: "2px dashed #E2E8F2", borderRadius: 14, padding: "40px 24px", textAlign: "center", color: "#94A3B8" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>📄</div>
                    No materials uploaded yet. Start sharing resources with your students.
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                    {subjectMaterials.map(item => (
                      <div key={item.id} style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 14, padding: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.title}</span>
                          <span className="badge badge-blue">{item.type || "Resource"}</span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: 12 }}>Subject: {item.subject}</div>
                        {item.description && <div style={{ fontSize: "0.8rem", color: "#94A3B8", marginBottom: 10 }}>{item.description}</div>}
                        <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>Open →</a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {active === "profile" && (
              <div className="card" style={{ maxWidth: 520 }}>
                <div className="section-label">Account</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20 }}>Teacher Profile</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[["Full Name", teacher.name], ["Email", teacher.email], ["Role", "Teacher"]].map(([k, v]) => (
                    <div key={k} style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 10, padding: "14px 18px" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{k}</div>
                      <div style={{ fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                  <div style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 10, padding: "14px 18px" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Assigned Subjects</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {assignedSubjects.map(s => <span key={s} className="badge badge-blue">{s}</span>)}
                    </div>
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
