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

/* =========================
   CREATE DEFAULT ADMIN
========================= */
async function createAdmin() {
  try {
    const existing =
      await User.findOne({
        where: {
          email:
            "admin@maximumscholars.com"
        }
      });

    if (!existing) {
      const hashed =
        await bcrypt.hash(
          "Admin12345",
          10
        );

      await User.create({
        name:
          "System Admin",
        email:
          "admin@maximumscholars.com",
        password:
          hashed,
        role:
          "admin",
        isActive:
          true
      });

      console.log(
        "✅ Default admin created"
      );
    } else {
      console.log(
        "✅ Admin already exists"
      );
    }

  } catch (error) {
    console.log(
      "Admin setup error:",
      error
    );
  }
}

/* =========================
   START SERVER
========================= */
async function startServer() {
  try {
    await sequelize.sync({
      force: true
    });

    console.log(
      "✅ Database connected"
    );
     

    await createAdmin();

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