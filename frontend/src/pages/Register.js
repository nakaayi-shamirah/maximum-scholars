import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", school: "", referral: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "https://maximum-scholars-1-api.onrender.com";

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); setSuccess(""); };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.school.trim() || !form.password.trim() || !form.confirmPassword.trim()) return "Please fill all required fields.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { setError(err); return; }
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setSuccess("Account created successfully! Please log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Unable to connect to server.");
    } finally { setLoading(false); }
  };

  const fields = [
    { name: "name", label: "Full Name", placeholder: "Your full name", type: "text" },
    { name: "email", label: "Email Address", placeholder: "you@example.com", type: "email" },
    { name: "school", label: "School / Institution", placeholder: "Name of your school", type: "text" },
    { name: "referral", label: "Referral Code (optional)", placeholder: "If you have one", type: "text" },
  ];

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0B1628 0%, #163060 60%, #0F2858 100%)",
      padding: "32px 24px", position: "relative", overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(212,168,67,.14) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "white", letterSpacing: "-0.02em" }}>Maximo Scholars</div>
          <div style={{ color: "rgba(255,255,255,.5)", fontSize: "0.875rem", marginTop: 4 }}>Create your student account</div>
        </div>

        <div className="card animate-fadeUp" style={{ padding: "36px 32px" }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.4rem", fontWeight: 700, marginBottom: 4 }}>Create Account</h2>
            <p style={{ color: "#64748B", fontSize: "0.875rem" }}>Join thousands of A-Level students learning smarter.</p>
          </div>

          {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "12px 16px", borderRadius: 10, fontSize: "0.875rem", marginBottom: 18 }}>{error}</div>}
          {success && <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", padding: "12px 16px", borderRadius: 10, fontSize: "0.875rem", marginBottom: 18 }}>✓ {success}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {fields.map(f => (
              <div key={f.name}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: 6 }}>{f.label}</label>
                <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} className="input" required={f.name !== "referral"} />
              </div>
            ))}

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input name="password" type={showPassword ? "text" : "password"} placeholder="At least 6 characters" value={form.password} onChange={handleChange} className="input" style={{ paddingRight: 48 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", opacity: 0.5 }}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: 6 }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} className="input" style={{ paddingRight: 48 }} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", opacity: 0.5 }}>
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 6, padding: "13px", borderRadius: 10, fontSize: "0.95rem" }}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.875rem", color: "#64748B" }}>
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "#1C3060", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}>Sign In</button>
          </div>

          <button onClick={() => navigate("/")} className="btn btn-outline" style={{ width: "100%", marginTop: 12, padding: "11px" }}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}
