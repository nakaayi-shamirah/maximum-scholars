import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LiveClasses() {
  const navigate = useNavigate();
  const API = "https://maximum-scholars-1-api.onrender.com";
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = localStorage.getItem("role") || "student";
  const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
  const [liveClasses, setLiveClasses] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch(`${API}/api/live?all=true`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setLiveClasses(data);
          const active = data.find((item) => item.status === "live");
          setActiveClass(active || null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLive();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const joinLive = async (live) => {
    if (!live) {
      alert("No active live class found.");
      return;
    }

    if (role === "student" && !subjects.includes(live.subject)) {
      alert(`You are not enrolled for ${live.subject}.`);
      return;
    }

    localStorage.setItem("liveClassStatus", "started");
    localStorage.setItem("liveTeacher", live.teacherName);
    localStorage.setItem("liveSubject", live.subject);
    localStorage.setItem("liveRoomId", live.roomId);
    setActiveClass(live);
  };

  const handleEnd = async (live) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/api/live/end/${live.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActiveClass(null);
      setLiveClasses(liveClasses.map((item) => (item.id === live.id ? { ...item, status: "ended" } : item)));
      localStorage.removeItem("liveClassStatus");
      localStorage.removeItem("liveTeacher");
      localStorage.removeItem("liveSubject");
      localStorage.removeItem("liveRoomId");
    } catch (error) {
      console.error(error);
      alert("Failed to stop class.");
    }
  };

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const card = "rounded-3xl bg-slate-900/90 p-6 text-white shadow-xl";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Live Classes</h1>
            <p className="text-slate-300 mt-2">{roleLabel} dashboard for real-time sessions.</p>
          </div>
          <div className="space-y-2 text-right">
            <p className="text-slate-400">User: {user.name}</p>
            <button onClick={logout} className="rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white">
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className={card}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-slate-300">Live classroom status</p>
                <h2 className="text-3xl font-bold">{activeClass ? "Live Now" : "No active class"}</h2>
              </div>
              <div className="rounded-3xl bg-slate-800 px-4 py-3 text-slate-200">
                Role: {roleLabel}
              </div>
            </div>

            {loading ? (
              <p>Loading classes...</p>
            ) : activeClass ? (
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-700 p-5">
                  <p className="text-slate-400">Subject</p>
                  <p className="text-2xl font-semibold">{activeClass.subject}</p>
                  <p className="text-slate-400 mt-2">Teacher: {activeClass.teacherName}</p>
                  <p className="text-slate-400">Room: {activeClass.roomId}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button onClick={() => joinLive(activeClass)} className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white">
                    Join Class
                  </button>
                  {role !== "student" && activeClass.status === "live" && (
                    <button onClick={() => handleEnd(activeClass)} className="rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white">
                      End Class
                    </button>
                  )}
                </div>

                <div className="h-[450px] overflow-hidden rounded-3xl border border-slate-700">
                  <iframe
                    title="Jitsi Live Class"
                    src={activeClass ? `https://meet.jit.si/${encodeURIComponent(activeClass.roomId)}#config.prejoinPageEnabled=false&userInfo.displayName=${encodeURIComponent(user.name || roleLabel)}` : "about:blank"}
                    className="h-full w-full"
                    allow="camera; microphone; fullscreen; display-capture"
                  />
                </div>
              </div>
            ) : (
              <p className="text-slate-300">There is no live class available right now. Please check back later.</p>
            )}
          </div>

          <div className="space-y-6">
            <div className={card}>
              <h2 className="text-2xl font-semibold">Available Live Classes</h2>
              <div className="space-y-4 mt-4">
                {liveClasses.length === 0 ? (
                  <p className="text-slate-400">No live classes have been scheduled yet.</p>
                ) : (
                  liveClasses.map((live) => (
                    <div key={live.id} className="rounded-3xl border border-slate-700 p-4">
                      <p className="font-semibold">{live.subject}</p>
                      <p className="text-sm text-slate-400">Teacher: {live.teacherName}</p>
                      <p className="text-sm text-slate-400">Status: {live.status}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={card}>
              <h2 className="text-2xl font-semibold">Your Access</h2>
              <p className="text-slate-400 mt-3">Subjects enrolled: {subjects.join(", ") || "No subjects selected."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
