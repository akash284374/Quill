// src/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

// ---------------- HELPER ----------------
const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, otp, otpExpiry, ...rest } = user;
  return rest;
};

// ---------------- REGISTER ----------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newUsername =
      username || `${name.toLowerCase().replace(/\s+/g, "")}${Math.floor(Math.random() * 10000)}`;

    await prisma.user.create({
      data: {
        name,
        username: newUsername,
        email,
        password: hashedPassword,
        otp,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendVerificationEmail(email, otp);
    return res.status(201).json({ message: "User registered. OTP sent to email.", success: true });
  } catch (err) {
    console.error("registerUser error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });
    if (user.otpExpiry && new Date(user.otpExpiry) < new Date())
      return res.status(400).json({ message: "OTP expired." });

    await prisma.user.update({
      where: { email },
      data: { emailVerified: true, otp: null, otpExpiry: null },
    });

    return res.status(200).json({ success: true, message: "User verified successfully." });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------------- LOGIN ----------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });
    if (!user.emailVerified) return res.status(403).json({ message: "Please verify your email first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login successful", user: sanitizeUser(user) });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------------- GOOGLE LOGIN ----------------
export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          username: `${name.toLowerCase().replace(/\s+/g, "")}${Math.floor(Math.random() * 10000)}`,
          password: null,
          emailVerified: true,
        },
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Google login successful", user: sanitizeUser(user) });
  } catch (err) {
    console.error("googleLogin error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------------- GET LOGGED IN USER ----------------
export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error("getMe error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------------- UPDATE PROFILE IMAGE ----------------
export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Profile image is required." });

    const profileImageUrl = await uploadOnCloudinary(req.file.path);
    if (!profileImageUrl) return res.status(500).json({ message: "Failed to upload image to Cloudinary" });

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { profileImage: profileImageUrl },
    });

    return res.status(200).json({ message: "Profile image updated successfully", user: sanitizeUser(user) });
  } catch (err) {
    console.error("updateProfileImage error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------------- UPDATE COVER IMAGE ----------------
export const updateCoverImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Cover image is required." });

    const coverImageUrl = await uploadOnCloudinary(req.file.path);
    if (!coverImageUrl) return res.status(500).json({ message: "Failed to upload image to Cloudinary" });

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { coverImage: coverImageUrl },
    });

    return res.status(200).json({ message: "Cover image updated successfully", user: sanitizeUser(user) });
  } catch (err) {
    console.error("updateCoverImage error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------------- UPDATE BIO ----------------
export const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    if (!bio) return res.status(400).json({ message: "Bio is required." });

    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: { bio },
    });

    return res.status(200).json({ message: "Bio updated successfully", user: sanitizeUser(user) });
  } catch (err) {
    console.error("updateBio error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------------- LOGOUT ----------------
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    return res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    console.error("logoutUser error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
