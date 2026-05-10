import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "subjects",  label: "Subjects",  icon: "📚" },
  { id: "materials", label: "Materials", icon: "📄" },
  { id: "live",      label: "Live Classes", icon: "📡" },
  { id: "profile",   label: "Profile",   icon: "👤" },
  { id: "about",     label: "About",     icon: "ℹ️" },
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
    if (role !== "student") { navigate("/login"); return; }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Could not fetch user");
        setUser(data); setSubjects(data.subjects || []);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("subjects", JSON.stringify(data.subjects || []));
        if (data.subscription?.status !== "approved") { navigate("/subjects"); return; }
      } catch { navigate("/login"); }
    };

    const fetchMaterials = async () => {
      try {
        const res = await fetch(`${API}/api/materials`);
        const data = await res.json();
        if (Array.isArray(data)) { setMaterials(data); localStorage.setItem("materials", JSON.stringify(data)); }
      } catch {}
    };

    const fetchLive = async () => {
      try {
        const res = await fetch(`${API}/api/live`);
        const data = await res.json();
        if (Array.isArray(data)) setLiveClasses(data);
      } catch {}
    };

    (async () => { await fetchUser(); await fetchMaterials(); await fetchLive(); setLoading(false); })();
  }, [navigate]);

  const logout = () => { localStorage.clear(); navigate("/"); };

  const uploadPhoto = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setPhoto(reader.result); localStorage.setItem("studentPhoto", reader.result); };
    reader.readAsDataURL(file);
  };

  const myMaterials = materials.filter(m => subjects.includes(m.subject));
  const currentLive = liveClasses.find(l => subjects.includes(l.subject) && l.status === "live");

  const joinLive = () => {
    if (!currentLive) { alert("No active live class for your subjects."); return; }
    localStorage.setItem("liveClassStatus", "started");
    localStorage.setItem("liveTeacher", currentLive.teacherName || "Teacher");
    localStorage.setItem("liveSubject", currentLive.subject);
    localStorage.setItem("liveRoomId", currentLive.roomId);
    navigate("/live");
  };

  const stats = [
    { label: "Enrolled Subjects", value: subjects.length, variant: "primary" },
    { label: "Study Materials", value: myMaterials.length, variant: "" },
    { label: "Live Sessions", value: currentLive ? 1 : 0, variant: "" },
    { label: "Status", value: "Active", variant: "gold" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F7F9FC" }}>
      {/* Overlay */}
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          Maximo Scholars<br />
          <span className="tag">Student Portal</span>
        </div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {tabs.map(tab => (
            <button key={tab.id} className={`nav-btn ${active === tab.id ? "active" : ""}`}
              onClick={() => { setActive(tab.id); setMenuOpen(false); }}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 16, marginTop: 16 }}>
          <button onClick={logout} className="btn btn-danger" style={{ width: "100%", background: "rgba(220,38,38,.15)", color: "#FCA5A5", border: "1px solid rgba(220,38,38,.2)" }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content" style={{ flex: 1, padding: "32px 40px", minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
          <div className="animate-fadeUp">
            <div className="section-label">Student Dashboard</div>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 700, marginBottom: 6 }}>
              Welcome back, {user.name?.split(" ")[0]} 👋
            </h1>
            <p style={{ color: "#64748B", fontSize: "0.925rem" }}>Your learning hub — subjects, materials, and live sessions all here.</p>
          </div>
          <button className="btn btn-outline" style={{ display: "none" }} id="mobile-menu-btn" onClick={() => setMenuOpen(true)}>☰ Menu</button>
          <button className="btn btn-outline" style={{ display: "block" }} onClick={() => setMenuOpen(true)}>☰</button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <div key={s.label} className={`stat-card ${s.variant} animate-fadeUp-${i + 1}`}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "#64748B" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>⏳</div>
            Loading your dashboard…
          </div>
        ) : (
          <div className="animate-fadeUp-2">

            {active === "dashboard" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                  <div>
                    <div className="section-label">Progress</div>
                    <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.25rem", fontWeight: 700, marginBottom: 4 }}>
                      Keep learning with your active subjects
                    </h2>
                    <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
                      You have <strong>{subjects.length}</strong> enrolled subject{subjects.length !== 1 ? "s" : ""} and <strong>{myMaterials.length}</strong> available material{myMaterials.length !== 1 ? "s" : ""}.
                    </p>
                  </div>
                  <div style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 10, padding: "12px 18px", fontSize: "0.875rem", fontWeight: 500 }}>
                    {currentLive ? (
                      <span>🔴 Live now: <strong>{currentLive.subject}</strong></span>
                    ) : (
                      <span style={{ color: "#64748B" }}>📅 No live class scheduled</span>
                    )}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                  {subjects.slice(0, 6).map(sub => (
                    <div key={sub} style={{ background: "white", border: "1px solid #E2E8F2", borderRadius: 12, padding: "16px", textAlign: "center" }}>
                      <div style={{ fontSize: "1.3rem", marginBottom: 6 }}>📚</div>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "subjects" && (
              <div className="card">
                <div className="section-label">Enrolled</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20 }}>Your Subjects</h2>
                {subjects.length === 0 ? (
                  <p style={{ color: "#64748B" }}>No subjects assigned yet. Complete your payment to get access.</p>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                    {subjects.map(sub => (
                      <div key={sub} className="subject-pill" style={{ textAlign: "center", cursor: "default" }}>{sub}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {active === "materials" && (
              <div className="card">
                <div className="section-label">Resources</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20 }}>Study Materials</h2>
                {myMaterials.length === 0 ? (
                  <p style={{ color: "#64748B" }}>No materials available for your subjects yet.</p>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                    {myMaterials.map(item => (
                      <div key={item.id} style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 14, padding: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 3 }}>{item.title}</div>
                            <div style={{ fontSize: "0.8rem", color: "#64748B" }}>{item.subject}</div>
                          </div>
                          <span className="badge badge-blue">{item.type || "Material"}</span>
                        </div>
                        <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ textDecoration: "none", display: "inline-flex" }}>
                          Open →
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {active === "live" && (
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div>
                    <div className="section-label">Sessions</div>
                    <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>Live Classes</h2>
                  </div>
                  {currentLive && <span className="badge badge-live">Live Now</span>}
                </div>

                {currentLive ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 14, padding: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{currentLive.subject}</div>
                      <div style={{ color: "#64748B", fontSize: "0.875rem", marginBottom: 4 }}>Teacher: {currentLive.teacherName}</div>
                      <div style={{ color: "#94A3B8", fontSize: "0.8rem" }}>Room: {currentLive.roomId}</div>
                    </div>
                    <div style={{ background: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#065F46", marginBottom: 4 }}>Ready to Join?</div>
                        <div style={{ fontWeight: 600 }}>Live session is available now.</div>
                      </div>
                      <button onClick={joinLive} className="btn btn-success" style={{ marginTop: 12, alignSelf: "flex-start" }}>
                        Join Now →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ border: "2px dashed #E2E8F2", borderRadius: 14, padding: "40px 24px", textAlign: "center", color: "#94A3B8" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>📡</div>
                    No active live class running for your subjects. Check back later or contact your teacher.
                  </div>
                )}
              </div>
            )}

            {active === "profile" && (
              <div className="card">
                <div className="section-label">Account</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 24 }}>Your Profile</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 12, padding: "14px 18px" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Full Name</div>
                      <div style={{ fontWeight: 600 }}>{user.name}</div>
                    </div>
                    <div style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 12, padding: "14px 18px" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Email</div>
                      <div style={{ fontWeight: 600 }}>{user.email}</div>
                    </div>
                    <div style={{ background: "#F7F9FC", border: "1px solid #E2E8F2", borderRadius: 12, padding: "14px 18px" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Role</div>
                      <span className="badge badge-blue">Student</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: 10 }}>Profile Photo</div>
                    {photo ? (
                      <div style={{ marginBottom: 14 }}>
                        <img src={photo} alt="student" style={{ width: 120, height: 120, borderRadius: 16, objectFit: "cover", border: "2px solid #E2E8F2" }} />
                      </div>
                    ) : (
                      <div style={{ width: 120, height: 120, borderRadius: 16, background: "#F7F9FC", border: "2px dashed #E2E8F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", marginBottom: 14 }}>
                        👤
                      </div>
                    )}
                    <label style={{ cursor: "pointer" }}>
                      <input type="file" onChange={uploadPhoto} style={{ display: "none" }} accept="image/*" />
                      <span className="btn btn-outline btn-sm">📷 Upload Photo</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {active === "about" && (
              <div className="card">
                <div className="section-label">Platform</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 16 }}>About Maximo Scholars</h2>
                <p style={{ color: "#64748B", lineHeight: 1.75 }}>
                  Maximo Scholars Uganda connects paid students with live classes, experienced teachers, and quality learning materials. Only approved, paid subjects are accessible after subscription approval.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
