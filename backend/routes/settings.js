const express = require("express");
const jwt = require("jsonwebtoken");
const AppSetting = require("../models/AppSetting");

const router = express.Router();

const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token provided" });
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    let settings = await AppSetting.findOne();
    if (!settings) {
      settings = await AppSetting.create({});
    }
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load settings" });
  }
});

router.put("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const {
      siteStatus,
      defaultCurrency,
      supportEmail,
      defaultPaymentPlan,
      autoApprovePayments,
      announcements,
    } = req.body;

    let settings = await AppSetting.findOne();
    if (!settings) {
      settings = await AppSetting.create({
        siteStatus,
        defaultCurrency,
        supportEmail,
        defaultPaymentPlan,
        autoApprovePayments,
        announcements,
      });
    } else {
      await settings.update({
        siteStatus,
        defaultCurrency,
        supportEmail,
        defaultPaymentPlan,
        autoApprovePayments,
        announcements,
      });
    }

    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save settings" });
  }
});

module.exports = router;
