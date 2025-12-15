import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

export default async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: `"Productr" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}
