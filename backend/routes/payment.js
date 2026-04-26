const express = require("express");
const router = express.Router();

const User = require("../models/user");
const nodemailer = require("nodemailer");

/* =====================================
   EMAIL CONFIG
===================================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* =====================================
   PAYMENT REQUEST
===================================== */
router.post("/request", async (req, res) => {
  try {
    const {
      userId,
      email,
      plan,
      amount,
      subjects,
      method,
      phone,
      reference
    } = req.body;

    /* =========================
       VALIDATION
    ========================= */
    if (
      !userId ||
      !email ||
      !plan ||
      !amount ||
      !subjects ||
      !method ||
      !phone ||
      !reference
    ) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    /* =========================
       FIND USER
    ========================= */
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    /* =========================
       CHECK EXISTING REQUEST
    ========================= */
    const sub =
      typeof user.subscription === "string"
        ? JSON.parse(user.subscription)
        : user.subscription || {};

    if (sub.status === "pending") {
      return res.status(400).json({
        message: "You already have a pending payment request."
      });
    }

    /* =========================
       SAVE SUBJECTS + PAYMENT
    ========================= */
    user.subjects = Array.isArray(subjects)
      ? subjects
      : [];

    user.subscription = {
      status: "pending",
      plan,
      amount,
      method,
      phone,
      reference,
      submittedAt: new Date(),
      approvedAt: null,
      expiresAt: null
    };

    await user.save();

    /* =========================
       SEND EMAIL
    ========================= */
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject:
          "Payment Received - Maximum Scholars Uganda",
        html: `
          <div style="font-family:Arial;padding:20px;">
            <h2 style="color:#16a34a;">
              Payment Request Received ✅
            </h2>

            <p>Hello ${user.name},</p>

            <p>
              We have received your payment request successfully.
            </p>

            <p>
              <strong>Plan:</strong> ${plan}<br/>
              <strong>Amount:</strong> UGX ${Number(amount).toLocaleString()}<br/>
              <strong>Method:</strong> ${method}<br/>
              <strong>Phone:</strong> ${phone}<br/>
              <strong>Reference:</strong> ${reference}
            </p>

            <p>
              Our admin team is reviewing your request.
              You will be notified once approved.
            </p>

            <p>
              Thank you for choosing
              <strong>Maximum Scholars Uganda</strong>.
            </p>
          </div>
        `
      });
    } catch (mailError) {
      console.log("Email failed:", mailError.message);
    }

    /* =========================
       SUCCESS
    ========================= */
    return res.status(200).json({
      message: "Payment submitted successfully"
    });

  } catch (error) {
    console.error("Payment Error:", error);

    return res.status(500).json({
      message: "Payment request failed"
    });
  }
});

module.exports = router;