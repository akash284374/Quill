// src/services/authServices.js
import api from "./api";

// ✅ Verify OTP
export const verifyOtp = async (email, otp) => {
  try {
    const res = await api.post(
      "/auth/verify-otp",
      { email, otp },
      { withCredentials: true }
    );
    return {
      success: true,
      message: res?.data?.message || "OTP verified",
      user: res?.data?.user || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "OTP verification failed",
      user: null,
    };
  }
};

// ✅ Register
export const register = async (userData) => {
  try {
    const res = await api.post("/auth/register", userData, { withCredentials: true });
    return {
      success: true,
      message: res?.data?.message || "Signup successful",
      user: res?.data?.user || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Signup failed",
      user: null,
    };
  }
};

// ✅ Login
export const login = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials, { withCredentials: true });
    return {
      success: true,
      message: res?.data?.message || "Login successful",
      user: res?.data?.user || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Login failed",
      user: null,
    };
  }
};

// ✅ Check current session
export const checkAuth = async () => {
  try {
    const res = await api.get("/auth/me", { withCredentials: true });
    return {
      success: true,
      user: res?.data?.user || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Not authenticated",
      user: null,
    };
  }
};

// ✅ Logout
export const logout = async () => {
  try {
    await api.post("/auth/logout", {}, { withCredentials: true });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

// Export all services
const authServices = {
  verifyOtp,
  register,
  login,
  checkAuth,
  logout,
};

export default authServices;
