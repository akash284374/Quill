// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../services/authServices";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 👈 needed for redirect

  // ✅ Check auth status on first load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authServices.checkAuth();
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authServices.login(credentials);
      if (data.success) {
        setUser(data.user);
        navigate("/"); // 🔥 redirect to Home after login
      }
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const data = await authServices.register(userData);
      if (data.success) {
        setUser(data.user);
        navigate("/"); // 🔥 redirect to Home after signup
      }
      return data;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const verifyOtp = async (email, otp) => {
    return await authServices.verifyOtp(email, otp);
  };

  const logout = async () => {
    try {
      await authServices.logout(); // backend clears cookie
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setUser(null);
      navigate("/login"); // 👈 send back to login page
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        verifyOtp,
        logout,
        setUser,
        isAuthenticated: !!user, // 👈 easy flag for Sidebar
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
