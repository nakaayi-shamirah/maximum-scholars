import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Teacher() {
  const navigate = useNavigate();

  const [active, setActive] =
    useState("dashboard");

  const [darkMode, setDarkMode] =
    useState(false);
  

// ✅ PASTE HERE 👇
const startLiveClass = async (subject) => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch("https://maximum-scholars-1-api.onrender.com/api/live/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        subject,
        teacherId: user.id,
        teacherName: user.name,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Live class started 🚀");
    } else {
      alert(data.message || "Failed");
    }

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};

  const [photo, setPhoto] =
    useState(
      localStorage.getItem(
        "teacherPhoto"
      ) || ""
    );

  const teacher =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    ) || {};

  const teacherName =
    teacher.name ||
    "Teacher";

  const teacherEmail =
    teacher.email ||
    "teacher@gmail.com";

  const subjects =
    JSON.parse(
      localStorage.getItem(
        "teacherSubjects"
      )
    ) ||
    teacher.assignedSubjects ||
    ["Mathematics"];

  const quizzes =
    JSON.parse(
      localStorage.getItem(
        "quizzes"
      )
    ) || [];

  const results =
    JSON.parse(
      localStorage.getItem(
        "quizResults"
      )
    ) || [];

  const materials =
    JSON.parse(
      localStorage.getItem(
        "materials"
      )
    ) || [];

  const notifications =
    JSON.parse(
      localStorage.getItem(
        "teacherNotifications"
      )
    ) || [];

  const attendance =
    JSON.parse(
      localStorage.getItem(
        "liveAttendance"
      )
    ) || [];

  const liveStatus =
    localStorage.getItem(
      "liveClassStatus"
    );

  const liveSubject =
    localStorage.getItem(
      "liveSubject"
    );

  const [title, setTitle] =
    useState("");

  const [subject, setSubject] =
    useState(
      subjects[0] || ""
    );

  const [link, setLink] =
    useState("");

  const [quizTitle, setQuizTitle] =
    useState("");

  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const theme =
    darkMode
      ? "bg-gray-900 text-white"
      : "bg-gray-100 text-black";

  const card =
    darkMode
      ? "bg-gray-800 text-white"
      : "bg-white text-black";

  const myQuizzes =
    quizzes.filter(
      (q) =>
        q.teacher ===
        teacherName
    );

  const myResults =
    results.filter(
      (r) =>
        subjects.includes(
          r.subject
        )
    );

  const myMaterials =
    materials.filter(
      (m) =>
        subjects.includes(
          m.subject
        )
    );

  const average =
    myResults.length === 0
      ? 0
      : Math.round(
          myResults.reduce(
            (
              a,
              b
            ) =>
              a +
              b.score,
            0
          ) /
            myResults.length
        );

  const uploadPhoto = (
    e
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload =
      () => {
        setPhoto(
          reader.result
        );

        localStorage.setItem(
          "teacherPhoto",
          reader.result
        );
      };

    reader.readAsDataURL(
      file
    );
  };

  const uploadMaterial =
    () => {
      if (
        !title ||
        !subject ||
        !link
      ) {
        alert(
          "Fill all fields"
        );
        return;
      }

      const updated = [
        {
          id:
            Date.now(),
          title,
          subject,
          link,
          teacher:
            teacherName
        },
        ...materials
      ];

      localStorage.setItem(
        "materials",
        JSON.stringify(
          updated
        )
      );

      alert(
        "Material uploaded"
      );

      setTitle("");
      setLink("");
    };

  const createQuiz =
    () => {
      if (
        !quizTitle ||
        !question ||
        !answer
      ) {
        alert(
          "Fill all fields"
        );
        return;
      }

      const updated = [
        {
          id:
            Date.now(),
          title:
            quizTitle,
          subject,
          question,
          answer,
          teacher:
            teacherName
        },
        ...quizzes
      ];

      localStorage.setItem(
        "quizzes",
        JSON.stringify(
          updated
        )
      );

      alert(
        "Quiz created"
      );

      setQuizTitle("");
      setQuestion("");
      setAnswer("");
    };

  const startLiveClass =
    (liveSubject) => {

      localStorage.setItem(
        "liveClassStatus",
        "started"
      );

      localStorage.setItem(
        "liveTeacher",
        teacherName
      );

      localStorage.setItem(
        "liveSubject",
        liveSubject
      );

      localStorage.setItem(
        "liveAttendance",
        JSON.stringify([])
      );

      const oldNotices =
        JSON.parse(
          localStorage.getItem(
            "studentNotifications"
          )
        ) || [];

      const newNotice = {
        id: Date.now(),
        text:
          `${liveSubject} class started by ${teacherName}`,
        time:
          new Date().toLocaleString()
      };

      localStorage.setItem(
        "studentNotifications",
        JSON.stringify([
          newNotice,
          ...oldNotices
        ])
      );

      navigate(
        "/live"
      );
    };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      className={`flex min-h-screen ${theme}`}
    >

      {/* SIDEBAR */}
      <div className="w-72 bg-gradient-to-b from-green-700 to-emerald-900 text-white p-6">

        <h1 className="text-3xl font-bold mb-8">
          Teacher Panel
        </h1>

        <ul className="space-y-3 text-sm">

          <li onClick={()=>setActive("dashboard")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">📊 Dashboard</li>

          <li onClick={()=>setActive("materials")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">📄 Materials</li>

          <li onClick={()=>setActive("upload")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">⬆️ Upload Material</li>

          <li onClick={()=>setActive("quiz")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">📝 Create Quiz</li>

          <li onClick={()=>setActive("analytics")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">📈 Analytics</li>

          <li onClick={()=>setActive("live")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">🎥 Live Classes</li>

          <li onClick={()=>setActive("timetable")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">🗓️ Timetable</li>

          <li onClick={()=>setActive("profile")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">👤 Profile</li>

          <li onClick={()=>setActive("settings")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">⚙️ Settings</li>

          <li onClick={()=>setActive("about")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">ℹ️ About</li>

          <li onClick={()=>setActive("support")} className="cursor-pointer hover:bg-white/20 p-3 rounded-xl">💬 Support</li>

        </ul>

        <button
          onClick={
            logout
          }
          className="mt-8 w-full bg-red-500 py-3 rounded-xl"
        >
          Logout
        </button>

      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Welcome, {teacherName} 👩‍🏫
        </h1>

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div className="grid md:grid-cols-4 gap-6">

            <div className={`${card} p-6 rounded-2xl shadow`}>
              <p>My Quizzes</p>
              <h2 className="text-3xl font-bold text-green-500">
                {myQuizzes.length}
              </h2>
            </div>

            <div className={`${card} p-6 rounded-2xl shadow`}>
              <p>Materials</p>
              <h2 className="text-3xl font-bold text-blue-500">
                {myMaterials.length}
              </h2>
            </div>

            <div className={`${card} p-6 rounded-2xl shadow`}>
              <p>Average Score</p>
              <h2 className="text-3xl font-bold text-purple-500">
                {average}%
              </h2>
            </div>

            <div className={`${card} p-6 rounded-2xl shadow`}>
              <p>Alerts</p>
              <h2 className="text-3xl font-bold text-red-500">
                {notifications.length}
              </h2>
            </div>

          </div>
        )}

        {/* MATERIALS */}
        {active === "materials" && (
          <div className="grid md:grid-cols-2 gap-6">

            {myMaterials.map((item)=>(
              <div
                key={item.id}
                className={`${card} p-6 rounded-2xl shadow`}
              >
                <h2 className="font-bold text-xl">
                  {item.title}
                </h2>

                <p className="text-gray-500 mb-3">
                  {item.subject}
                </p>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-semibold"
                >
                  Open Material
                </a>
              </div>
            ))}

          </div>
        )}

        {/* UPLOAD */}
        {active === "upload" && (
          <div className={`${card} p-8 rounded-2xl shadow space-y-4`}>

            <h2 className="text-2xl font-bold">
              Upload Material
            </h2>

            <input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full border p-3 rounded-xl text-black" />

            <select value={subject} onChange={(e)=>setSubject(e.target.value)} className="w-full border p-3 rounded-xl text-black">
              {subjects.map((s)=>(
                <option key={s}>
                  {s}
                </option>
              ))}
            </select>

            <input placeholder="Material Link" value={link} onChange={(e)=>setLink(e.target.value)} className="w-full border p-3 rounded-xl text-black" />

            <button onClick={uploadMaterial} className="bg-green-500 text-white px-6 py-3 rounded-xl">
              Upload
            </button>

          </div>
        )}

        {/* QUIZ */}
        {active === "quiz" && (
          <div className={`${card} p-8 rounded-2xl shadow space-y-4`}>

            <h2 className="text-2xl font-bold">
              Create Quiz
            </h2>

            <input placeholder="Quiz Title" value={quizTitle} onChange={(e)=>setQuizTitle(e.target.value)} className="w-full border p-3 rounded-xl text-black" />

            <input placeholder="Question" value={question} onChange={(e)=>setQuestion(e.target.value)} className="w-full border p-3 rounded-xl text-black" />

            <input placeholder="Correct Answer" value={answer} onChange={(e)=>setAnswer(e.target.value)} className="w-full border p-3 rounded-xl text-black" />

            <button onClick={createQuiz} className="bg-blue-600 text-white px-6 py-3 rounded-xl">
              Create Quiz
            </button>

          </div>
        )}

        {/* ANALYTICS */}
        {active === "analytics" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            <h2 className="text-2xl font-bold mb-6">
              Student Analysis
            </h2>

            <table className="w-full">

              <thead>
                <tr className="bg-green-100 text-black">
                  <th className="p-3">Student</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Score</th>
                </tr>
              </thead>

              <tbody>
                {myResults.map((item)=>(
                  <tr key={item.id}>
                    <td className="p-3">{item.student}</td>
                    <td className="p-3">{item.subject}</td>
                    <td className="p-3">{item.score}%</td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

        {/* LIVE */}
        {active === "live" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            <h2 className="text-2xl font-bold mb-6">
              My Live Classes
            </h2>
            <button
  onClick={() => startLiveClass("Mathematics")}
  className="bg-green-600 text-white px-4 py-2 rounded-xl mb-4"
>
  Start Mathematics Live
</button>

            {liveStatus === "started" && (
              <div className="mb-6 p-4 rounded-xl bg-green-100 text-black">
                LIVE NOW: {liveSubject}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">

              {subjects.map((item)=>(
                <div
                  key={item}
                  className="border p-5 rounded-2xl"
                >
                  <h3 className="text-xl font-bold mb-4">
                    {item}
                  </h3>

                  <button
                    onClick={() =>
                      startLiveClass(
                        item
                      )
                    }
                    className="bg-green-500 text-white px-5 py-3 rounded-xl w-full"
                  >
                    Start / Join Class
                  </button>
                </div>
              ))}

            </div>


            {/* ATTENDANCE */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">
                Attendance
              </h2>

              {attendance.length === 0 ? (
                <p>No students joined yet.</p>
              ) : (
                attendance.map((item,index)=>(
                  <div
                    key={index}
                    className="border-b py-2"
                  >
                    {item.name} - {item.subject}
                  </div>
                ))
              )}

            </div>

          </div>
        )}

        {/* TIMETABLE */}
        {active === "timetable" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            <h2 className="text-2xl font-bold mb-6">
              Weekly Timetable
            </h2>

            <table className="w-full">

              <thead>
                <tr className="bg-green-100 text-black">
                  <th className="p-3">Day</th>
                  <th className="p-3">10AM - 12PM</th>
                  <th className="p-3">8PM - 10PM</th>
                </tr>
              </thead>

              <tbody>
                <tr><td className="p-3">Monday</td><td>Biology</td><td>Economics</td></tr>
                <tr><td className="p-3">Tuesday</td><td>Physics</td><td>Math</td></tr>
                <tr><td className="p-3">Wednesday</td><td>Chemistry</td><td>ICT</td></tr>
                <tr><td className="p-3">Thursday</td><td>Geography</td><td>History</td></tr>
                <tr><td className="p-3">Friday</td><td>Agriculture</td><td>Divinity</td></tr>
                <tr><td className="p-3">Saturday</td><td>Entrepreneurship</td><td>Revision</td></tr>
              </tbody>

            </table>

          </div>
        )}

        {/* PROFILE */}
        {active === "profile" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            {photo && (
              <img
                src={photo}
                alt=""
                className="w-28 h-28 rounded-full object-cover mb-4"
              />
            )}

            <input type="file" onChange={uploadPhoto} className="mb-4" />

            <p><strong>Name:</strong> {teacherName}</p>
            <p><strong>Email:</strong> {teacherEmail}</p>
            <p><strong>Subjects:</strong> {subjects.join(", ")}</p>

          </div>
        )}

        {/* SETTINGS */}
        {active === "settings" && (
          <div className={`${card} p-8 rounded-2xl shadow space-y-4`}>

            <button onClick={()=>setDarkMode(!darkMode)} className="bg-blue-600 text-white px-6 py-3 rounded-xl">
              Toggle {darkMode ? "Light" : "Dark"} Mode
            </button>

            <button className="bg-green-500 text-white px-6 py-3 rounded-xl">
              Change Password
            </button>

          </div>
        )}

        {/* ABOUT */}
        {active === "about" && (
          <div className={`${card} p-8 rounded-2xl shadow leading-8`}>

            <h2 className="text-3xl font-bold mb-5 text-green-600">
              About Maximo Scholars Uganda
            </h2>

            <p>
              Welcome to Maximo Scholars Uganda – your premier online learning hub designed to help students achieve academic excellence.
            </p>

          </div>
        )}

        {/* SUPPORT */}
        {active === "support" && (
          <div className={`${card} p-8 rounded-2xl shadow`}>

            <button
              onClick={() =>
                window.open(
                  "https://wa.me/256709634560",
                  "_blank"
                )
              }
              className="bg-green-500 text-white px-6 py-3 rounded-xl"
            >
              Contact Support
            </button>

          </div>
        )}

      </div>

    </div>
  );
}