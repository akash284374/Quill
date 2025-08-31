import api from "./api";

// Verify OTP function
export const verifyOtp = async (email, otp) => {
  try {
    const res = await api.post(
      "/auth/verify-otp",
      { email, otp },
      { withCredentials: true }
    );
    return { success: true, message: res.data.message, user: res.data.user || null };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "OTP verification failed",
    };
  }
};

// Register function
export const register = async (userData) => {
  try {
    const res = await api.post("/auth/register", userData, { withCredentials: true });
    return {
      success: true,
      message: res.data.message,
      user: res.data.user || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Signup failed",
    };
  }
};

// Login function
export const login = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials, { withCredentials: true });
    return {
      success: true,
      message: res.data.message,
      user: res.data.user || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};

// ✅ Check current session
export const checkAuth = async () => {
  try {
    const res = await api.get("/auth/me", { withCredentials: true }); // adjust endpoint to your backend
    return {
      success: true,
      user: res.data.user || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Not authenticated",
    };
  }
};

// ✅ Logout
export const logout = async () => {
  try {
    await api.post("/auth/logout", {}, { withCredentials: true }); // adjust if backend uses GET
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

const authServices = {
  verifyOtp,
  register,
  login,
  checkAuth, // ✅ added
  logout,    // ✅ added
};

export default authServices;
