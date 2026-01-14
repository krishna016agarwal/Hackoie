import crypto from "crypto";
import PendingUser from "../models/pendingUser.js";
import { sendEmail } from "../utils/sendEmail.js.js"
import bcrypt from "bcrypt";
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const startSignup = async ({ name, email, password }) => {

  let pending = await PendingUser.findOne({ email });

  // 🔁 Reset daily limit
  const today = new Date().toDateString();
  if (!pending) {
    const otp = generateOTP();

    pending = await PendingUser.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      otpHash: crypto.createHash("sha256").update(otp).digest("hex"),
      otpExpiresAt: Date.now() + 5 * 60 * 1000,
      otpSendCount: 1,
      otpSendDate: new Date(),
      otpVerifyAttempts: 0
    });

    await sendEmail({
      to: email,
      subject: "Email Verification – OTP Code",
      html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f4f6f8;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 500px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 1px solid #eaeaea;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            color: #333333;
          }
          .content p {
            color: #555555;
            font-size: 14px;
            line-height: 1.6;
          }
          .otp {
            margin: 25px 0;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 4px;
            color: #2f80ed;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999999;
            text-align: center;
            border-top: 1px solid #eaeaea;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>

          <div class="content">
            <p>Hello,</p>
            <p>
              Thank you for signing up. Please use the following One-Time
              Password (OTP) to verify your email address.
            </p>

            <div class="otp">${otp}</div>

            <p>
              This OTP is valid for a limited time. If you did not request this,
              please ignore this email.
            </p>

            <p>
              Best regards,<br />
              <strong>Hackoie Team</strong>
            </p>
          </div>

          <div class="footer">
            <p>
              © ${new Date().getFullYear()} Hackoie. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
    });


  } else {
    if (pending.otpSendDate?.toDateString() !== today) {
      pending.otpSendCount = 0;
    }

    // 🚫 Daily OTP limit
    if (pending.otpSendCount >= 3) {
      throw new Error("OTP request limit reached for today")

    }

    const otp = generateOTP();

    pending.name = name;
    pending.passwordHash = await bcrypt.hash(password, 10);
    pending.otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    pending. otpExpiresAt = Date.now() + 5 * 60 * 1000;
    pending.otpSendCount += 1;
    pending.otpSendDate = new Date();
    pending.otpVerifyAttempts = 0;

    await pending.save();

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `<h2>Your OTP is ${otp}</h2>`
    });
  }


};

export const verifySignupOTP = async (email, otp) => {

  const record = await PendingUser.findOne({ email });
  if (!record) throw new Error("Signup session expired");

  if (record.otpExpiresAt < Date.now()) {
    await PendingUser.deleteOne({ email });
    throw new Error("OTP expired");
  }

  if (record.otpVerifyAttempts >= 5) {
    // await PendingUser.deleteOne({ email });

    throw new Error("Too many invalid attempts. Please register again.")

  }
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  if (otpHash !== record.otpHash) {
    record.otpVerifyAttempts += 1;
    await record.save();
    throw new Error(`Invalid OTP. Attempts left: ${5 - record.otpVerifyAttempts}`);
  }

  return record;


};
