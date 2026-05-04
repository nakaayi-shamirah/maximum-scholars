import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {

  const navigate = useNavigate();
  const API = "https://maximum-scholars-1-api.onrender.com";

  /* =========================
     STATES
  ========================= */
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");

  /* =========================
     LOCAL (TEMP UNTIL BACKEND)
  ========================= */
  const admin = JSON.parse(localStorage.getItem("user")) || {};

  /* =========================
     FETCH
  ========================= */
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(await res.json());
  };

  const fetchPayments = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/payments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPayments(await res.json());
  };

  const fetchMaterials = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/materials`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMaterials(await res.json());
  };

  useEffect(() => {
    fetchUsers();
    fetchPayments();
    fetchMaterials();
  }, []);

  /* =========================
     HELPERS
  ========================= */
  const parseSub = (v) => {
    if (!v) return {};
    if (typeof v === "string") {
      try { return JSON.parse(v); }
      catch { return {}; }
    }
    return v;
  };

  /* =========================
     ACTIONS
  ========================= */
  const approveUser = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`${API}/api/users/approve/${id}`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
    });

    fetchUsers();
    fetchPayments();
  };

  const rejectUser = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`${API}/api/users/reject/${id}`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
    });

    fetchUsers();
    fetchPayments();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;
    await fetch(`${API}/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* =========================
     FILTERS
  ========================= */
  const students = users.filter((u) => u.role === "student");
  const teachers = users.filter((u) => u.role === "teacher");

  const pending = students.filter(
    (u) => parseSub(u.subscription).status === "pending"
  );

  const approved = students.filter(
    (u) => parseSub(u.subscription).status === "approved"
  );

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const theme = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black";
  const card = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";

  /* =========================
     UI
  ========================= */
  return (
    <div className={`flex min-h-screen ${theme}`}>

      {/* SIDEBAR */}
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

      {/* MAIN */}
      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Welcome, {admin.name || "Admin"} 👑
        </h1>

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div className="grid md:grid-cols-4 gap-6">
            <div className={`${card} p-6 rounded-2xl`}><p>Students</p><h2>{students.length}</h2></div>
            <div className={`${card} p-6 rounded-2xl`}><p>Teachers</p><h2>{teachers.length}</h2></div>
            <div className={`${card} p-6 rounded-2xl`}><p>Pending</p><h2>{pending.length}</h2></div>
            <div className={`${card} p-6 rounded-2xl`}><p>Approved</p><h2>{approved.length}</h2></div>
          </div>
        )}

        {/* USERS */}
        {active === "users" && (
          <div className={`${card} p-6 rounded-xl`}>
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search..." className="w-full p-3 border mb-4"/>
            {filtered.map(u => (
              <div key={u.id} className="flex justify-between py-3 border-b">
                <div>{u.name} ({u.role})</div>
                {parseSub(u.subscription).status === "pending" && (
                  <div>
                    <button onClick={()=>approveUser(u.id)}>Approve</button>
                    <button onClick={()=>rejectUser(u.id)}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* PAYMENTS */}
        {active === "payments" && (
          <div className={`${card} p-6`}>
            {payments.map(p => (
              <div key={p.id} className="flex justify-between border-b py-3">
                <div>{p.email}</div>
                <div>
                  <button onClick={()=>approveUser(p.userId || p.id)}>Approve</button>
                  <button onClick={()=>rejectUser(p.userId || p.id)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TEACHERS */}
        {active === "teachers" && (
          <div className={`${card} p-6`}>
            {teachers.map(t => (
              <div key={t.id} className="flex justify-between border-b py-3">
                <div>{t.name}</div>
                <button onClick={()=>deleteUser(t.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}

        {/* MATERIALS */}
        {active === "materials" && (
          <div className={`${card} p-6`}>
            {materials.map(m => (
              <div key={m.id} className="border-b py-3">
                <p>{m.title}</p>
                <a href={m.link}>Open</a>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY TABS (NEXT STEP BACKEND) */}
        {active === "live" && <div className={card}>Live system coming...</div>}
        {active === "notices" && <div className={card}>Notices system coming...</div>}
        {active === "report" && <div className={card}>Reports coming...</div>}
        {active === "statistics" && <div className={card}>Stats coming...</div>}
        {active === "profile" && <div className={card}>{admin.name}</div>}
        {active === "settings" && <div className={card}><button onClick={()=>setDarkMode(!darkMode)}>Toggle Theme</button></div>}
        {active === "about" && <div className={card}>Maximum Scholars Uganda</div>}

      </div>
    </div>
  );
}