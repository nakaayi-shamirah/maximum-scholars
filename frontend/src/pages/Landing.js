import { useNavigate } from "react-router-dom";

const subjects = [
  "Biology","Physics","Chemistry","Mathematics","Geography",
  "Economics","History","Divinity","Entrepreneurship","Agriculture","SUB ICT","SUB MATH"
];

const features = [
  { icon: "🎓", label: "Expert A-Level Teachers", desc: "Learn from experienced educators committed to your results." },
  { icon: "📡", label: "Live Interactive Classes", desc: "Real-time sessions with your teacher via Jitsi Meet." },
  { icon: "📄", label: "Study Materials & Notes", desc: "Access curated notes, tests and quizzes for every subject." },
  { icon: "📊", label: "Progress Tracking", desc: "Monitor your learning journey and stay on track." },
  { icon: "📍", label: "Learn Anywhere in Uganda", desc: "Study from your phone or laptop, wherever you are." },
  { icon: "💳", label: "Affordable Monthly Access", desc: "Flexible plans designed for Ugandan students." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F7F9FC", color: "#0F172A" }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 48px", height: "68px",
        background: "white", borderBottom: "1px solid #E2E8F2",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 12px rgba(0,0,0,.05)"
      }}>
        <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#0B1628", letterSpacing: "-0.02em" }}>
          Maximo Scholars
          <span style={{
            marginLeft: 8, background: "linear-gradient(135deg, #D4A843, #F0C96A)", color: "#0B1628",
            fontSize: "0.6rem", fontWeight: 800, padding: "2px 7px", borderRadius: 5,
            letterSpacing: "0.08em", textTransform: "uppercase", verticalAlign: "middle"
          }}>Uganda</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/login")} className="btn btn-outline" style={{ borderRadius: 10 }}>
            Sign In
          </button>
          <button onClick={() => navigate("/register")} className="btn btn-gold">
            Get Started →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-gradient" style={{ padding: "80px 48px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 420px", gap: 60, alignItems: "center" }}>
          <div className="animate-fadeUp">
            <div className="section-label" style={{ color: "#F0C96A", marginBottom: 12 }}>
              Uganda's Smart Learning Platform
            </div>
            <h1 style={{
              fontFamily: "'Sora', sans-serif", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
              fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.03em"
            }}>
              Academic Excellence<br />
              <span style={{ color: "#F0C96A" }}>Starts Here.</span>
            </h1>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,.72)", lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
              Maximo Scholars Uganda brings live A-Level classes, expert teachers, and premium study materials to students across Uganda — all in one platform.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => navigate("/register")} className="btn btn-gold btn-lg">
                Join Now — It's Free
              </button>
              <button onClick={() => navigate("/login")} className="btn btn-lg" style={{
                background: "rgba(255,255,255,.1)", color: "white", border: "1.5px solid rgba(255,255,255,.2)"
              }}>
                Student Login
              </button>
            </div>
          </div>

          <div className="card animate-fadeUp-2" style={{ padding: 32 }}>
            <div style={{ marginBottom: 20 }}>
              <div className="section-label">Why Students Choose Us</div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.2rem", fontWeight: 700 }}>6 Reasons to Join</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {features.map(f => (
                <div key={f.label} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "10px 14px", borderRadius: 10, background: "#F7F9FC",
                  border: "1px solid #E2E8F2"
                }}>
                  <span style={{ fontSize: "1.1rem", marginTop: 1 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontSize: "0.78rem", color: "#64748B" }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ padding: "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-label" style={{ textAlign: "center" }}>About Us</div>
          <h2 className="section-title" style={{ fontSize: "2rem", marginBottom: 16 }}>Built for Ugandan Students</h2>
          <p style={{ color: "#64748B", fontSize: "1.05rem", maxWidth: 660, margin: "0 auto", lineHeight: 1.75 }}>
            Our experienced educators provide clear, engaging instruction tailored to Uganda A-Level learners. With flexible online classes and a supportive environment, Maximo Scholars makes studying smarter and more effective.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { icon: "👩‍🏫", title: "Professional Teachers", body: "Learn from qualified educators who are committed to student success and academic results.", color: "#EFF6FF", accent: "#1D4ED8" },
            { icon: "📱", title: "Flexible Learning", body: "Study on your phone or laptop from anywhere in Uganda with no fixed classroom schedule.", color: "#F0FDF4", accent: "#065F46" },
            { icon: "🏆", title: "Better Performance", body: "Improve with live classes, quizzes, mock tests, and downloadable study materials.", color: "#FDF3DC", accent: "#92400E" },
          ].map(c => (
            <div key={c.title} className="feature-card animate-fadeUp">
              <div className="feature-icon" style={{ background: c.color }}>
                <span>{c.icon}</span>
              </div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: 8, color: c.accent }}>{c.title}</h3>
              <p style={{ color: "#64748B", fontSize: "0.875rem", lineHeight: 1.65 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SUBJECTS */}
      <section style={{ background: "white", padding: "80px 48px", borderTop: "1px solid #E2E8F2", borderBottom: "1px solid #E2E8F2" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-label" style={{ textAlign: "center" }}>Curriculum</div>
            <h2 className="section-title" style={{ fontSize: "2rem", marginBottom: 12 }}>Subjects Offered</h2>
            <p style={{ color: "#64748B" }}>Designed for Uganda A-Level learners across all combination options.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
            {subjects.map(s => (
              <div key={s} className="subject-pill" style={{ textAlign: "center", cursor: "default" }}>{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div className="section-label" style={{ textAlign: "center" }}>Ready?</div>
          <h2 className="section-title" style={{ fontSize: "2.2rem", marginBottom: 16 }}>Unlock Your Full Potential</h2>
          <p style={{ color: "#64748B", fontSize: "1.05rem", marginBottom: 36 }}>Join thousands of Ugandan students learning smarter with Maximo Scholars.</p>
          <button onClick={() => navigate("/register")} className="btn btn-primary btn-lg" style={{ marginRight: 12 }}>
            Create Free Account
          </button>
          <button onClick={() => navigate("/login")} className="btn btn-outline btn-lg">
            Sign In
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0B1628", color: "rgba(255,255,255,.7)", padding: "40px 48px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "white", marginBottom: 6 }}>
          Maximo Scholars Uganda
        </div>
        <p style={{ fontSize: "0.875rem", marginBottom: 12 }}>Learn Anytime, Anywhere.</p>
        <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,.4)" }}>© 2026 Maximo Scholars Uganda. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
