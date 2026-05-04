const express = require("express");
const router = express.Router();
const LiveClass = require("../models/LiveClass");

/* =========================
   START LIVE CLASS
========================= */
router.post("/start", async (req, res) => {
  try {
    const { subject, teacherId, teacherName } = req.body;

    if (!subject || !teacherId) {
      return res.status(400).json({
        message: "Missing subject or teacher"
      });
    }

    const roomId = "room_" + subject + "_" + Date.now();

    const live = await LiveClass.create({
      subject,
      teacherId,
      teacherName,
      roomId,
      status: "live",
    });

    res.json({
      message: "Live class started",
      live,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to start live class"
    });
  }
});

/* =========================
   GET ALL LIVE CLASSES
========================= */
router.get("/", async (req, res) => {
  try {
    const classes = await LiveClass.findAll({
      where: { status: "live" }
    });

    res.json(classes);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch live classes"
    });
  }
});

/* =========================
   END LIVE CLASS
========================= */
router.put("/end/:id", async (req, res) => {
  try {
    const live = await LiveClass.findByPk(req.params.id);

    if (!live) {
      return res.status(404).json({
        message: "Live class not found"
      });
    }

    live.status = "ended";
    await live.save();

    res.json({
      message: "Live class ended"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to end class"
    });
  }
});

module.exports = router;