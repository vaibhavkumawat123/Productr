import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Productr" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ OTP Email sent to:", to);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

export default sendEmail;
