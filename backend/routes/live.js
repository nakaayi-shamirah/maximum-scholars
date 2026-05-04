const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const LiveClass = require("../models/LiveClass");

const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

router.post("/start", verifyToken, async (req, res) => {
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
    if (!classes || classes.length === 0) {
      return res.json([]);
    }
    res.json(classes);
  } catch (error) {
    console.error("Live fetch error:", error);
    res.status(500).json({ message: "Failed to fetch live classes" });
  }
});

router.put("/end/:id", verifyToken, async (req, res) => {
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
