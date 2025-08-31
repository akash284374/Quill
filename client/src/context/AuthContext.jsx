// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../services/authServices";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking auth
  const navigate = useNavigate();

  // ✅ Check auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to load user from localStorage first (optional)
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // Otherwise, check session from backend
          const data = await authServices.checkAuth();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user)); // cache user
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // ✅ Login
  const login = async (credentials) => {
    try {
      const data = await authServices.login(credentials);
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user)); // cache user
        navigate("/"); // redirect after login
      }
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // ✅ Signup
  const signup = async (userData) => {
    try {
      const data = await authServices.register(userData);
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user)); // cache user
        navigate("/"); // redirect after signup
      }
      return data;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async (email, otp) => {
    return await authServices.verifyOtp(email, otp);
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await authServices.logout();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setUser(null);
      localStorage.removeItem("user"); // clear cache
      navigate("/login");
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
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
