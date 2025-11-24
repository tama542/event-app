// server/email.js
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/send-invite", async (req, res) => {
  const { to, subject, body } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use SMTP config
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: body,
    });

    res.json({ success: true, message: "Invite sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send invite." });
  }
});

export default router;
