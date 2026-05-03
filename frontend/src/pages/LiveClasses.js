import {
  useEffect,
  useRef,
  useState
} from "react";
import { useNavigate } from "react-router-dom";

export default function LiveClasses() {
  const navigate =
    useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    ) || {};

  const role =
    localStorage.getItem(
      "role"
    ) || "student";

  const mySubjects =
    JSON.parse(
      localStorage.getItem(
        "subjects"
      )
    ) || [];

  const videoRef =
    useRef(null);

  const [cameraOn, setCameraOn] =
    useState(false);

  const [joined, setJoined] =
    useState(false);

  const [micOn, setMicOn] =
    useState(true);

  const [text, setText] =
    useState("");

  const [messages, setMessages] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "liveMessages"
        )
      ) || []
    );

  const [liveStatus, setLiveStatus] =
    useState(
      localStorage.getItem(
        "liveClassStatus"
      ) || "ended"
    );

  const [teacher, setTeacher] =
    useState(
      localStorage.getItem(
        "liveTeacher"
      ) || ""
    );

  const [subject, setSubject] =
    useState(
      localStorage.getItem(
        "liveSubject"
      ) || ""
    );

  useEffect(() => {
    const timer =
      setInterval(() => {
        setLiveStatus(
          localStorage.getItem(
            "liveClassStatus"
          ) || "ended"
        );

        setTeacher(
          localStorage.getItem(
            "liveTeacher"
          ) || ""
        );

        setSubject(
          localStorage.getItem(
            "liveSubject"
          ) || ""
        );

        setMessages(
          JSON.parse(
            localStorage.getItem(
              "liveMessages"
            )
          ) || []
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  const openCamera =
    async () => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: true,
              audio: true
            }
          );

        if (
          videoRef.current
        ) {
          videoRef.current.srcObject =
            stream;
        }

        setCameraOn(true);

      } catch {
        alert(
          "Camera access denied."
        );
      }
    };

  const closeCamera =
    () => {
      const stream =
        videoRef.current
          ?.srcObject;

      if (stream) {
        stream
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );
      }

      setCameraOn(false);
    };

  const startClass =
    async () => {
      localStorage.setItem(
        "liveClassStatus",
        "started"
      );

      localStorage.setItem(
        "liveTeacher",
        user.name
      );

      localStorage.setItem(
        "liveSubject",
        subject || "General"
      );

      setLiveStatus(
        "started"
      );

      await openCamera();

      setJoined(true);
    };

  const joinClass =
    async () => {
      if (
        liveStatus !==
        "started"
      ) {
        alert(
          "No live class is active."
        );
        return;
      }

      if (
        role ===
          "student" &&
        subject &&
        !mySubjects.includes(
          subject
        )
      ) {
        alert(
          `You are not enrolled in ${subject}`
        );
        return;
      }

      await openCamera();

      setJoined(true);
    };

  const endClass =
    () => {
      localStorage.setItem(
        "liveClassStatus",
        "ended"
      );

      localStorage.removeItem(
        "liveTeacher"
      );

      localStorage.removeItem(
        "liveSubject"
      );

      localStorage.removeItem(
        "liveMessages"
      );

      closeCamera();

      setJoined(false);

      setLiveStatus(
        "ended"
      );
    };

  const sendMessage =
    () => {
      if (!text.trim())
        return;

      const newMsg = {
        id:
          Date.now(),
        sender:
          user.name,
        role,
        text
      };

      const updated = [
        ...messages,
        newMsg
      ];

      localStorage.setItem(
        "liveMessages",
        JSON.stringify(
          updated
        )
      );

      setMessages(
        updated
      );

      setText("");
    };

  const leaveClass =
    () => {
      closeCamera();
      setJoined(false);

      if (
        role ===
        "teacher"
      ) {
        navigate(
          "/teacher"
        );
      } else if (
        role ===
        "admin"
      ) {
        navigate(
          "/admin"
        );
      } else {
        navigate(
          "/dashboard"
        );
      }
    };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-5">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-slate-900 rounded-3xl p-6 mb-6 flex flex-wrap justify-between gap-4 items-center">

          <div>
            <h1 className="text-3xl font-bold">
              Maximo Scholars Live Classroom
            </h1>

            <p className="mt-2 text-gray-400">
              {liveStatus ===
              "started"
                ? "🟢 LIVE NOW"
                : "🔴 OFFLINE"}
            </p>

            <p className="text-gray-400">
              Teacher:
              {" "}
              {teacher ||
                "None"}
            </p>

            <p className="text-gray-400">
              Subject:
              {" "}
              {subject ||
                "None"}
            </p>
          </div>

          <button
            onClick={
              leaveClass
            }
            className="bg-red-500 px-6 py-3 rounded-xl"
          >
            Exit
          </button>

        </div>

        {/* BODY */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* VIDEO AREA */}
          <div className="md:col-span-2">

            <div className="bg-black rounded-3xl h-[520px] overflow-hidden relative flex items-center justify-center">

              {cameraOn ? (
                <video
                  ref={
                    videoRef
                  }
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <p className="text-5xl mb-4">
                    🎓
                  </p>

                  <p className="text-2xl font-bold">
                    {liveStatus ===
                    "started"
                      ? "Join a live class"
                      : "Waiting for teacher"}
                  </p>

                  <p className="text-gray-500 mt-3">
                    {subject ||
                      "No active subject"}
                  </p>
                </div>
              )}

              <div className="absolute bottom-4 left-4 bg-black/60 px-4 py-2 rounded-xl text-sm">
                {user.name}
              </div>

            </div>

            {/* CONTROLS */}
            <div className="mt-5 flex flex-wrap gap-4">

              {role ===
                "student" && (
                <button
                  onClick={
                    joinClass
                  }
                  className="bg-blue-600 px-6 py-3 rounded-xl"
                >
                  Join Class
                </button>
              )}

              {role ===
                "teacher" && (
                <>
                  <button
                    onClick={
                      startClass
                    }
                    className="bg-green-500 px-6 py-3 rounded-xl"
                  >
                    Start Class
                  </button>

                  <button
                    onClick={
                      endClass
                    }
                    className="bg-red-500 px-6 py-3 rounded-xl"
                  >
                    End Class
                  </button>
                </>
              )}

              {role ===
                "admin" &&
                liveStatus ===
                  "started" && (
                  <>
                    <button
                      onClick={
                        joinClass
                      }
                      className="bg-blue-600 px-6 py-3 rounded-xl"
                    >
                      Join Live
                    </button>

                    <button
                      onClick={
                        endClass
                      }
                      className="bg-red-500 px-6 py-3 rounded-xl"
                    >
                      End Live
                    </button>
                  </>
                )}

              <button
                onClick={() =>
                  micOn
                    ? setMicOn(
                        false
                      )
                    : setMicOn(
                        true
                      )
                }
                className="bg-slate-700 px-6 py-3 rounded-xl"
              >
                {micOn
                  ? "🎤 Mic On"
                  : "🔇 Mic Off"}
              </button>

              <button
                onClick={() =>
                  cameraOn
                    ? closeCamera()
                    : openCamera()
                }
                className="bg-slate-700 px-6 py-3 rounded-xl"
              >
                {cameraOn
                  ? "📷 Camera Off"
                  : "📷 Camera On"}
              </button>

              <button
                className="bg-yellow-500 px-6 py-3 rounded-xl text-black"
              >
                ✋ Raise Hand
              </button>

            </div>

          </div>

          {/* CHAT */}
          <div className="bg-slate-900 rounded-3xl p-5 h-[590px] flex flex-col">

            <h2 className="text-2xl font-bold mb-4">
              Class Chat
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3">

              {messages.length ===
              0 ? (
                <p className="text-gray-500">
                  No messages yet
                </p>
              ) : (
                messages.map(
                  (msg) => (
                    <div
                      key={
                        msg.id
                      }
                      className="bg-slate-800 p-3 rounded-xl"
                    >
                      <strong>
                        {
                          msg.sender
                        }
                      </strong>{" "}
                      ({msg.role})
                      <p className="mt-1">
                        {
                          msg.text
                        }
                      </p>
                    </div>
                  )
                )
              )}

            </div>

            <div className="mt-4 flex gap-2">

              <input
                value={text}
                onChange={(
                  e
                ) =>
                  setText(
                    e.target
                      .value
                  )
                }
                placeholder="Type message..."
                className="flex-1 p-3 rounded-xl text-black"
              />

              <button
                onClick={
                  sendMessage
                }
                className="bg-indigo-600 px-5 rounded-xl"
              >
                Send
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}