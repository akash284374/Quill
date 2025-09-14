import { createContext, useState, useEffect, useContext } from "react";
import authServices from "../services/authServices";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking auth

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Load user from localStorage first
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));

        // Validate session with backend
        const data = await authServices.checkAuth();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false); // important to set loading false after check
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authServices.login(credentials);
    if (data.success && data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  };

  const signup = async (userData) => {
    const data = await authServices.register(userData);
    if (data.success && data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  };

  const verifyOtp = async (email, otp) => {
    return await authServices.verifyOtp(email, otp);
  };

  const logout = async () => {
    try {
      await authServices.logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
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
