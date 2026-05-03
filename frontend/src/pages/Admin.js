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
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");

  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    password: "",
    subjects: ""
  });

  /* =========================
     LOCAL DATA
  ========================= */
  const admin = JSON.parse(localStorage.getItem("user")) || {};
  const materials = JSON.parse(localStorage.getItem("materials")) || [];
  const results = JSON.parse(localStorage.getItem("quizResults")) || [];

  const photo = localStorage.getItem("adminPhoto") || "";
  const liveStatus = localStorage.getItem("liveClassStatus");
  const liveTeacher = localStorage.getItem("liveTeacher");
  const liveSubject = localStorage.getItem("liveSubject");

  /* =========================
     FETCH USERS
  ========================= */
  const fetchUsers = async () => {
    try {
    const token = localStorage.getItem("token");

const res = await fetch(`${API}/api/users`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     FETCH PAYMENTS ✅ NEW
  ========================= */
  const fetchPayments = async () => {
    try {
      const res = await fetch(`${API}/api/payment`);
      const data = await res.json();

      console.log("PAYMENTS:", data);

      setPayments(data);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    fetchUsers();
    fetchPayments(); // ✅ important
    setLoading(false);
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
    await fetch(`${API}/api/users/approve/${id}`, { method: "PUT" });
    fetchUsers();
  };

  const rejectUser = async (id) => {
    await fetch(`${API}/api/users/reject/${id}`, { method: "PUT" });
    fetchUsers();
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

  const ranked = [...results].sort((a, b) => b.score - a.score);

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
          <li onClick={()=>setActive("dashboard")} className="cursor-pointer p-3">Dashboard</li>
          <li onClick={()=>setActive("payments")} className="cursor-pointer p-3">Payments</li>
          <li onClick={()=>setActive("users")} className="cursor-pointer p-3">Users</li>
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

        {/* PAYMENTS UI FIXED */}
        {active === "payments" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            <h2 className="text-2xl font-bold mb-6">
              Payment Requests
            </h2>

            {payments.length === 0 && (
              <p>No payments yet</p>
            )}

            {payments.map((p) => (
              <div key={p.id} className="border-b py-4 flex justify-between">

                <div>
                  <p className="font-bold">{p.email}</p>
                  <p>UGX {p.amount}</p>
                  <p>{p.method}</p>
                  <p className="text-sm text-gray-500">{p.reference}</p>
                </div>

                <div className="space-x-2">
                  <button className="bg-green-500 text-white px-4 py-2 rounded-xl">
                    Approve
                  </button>

                  <button className="bg-red-500 text-white px-4 py-2 rounded-xl">
                    Reject
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}