// email.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


// Create a reusable transporter object using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST, // e.g., "smtp.gmail.com" or your SMTP server
  port: Number(process.env.MAILTRAP_SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // your email username
    pass: process.env.SMTP_PASS, // your email password or app-specific password
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Website" <${process.env.SMTP_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });

  //  console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};


