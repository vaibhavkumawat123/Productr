import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST be on TOP

import nodemailer from "nodemailer";

console.log("📧 MAIL CONFIG CHECK:", {
  user: process.env.EMAIL_USER ? "FOUND" : "MISSING",
  pass: process.env.EMAIL_PASS ? "FOUND" : "MISSING",
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ Gmail error:", err.message);
  } else {
    console.log("✅ Gmail ready");
  }
});

const sendEmail = async (to, subject, text) => {
  return transporter.sendMail({
    from: `"Productr" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

export default sendEmail;