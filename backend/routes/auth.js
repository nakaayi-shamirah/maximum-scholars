const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET =
  process.env.JWT_SECRET ||
  "secret123";

/* =========================
   VERIFY TOKEN
========================= */
const verifyToken = (
  req,
  res,
  next
) => {
  try {
    const header =
      req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        message:
          "No token provided"
      });
    }

    const token =
      header.split(" ")[1];

    const decoded =
      jwt.verify(
        token,
        SECRET
      );

    req.user =
      decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message:
        "Invalid token"
    });
  }
};

/* =========================
   REGISTER STUDENT
========================= */
router.post(
  "/register",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        school,
        referral
      } = req.body;

      if (
        !name ||
        !email ||
        !password ||
        !school
      ) {
        return res.status(400).json({
          message:
            "Fill all required fields"
        });
      }

      const existingUser =
        await User.findOne({
          where: {
            email
          }
        });

      if (
        existingUser
      ) {
        return res.status(400).json({
          message:
            "Email already registered"
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      await User.create({
        name,
        email,
        password:
          hashedPassword,
        role:
          "student",
        school:
          school || "",
        referral:
          referral || "",
        subjects: [],
        assignedSubjects:
          [],
        subscription: {
          status:
            "inactive",
          approvedAt:
            null,
          expiresAt:
            null
        }
      });

      return res.status(201).json({
        message:
          "Account created successfully"
      });

    } catch (error) {
      console.error(
        error
      );

      return res.status(500).json({
        message:
          "Registration failed"
      });
    }
  }
);

/* =========================
   LOGIN
========================= */
router.post(
  "/login",
  async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body;

      const user =
        await User.findOne({
          where: {
            email
          }
        });

      if (!user) {
        return res.status(400).json({
          message:
            "User not found"
        });
      }

      const valid =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!valid) {
        return res.status(400).json({
          message:
            "Wrong password"
        });
      }

      let sub =
        user.subscription ||
        {};

      if (
        sub.expiresAt
      ) {
        const now =
          new Date();

        const expiry =
          new Date(
            sub.expiresAt
          );

        if (
          now > expiry
        ) {
          sub.status =
            "expired";

          await user.update({
            subscription:
              sub
          });
        }
      }

      const token =
        jwt.sign(
          {
            id:
              user.id,
            role:
              user.role
          },
          SECRET,
          {
            expiresIn:
              "7d"
          }
        );

      return res.json({
        token,
        user: {
          id:
            user.id,
          name:
            user.name,
          email:
            user.email,
          role:
            user.role,
          school:
            user.school,
          referral:
            user.referral,
          subjects:
            user.subjects ||
            [],
          assignedSubjects:
            user.assignedSubjects ||
            [],
          photo:
            user.photo ||
            "",
          averageScore:
            user.averageScore ||
            0,
          subscription:
            user.subscription
        }
      });

    } catch (error) {
      console.error(
        error
      );

      return res.status(500).json({
        message:
          "Login failed"
      });
    }
  }
);

/* =========================
   CREATE TEACHER
========================= */
router.post(
  "/create-teacher",
  verifyToken,
  async (req, res) => {
    try {
      if (
        req.user.role !==
        "admin"
      ) {
        return res.status(403).json({
          message:
            "Only admin allowed"
        });
      }

      const {
        name,
        email,
        password,
        assignedSubjects
      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Fill all fields"
        });
      }

      const existing =
        await User.findOne({
          where: {
            email
          }
        });

      if (
        existing
      ) {
        return res.status(400).json({
          message:
            "Email already exists"
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      await User.create({
        name,
        email,
        password:
          hashedPassword,
        role:
          "teacher",
        assignedSubjects:
          assignedSubjects ||
          [],
        subjects:
          assignedSubjects ||
          [],
        subscription: {
          status:
            "active"
        }
      });

      return res.status(201).json({
        message:
          "Teacher created successfully"
      });

    } catch (error) {
      console.error(
        error
      );

      return res.status(500).json({
        message:
          "Failed to create teacher"
      });
    }
  }
);

/* =========================
   GET CURRENT USER (/me)
========================= */
router.get("/me", verifyToken, async (req, res) => {
  try {
    console.log("TOKEN DATA:", req.user);

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      school: user.school,
      referral: user.referral,
      subjects: user.subjects || [],
      assignedSubjects: user.assignedSubjects || [],
      photo: user.photo || "",
      averageScore: user.averageScore || 0,
      subscription: user.subscription
    });

  } catch (error) {
    console.error("ME ERROR:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;