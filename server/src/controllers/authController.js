import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

// ✅ helper to sanitize user (remove password, otp, etc.)
const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, otp, otpExpiry, ...rest } = user;
  return rest;
};

// ---------------- REGISTER ----------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, username } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email or username already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUsername =
      username || name.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 10000);

    await prisma.user.create({
      data: {
        name,
        username: newUsername,
        email,
        password: hashedPassword,
        otp,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      },
    });

    await sendVerificationEmail(email, otp);

    res.status(201).json({ message: "User registered. OTP sent to email." });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found." });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });

    if (new Date(user.otpExpiry) < new Date()) {
      return res.status(400).json({ message: "OTP expired." });
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: true, otp: null, otpExpiry: null },
    });

    res.status(200).json({ success: true, message: "User verified successfully." });
  } catch (err) {
    console.error("verifyOtp error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// ---------------- LOGIN ----------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    if (!user.emailVerified) {
      return res.status(401).json({ message: "Please verify your email first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user: sanitizeUser(user) });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// ---------------- GOOGLE LOGIN ----------------
export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          username: name.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 10000),
          password: null,
          emailVerified: true,
        },
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Google login successful", user: sanitizeUser(user) });
  } catch (err) {
    console.error("googleLogin error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// ---------------- GET LOGGED IN USER ----------------
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// ---------------- LOGOUT ----------------
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    console.error("logoutUser error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};
