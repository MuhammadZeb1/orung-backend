import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

const createOtp = () => crypto.randomInt(100000, 999999).toString();

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = createOtp();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationOtp: otp,
      verificationOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail({ email, otp, name });

    res.status(201).json({
      message: "Account created. Please verify your email with the OTP sent to your inbox.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    if (!user.verificationOtp || user.verificationOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date(user.verificationOtpExpiresAt) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    console.log("user:",User)
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
