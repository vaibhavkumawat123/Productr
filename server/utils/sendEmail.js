import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail(to, subject, text) {
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("❌ Resend email error:", error);
    throw error;
  }
}
