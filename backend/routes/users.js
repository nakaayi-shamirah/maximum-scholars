const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

const User = require("../models/user");
const nodemailer = require("nodemailer");

/* ==================================
   EMAIL CONFIG (ENV READY)
================================== */
const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:
        process.env.EMAIL_USER,
      pass:
        process.env.EMAIL_PASS
    }
  });

/* ==================================
   GET ALL USERS
================================== */
router.get("/", async (req, res) => {
  try {
    const users =
      await User.findAll({
        order: [
          ["id", "DESC"]
        ]
      });

    res.json(users);

  } catch (error) {
    console.error(
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch users"
    });
  }
});

/* ==================================
   GET ONE USER
================================== */
router.get("/:id", async (req, res) => {
  try {
    const user =
      await User.findByPk(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found"
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch user"
    });
  }
});

/* ==================================
   APPROVE PAYMENT
================================== */
router.put(
  "/approve/:id",
  async (req, res) => {
    try {
      const user =
        await User.findByPk(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found"
        });
      }

      const today =
        new Date();

      const expiresAt =
        new Date(
          "2026-06-01T23:59:59"
        );

      user.subscription =
        {
          ...user.subscription,
          status:
            "approved",
          approvedAt:
            today,
          expiresAt
        };

      await user.save();

      /* EMAIL */
      if (
        user.email
      ) {
        await transporter.sendMail({
          from:
            process.env.EMAIL_USER,
          to:
            user.email,
          subject:
            "Payment Approved - Maximo Scholars Uganda",
          html: `
            <div style="font-family:Arial;padding:20px;">
              <h2 style="color:green;">Payment Approved ✅</h2>
              <p>Hello ${user.name},</p>
              <p>Your payment has been approved successfully.</p>
              <p>You now have full access to your dashboard.</p>
              <p><strong>Expiry:</strong> 1 June 2026</p>
            </div>
          `
        });
      }

      res.json({
        message:
          "Payment approved successfully"
      });

    } catch (error) {
      console.error(
        error
      );

      res.status(500).json({
        message:
          "Failed to approve payment"
      });
    }
  }
);

/* ==================================
   REJECT PAYMENT
================================== */
router.put(
  "/reject/:id",
  async (req, res) => {
    try {
      const user =
        await User.findByPk(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found"
        });
      }

      user.subscription =
        {
          ...user.subscription,
          status:
            "rejected",
          rejectedAt:
            new Date()
        };

      await user.save();

      if (
        user.email
      ) {
        await transporter.sendMail({
          from:
            process.env.EMAIL_USER,
          to:
            user.email,
          subject:
            "Payment Rejected - Maximo Scholars Uganda",
          html: `
            <div style="font-family:Arial;padding:20px;">
              <h2 style="color:red;">Payment Rejected ❌</h2>
              <p>Hello ${user.name},</p>
              <p>Your submitted payment was not verified.</p>
              <p>Please resubmit correctly or contact support.</p>
            </div>
          `
        });
      }

      res.json({
        message:
          "Payment rejected successfully"
      });

    } catch (error) {
      console.error(
        error
      );

      res.status(500).json({
        message:
          "Failed to reject payment"
      });
    }
  }
);

/* ==================================
   ASSIGN STUDENT SUBJECTS
================================== */
router.put(
  "/assign-subject/:id",
  async (req, res) => {
    try {
      const {
        subjects
      } = req.body;

      const user =
        await User.findByPk(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found"
        });
      }

      user.subjects =
        subjects || [];

      await user.save();

      res.json({
        message:
          "Subjects assigned"
      });

    } catch (error) {
      res.status(500).json({
        message:
          "Failed to assign subjects"
      });
    }
  }
);

/* ==================================
   ASSIGN TEACHER SUBJECTS
================================== */
router.put(
  "/assign-teacher/:id",
  async (req, res) => {
    try {
      const {
        assignedSubjects
      } = req.body;

      const user =
        await User.findByPk(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "Teacher not found"
        });
      }

      user.assignedSubjects =
        assignedSubjects ||
        [];

      await user.save();

      res.json({
        message:
          "Teacher subjects assigned"
      });

    } catch (error) {
      res.status(500).json({
        message:
          "Failed"
      });
    }
  }
);

/* ==================================
   UPDATE PROFILE
================================== */
router.put(
  "/profile/:id",
  async (req, res) => {
    try {
      const user =
        await User.findByPk(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found"
        });
      }

      const {
        name,
        email,
        phone,
        bio,
        photo
      } = req.body;

      user.name =
        name ||
        user.name;

      user.email =
        email ||
        user.email;

      user.phone =
        phone ||
        user.phone;

      user.bio =
        bio ||
        user.bio;

      user.photo =
        photo ||
        user.photo;

      await user.save();

      res.json({
        message:
          "Profile updated"
      });

    } catch (error) {
      res.status(500).json({
        message:
          "Failed to update profile"
      });
    }
  }
);

/* =========================
   GET CURRENT USER
========================= */
router.get("/me", verifyToken, async (req, res) => {
  try {
    console.log("TOKEN USER ID:", req.user.id);

    const user = await User.findOne({
      where: { id: req.user.id }
    });

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
      subjects: user.subjects || [],
      assignedSubjects: user.assignedSubjects || [],
      photo: user.photo || "",
      subscription: user.subscription || {}
    });

  } catch (error) {
    console.error("ME ERROR:", error);
    return res.status(500).json({
      message: "Failed to get user"
    });
  }
});

module.exports = router;