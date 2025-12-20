import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import nodemailer from "nodemailer";

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Productr" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📩 Email sent to", to);
  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);
    throw err;
  }
};

export default sendEmail;
