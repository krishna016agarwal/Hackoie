import User from "../models/user.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import PendingUser from "../models/pendingUser.js";
import { startSignup, verifySignupOTP } from "../utils/otp.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({
        message: "User already exists"
      });
    }

    await startSignup({ name, email, password });

    res.json({
      message: "OTP sent to email"
    });
  } catch (error) {
    res.json({
      message: error.message
    });
  }
};


/**
 * STEP 2: Verify OTP & Create Account
 */
export const verifyOtpAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pendingUser = await verifySignupOTP(email, otp);

    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.passwordHash,
      isVerified: true
    });

    await PendingUser.deleteOne({ email });

    res.status(201).json({
      token: generateToken(user._id),
      user
    });
  } catch (error) {
    res.json({
      message: error.message
    });
  }
};



export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.json({ message: "User doesn't exist" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user._id),
    user
  });
};

export const logout = async (req, res) => {
  try {
    res.json({
      message: "Logged out successfully"
    });
  } catch (error) {
    res.json({
      message: "Logout failed"
    });
  }
};
