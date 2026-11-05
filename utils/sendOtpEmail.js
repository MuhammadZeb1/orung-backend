import nodemailer from "nodemailer";

const createTransporter = () => {
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const host =
    process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(
    process.env.SMTP_PORT || process.env.EMAIL_PORT || 587
  );
  const secure =
    String(
      process.env.SMTP_SECURE || process.env.EMAIL_SECURE || "false"
    ).toLowerCase() === "true";

  if (!emailUser || !emailPass) {
    console.error("❌ SMTP credentials are missing.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

export const sendOtpEmail = async ({ email, otp, name }) => {
  try {
    console.log("==================================");
    console.log("📧 Starting OTP Email Service");
    console.log("To:", email);

    const transporter = createTransporter();

    if (!transporter) {
      throw new Error("SMTP transporter could not be created.");
    }

    // Verify SMTP connection
    await transporter.verify();
    console.log("✅ SMTP Connection Verified");

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        process.env.SMTP_USER ||
        process.env.EMAIL_USER,
      to: email,
      subject: "Verify your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
          <h2>Hello ${name || "there"}, 👋</h2>

          <p>Thank you for registering.</p>

          <p>Please use the following OTP to verify your email address:</p>

          <div style="
            display:inline-block;
            padding:15px 30px;
            background:#4F46E5;
            color:#fff;
            font-size:30px;
            font-weight:bold;
            border-radius:8px;
            letter-spacing:5px;
            margin:20px 0;
          ">
            ${otp}
          </div>

          <p>This OTP is valid for <strong>10 minutes</strong>.</p>

          <p>If you did not request this email, please ignore it.</p>

          <hr>

          <p style="color:#777;font-size:12px;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ OTP Email Sent Successfully");
    console.log("📨 Message ID:", info.messageId);
    console.log("==================================");

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("==================================");
    console.error("❌ Failed to Send OTP Email");
    console.error(error);
    console.error("==================================");

    throw error;
  }
};