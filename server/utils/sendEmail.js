import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import nodemailer from "nodemailer";

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    subject,
    text,
  });
};

export default sendEmail;
