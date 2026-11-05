import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendTestEmail() {
  try {
    // Verify SMTP connection
    await transporter.verify();
    console.log("✅ SMTP Connected");

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "zebafridiuu@gmail.com", // Replace with your email for testing
      subject: "Test Email from Node.js",
      html: `
        <h2>🎉 Email Sent Successfully!</h2>
        <p>Your Nodemailer configuration is working correctly.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("✅ Email Sent!");
    console.log("Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending email:");
    console.error(err);
  }
}

// Call the function
sendTestEmail();