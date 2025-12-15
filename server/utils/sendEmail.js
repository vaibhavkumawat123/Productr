import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", 
      to,
      subject,
      text,
    });

    console.log("✅ Email sent:", response.id);
  } catch (error) {
    console.error("❌ Resend email error:", error);
    throw error;
  }
};

export default sendEmail;
