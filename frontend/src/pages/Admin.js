import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {

  const navigate = useNavigate();
  const API = "https://maximum-scholars-1-api.onrender.com";

  /* =========================
     STATES
  ========================= /
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]); // added
  const [notices, setNotices] = useState([]); // added

  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");

  const admin = JSON.parse(localStorage.getItem("user")) || {};

  / =========================
     SAFE FETCH (added)
  ========================= /
  const safeFetch = async (url) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        headers: { Authorization: Bearer ${token} },
      });
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.data)) return data.data;
      return [];
    } catch (e) {
      console.log("Fetch error:", url);
      return [];
    }
  };

  / =========================
     FETCH
  ========================= /
  const fetchUsers = async () => {
    const data = await safeFetch(${API}/api/users);
    setUsers(data);
  };

  const fetchPayments = async () => {
    const data = await safeFetch(${API}/api/payment); // fixed endpoint
    setPayments(data);
  };

  const fetchMaterials = async () => {
    const data = await safeFetch(${API}/api/materials);
    setMaterials(data);
  };

  // added (safe even if backend not ready)
  const fetchLive = async () => {
    const data = await safeFetch(${API}/api/live);
    setLiveClasses(data);
  };

  const fetchNotices = async () => {
    const data = await safeFetch(${API}/api/notices);
    setNotices(data);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchUsers();
      await fetchPayments();
      await fetchMaterials();
      await fetchLive();
      await fetchNotices();
      setLoading(false);
    };
    load();
  }, []);

  / =========================
     HELPERS
  ========================= /
  const parseSub = (v) => {
    if (!v) return {};
    if (typeof v === "string") {
      try { return JSON.parse(v); }
      catch { return {}; }
    }
    return v;
  };

  / =========================
     ACTIONS
  ========================= /
  const approveUser = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(${API}/api/users/approve/${id}, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
    });

    fetchUsers();
    fetchPayments();
  };

  const rejectUser = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(${API}/api/users/reject/${id}, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
    });

    fetchUsers();
    fetchPayments();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;
    await fetch(${API}/api/users/${id}, { method: "DELETE" });
    fetchUsers();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  / =========================
     FILTERS (safe)
  ========================= /
  const safeUsers = Array.isArray(users) ? users : [];

  const students = safeUsers.filter((u) => u.role === "student");
  const teachers = safeUsers.filter((u) => u.role === "teacher");

  const pending = students.filter(
    (u) => parseSub(u.subscription).status === "pending"
  );

  const approved = students.filter(
    (u) => parseSub(u.subscription).status === "approved"
  );

  const filtered = safeUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const theme = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black";
  const card = darkMode ? "bg-gray-800 text-white p-6 rounded-xl" : "bg-white text-black p-6 rounded-xl";

  / =========================
     UI
  ========================= /
  return (
    <div className={flex min-h-screen ${theme}}>

      {/ SIDEBAR /}
      <div className="w-72 bg-gradient-to-b from-indigo-700 to-blue-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        <ul className="space-y-3 text-sm">
          <li onClick={()=>setActive("dashboard")} className="p-3 cursor-pointer">Dashboard</li>
          <li onClick={()=>setActive("payments")} className="p-3 cursor-pointer">Payments</li>
          <li onClick={()=>setActive("users")} className="p-3 cursor-pointer">Users</li>
          <li onClick={()=>setActive("teachers")} className="p-3 cursor-pointer">Teachers</li>
          <li onClick={()=>setActive("materials")} className="p-3 cursor-pointer">Materials</li>
          <li onClick={()=>setActive("live")} className="p-3 cursor-pointer">Live Classes</li>
          <li onClick={()=>setActive("notices")} className="p-3 cursor-pointer">Notices</li>
          <li onClick={()=>setActive("report")} className="p-3 cursor-pointer">Report</li>
          <li onClick={()=>setActive("statistics")} className="p-3 cursor-pointer">Statistics</li>
          <li onClick={()=>setActive("profile")} className="p-3 cursor-pointer">Profile</li>
          <li onClick={()=>setActive("settings")} className="p-3 cursor-pointer">Settings</li>
          <li onClick={()=>setActive("about")} className="p-3 cursor-pointer">About</li>
        </ul>

        <button onClick={logout} className="mt-8 w-full bg-red-500 py-3 rounded-xl">
          Logout
        </button>
      </div>

      {/ MAIN /}
      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Welcome, {admin.name || "Admin"} 👑
        </h1>

        {loading && <p>Loading...</p>}

        {/ DASHBOARD /}
        {active === "dashboard" && (
          <div className="grid md:grid-cols-4 gap-6">
            <div className={card}><p>Students</p><h2>{students.length}</h2></div>
            <div className={card}><p>Teachers</p><h2>{teachers.length}</h2></div>
            <div className={card}><p>Pending</p><h2>{pending.length}</h2></div>
            <div className={card}><p>Approved</p><h2>{approved.length}</h2></div>
          </div>
        )}

        {/ USERS /}
        {active === "users" && (
          <div className={card}>
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search..." className="w-full p-3 border mb-4"/>
            {filtered.length === 0 && <p>No users found</p>}
            {filtered.map(u => (
              <div key={u.id} className="flex justify-between py-2 border-b">
                <div>{u.name} ({u.role})</div>
              </div>
            ))}
          </div>
        )}

        {/ PAYMENTS /}
        {active === "payments" && (
          <div className={card}>
            {payments.length === 0 && <p>No payments yet</p>}
            {payments.map(p => (
              <div key={p.id} className="flex justify-between border-b py-2">
                <div>{p.email}</div>
                <div>
                  <button onClick={()=>approveUser(p.userId || p.id)}>Approve</button>
                  <button onClick={()=>rejectUser(p.userId || p.id)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/ TEACHERS /}
        {active === "teachers" && (
          <div className={card}>
            {teachers.length === 0 && <p>No teachers</p>}
            {teachers.map(t => (
              <div key={t.id} className="flex justify-between border-b py-2">
                <div>{t.name}</div>
                <button onClick={()=>deleteUser(t.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}

        {/ MATERIALS /}
        {active === "materials" && (
          <div className={card}>
            {materials.length === 0 && <p>No materials</p>}
            {materials.map(m => (
              <div key={m.id} className="border-b py-2">
                <p>{m.title}</p>
                <a href={m.link}>Open</a>
              </div>
            ))}
          </div>
        )}

        {/ LIVE /}
        {active === "live" && (
          <div className={card}>
            {liveClasses.length === 0 ? "No live classes yet" :
              liveClasses.map(l => <div key={l.id}>{l.subject}</div>)
            }
          </div>
        )}

        {/ NOTICES /}
        {active === "notices" && (
          <div className={card}>
            {notices.length === 0 ? "No notices yet" :
              notices.map(n => <div key={n.id}>{n.title}</div>)
            }
          </div>
        )}

        {/ REPORT /}
        {active === "report" && (
          <div className={card}>
            <p>Total Users: {users.length}</p>
            <p>Total Payments: {payments.length}</p>
          </div>
        )}

        {/ STATISTICS /}
        {active === "statistics" && (
          <div className={card}>
            <p>Students: {students.length}</p>
            <p>Teachers: {teachers.length}</p>
          </div>
        )}

        {/ PROFILE /}
        {active === "profile" && (
          <div className={card}>
            <p>{admin.name}</p>
            <p>{admin.email}</p>
          </div>
        )}

        {/ SETTINGS /}
        {active === "settings" && (
          <div className={card}>
            <button onClick={()=>setDarkMode(!darkMode)}>Toggle Theme</button>
          </div>
        )}

        {/ ABOUT */}
        {active === "about" && (
          <div className={card}>
            Maximo Scholars Uganda Platform
          </div>
        
  );
 }