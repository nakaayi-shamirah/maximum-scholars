const express = require("express");
const router = express.Router();
const LiveClass = require("../models/LiveClass");

router.post("/start", async (req, res) => {
  try {
    const { subject, teacherId, teacherName } = req.body;
    const roomId = "room_" + subject.replace(/\s+/g, "_") + "_" + Date.now();
    const live = await LiveClass.create({
      subject,
      teacherId,
      teacherName,
      roomId,
      status: "live",
    });
    res.json(live);
  } catch (error) {
    console.log("LIVE START ERROR FULL:", error.message);
    console.log("STACK:", error.stack);
    res.status(500).json({ message: "Failed to start live class" });
  }
});

router.get("/", async (req, res) => {
  try {
    const includeAll = req.query.all === "true";
    const where = includeAll ? {} : { status: "live" };
    const classes = await LiveClass.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch live classes" });
  }
});

router.put("/end/:id", async (req, res) => {
  try {
    const live = await LiveClass.findByPk(req.params.id);
    if (!live) {
      return res.status(404).json({ message: "Live class not found" });
    }
    live.status = "ended";
    await live.save();
    res.json({ message: "Live class ended" });
  } catch (error) {
    res.status(500).json({ message: "Failed to end class" });
  }
});

module.exports = router;
