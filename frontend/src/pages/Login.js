import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
    try {
      setLoading(true);
      const data = await authAPI.login(email, password);

      const user = data.user;
      const token = data.token;
      const sub = typeof user.subscription === "string" ? JSON.parse(user.subscription) : user.subscription || {};

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("subjects", JSON.stringify(user.subjects || []));

      if (sub.status === "approved") localStorage.setItem("paid", "true");
      else localStorage.removeItem("paid");

      if (sub.expiresAt) {
        const today = new Date();
        const expiry = new Date(sub.expiresAt);
        if (today > expiry) { alert("Subscription expired. Renew access."); localStorage.removeItem("paid"); navigate("/subjects"); return; }
      }

      if (user.role === "admin") { navigate("/admin"); return; }
      if (user.role === "teacher") { navigate("/teacher"); return; }
      if (sub.status === "approved") navigate("/dashboard");
      else navigate("/subjects");
    } catch (err) {
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0B1628 0%, #163060 60%, #0F2858 100%)",
      padding: "24px", position: "relative", overflow: "hidden"
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "-20%", right: "-10%",
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(212,168,67,.15) 0%, transparent 65%)",
        pointerEvents: "none"
      }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "white", letterSpacing: "-0.02em" }}>
            Maximo Scholars
          </div>
          <div style={{ color: "rgba(255,255,255,.5)", fontSize: "0.875rem", marginTop: 4 }}>Uganda's Premier Learning Platform</div>
        </div>

        <div className="card animate-fadeUp" style={{ padding: "36px 32px" }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: 4 }}>Welcome back</h2>
            <p style={{ color: "#64748B", fontSize: "0.875rem" }}>Sign in to continue your learning journey.</p>
          </div>

          {error && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B",
              padding: "12px 16px", borderRadius: 10, fontSize: "0.875rem", marginBottom: 20
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: 6 }}>Email Address</label>
              <input
                type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"} placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="input" style={{ paddingRight: 48 }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", opacity: 0.6
                }}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 6, padding: "13px", borderRadius: 10, fontSize: "0.95rem" }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 22, fontSize: "0.875rem", color: "#64748B" }}>
            Don't have an account?{" "}
            <button onClick={() => navigate("/register")} style={{
              background: "none", border: "none", color: "#1C3060", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem"
            }}>
              Create Account
            </button>
          </div>

          <button onClick={() => navigate("/")} className="btn btn-outline" style={{ width: "100%", marginTop: 12, padding: "11px" }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
