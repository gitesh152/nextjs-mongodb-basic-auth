import User from "../models/User";
import { createHashedToken, createRawToken } from "./credential.helpers";
import nodemailer from "nodemailer";

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    const token = createRawToken();

    const hashedToken = createHashedToken(token);

    const isVerify = emailType === "VERIFY";

    await User.findByIdAndUpdate(
      userId,
      isVerify
        ? {
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 60 * 60 * 1000,
          }
        : {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 60 * 60 * 1000,
          },
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT! || "587"),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const path = isVerify ? "verifyemail" : "resetpassword";
    const actionText = isVerify ? "verify your email" : "reset your password";

    const url = `${process.env.DOMAIN}/${path}?token=${token}`;

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: isVerify ? "Verify your email." : "Reset your password.",
      html: `
        <p>
          Click <a href="${url}">here</a> to ${actionText}.
        </p>
        <p>
          Or copy and paste this link:
          <br />
          ${url}
        </p>
      `,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
