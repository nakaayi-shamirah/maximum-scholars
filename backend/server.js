const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

const sequelize =
  require("./utils/database");

const User =
  require("./models/user");

require("./models/Material");

require("./models/LiveClass");

require("./models/AppSetting");

/* =========================
   CONFIG
========================= */
const PORT =
  process.env.PORT ||
  5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "*";

/* =========================
   MIDDLEWARE
========================= */
app.use(
  cors({
    origin:
      FRONTEND_URL ===
      "*"
        ? true
        : FRONTEND_URL,
    credentials: true
  })
);

app.use(
  express.json({
    limit: "20mb"
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);

/* =========================
   HEALTH CHECK
========================= */
app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,
      message:
        "Maximo Scholars Backend Running ✅"
    });
  }
);

/* =========================
   ROUTES
========================= */
app.use(
  "/api/auth",
  require("./routes/auth")
);

app.use(
  "/api/users",
  require("./routes/users")
);

app.use(
  "/api/payment",
  require("./routes/payment")
);

app.use(
  "/api/materials",
  require("./routes/materials")
);
app.use(
  "/api/live",
  require("./routes/live")
);
app.use(
  "/api/settings",
  require("./routes/settings")
);

/* =========================
   CREATE DEFAULT ADMIN
========================= */
async function createAdmin() {
  try {
    const existing = await User.findOne({
      where: {
        email: "admin@maximumscholars.com"
      }
    });

    if (!existing) {
      const hashed = await bcrypt.hash("Admin12345", 10);

      await User.create({
        name: "System Admin",
        email: "admin@maximumscholars.com",
        password: hashed,
        role: "admin",
        isActive: true
      });

      console.log("✅ Default admin created");
    } else {
      console.log("✅ Admin already exists");
    }
  } catch (error) {
    console.log("Admin setup error:", error);
  }
}

async function createSampleData() {
  try {
    const teacherCount = await User.count({ where: { role: "teacher" } });
    const studentCount = await User.count({ where: { role: "student" } });

    const sampleStudents = [
      {
        name: "Alice Nansubuga",
        email: "student1@maximumscholars.com",
        password: "Student123",
        role: "student",
        subjects: ["Mathematics", "Physics"],
        subscription: {
          status: "approved",
          approvedAt: new Date(),
          expiresAt: new Date("2026-12-31T23:59:59"),
          amount: 70000,
          plan: "B"
        }
      },
      {
        name: "Benjamin Atwiine",
        email: "student2@maximumscholars.com",
        password: "Student123",
        role: "student",
        subjects: ["Biology", "Chemistry"],
        subscription: {
          status: "pending",
          amount: 40000,
          plan: "C"
        }
      }
    ];

    const sampleTeachers = [
      {
        name: "Mr. Kato",
        email: "teacher1@maximumscholars.com",
        password: "Teacher123",
        role: "teacher",
        assignedSubjects: ["Mathematics", "Physics"],
        subjects: ["Mathematics", "Physics"],
        subscription: {
          status: "active",
          approvedAt: new Date(),
          expiresAt: new Date("2026-12-31T23:59:59")
        }
      },
      {
        name: "Ms. Achieng",
        email: "teacher2@maximumscholars.com",
        password: "Teacher123",
        role: "teacher",
        assignedSubjects: ["Biology", "Chemistry"],
        subjects: ["Biology", "Chemistry"],
        subscription: {
          status: "active",
          approvedAt: new Date(),
          expiresAt: new Date("2026-12-31T23:59:59")
        }
      }
    ];

    if (studentCount === 0) {
      for (const account of sampleStudents) {
        const existing = await User.findOne({ where: { email: account.email } });
        if (!existing) {
          const hashed = await bcrypt.hash(account.password, 10);
          await User.create({
            name: account.name,
            email: account.email,
            password: hashed,
            role: account.role,
            subjects: account.subjects || [],
            assignedSubjects: account.assignedSubjects || [],
            subscription: account.subscription || {
              status: "inactive",
              approvedAt: null,
              expiresAt: null,
              amount: 0,
              plan: ""
            },
            isActive: true
          });
        }
      }
    }

    if (teacherCount === 0) {
      for (const account of sampleTeachers) {
        const existing = await User.findOne({ where: { email: account.email } });
        if (!existing) {
          const hashed = await bcrypt.hash(account.password, 10);
          await User.create({
            name: account.name,
            email: account.email,
            password: hashed,
            role: account.role,
            subjects: account.subjects || [],
            assignedSubjects: account.assignedSubjects || [],
            subscription: account.subscription || {
              status: "inactive",
              approvedAt: null,
              expiresAt: null,
              amount: 0,
              plan: ""
            },
            isActive: true
          });
        }
      }
    }

    const materialCount = await Material.count();
    if (materialCount === 0) {
      await Material.bulkCreate([
        {
          title: "Algebra Basics",
          subject: "Mathematics",
          link: "https://example.com/algebra",
          teacher: "Mr. Kato"
        },
        {
          title: "Physics Mechanics",
          subject: "Physics",
          link: "https://example.com/physics",
          teacher: "Mr. Kato"
        },
        {
          title: "Cell Biology Notes",
          subject: "Biology",
          link: "https://example.com/biology",
          teacher: "Ms. Achieng"
        }
      ]);
    }

    const liveCount = await LiveClass.count();
    if (liveCount === 0) {
      const sampleTeacher = await User.findOne({ where: { role: "teacher" } });
      await LiveClass.create({
        subject: "Mathematics",
        teacherId: sampleTeacher ? sampleTeacher.id : null,
        teacherName: sampleTeacher ? sampleTeacher.name : "Maximo Tutor",
        roomId: `room_Mathematics_${Date.now()}`,
        status: "live"
      });
    }

    console.log("✅ Sample students, teachers, materials and live class created");
  } catch (error) {
    console.error("Sample data setup failed:", error);
  }
}

/* =========================
   START SERVER
========================= */
async function startServer() {
  try {
    await sequelize.sync({
      alter: true
    });

    console.log("✅ Database connected");

    await createAdmin();
    await createSampleData();

    app.listen(
      PORT,
      () => {
        console.log(
          `🚀 Server running on port ${PORT}`
        );
      }
    );

  } catch (error) {
    console.error(
      "❌ Failed to start:",
      error
    );
  }
} 

startServer();