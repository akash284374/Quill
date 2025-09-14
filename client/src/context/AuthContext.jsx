import { createContext, useState, useEffect, useContext } from "react";
import authServices from "../services/authServices";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking auth

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Validate session with backend using cookie
        const data = await authServices.checkAuth();
        if (data.success && data.user) {
          setUser(data.user); // user is logged in
        } else {
          setUser(null); // user not logged in
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setUser(null);
      } finally {
        setLoading(false); // done checking auth
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authServices.login(credentials);
    if (data.success && data.user) {
      setUser(data.user);
    }
    return data;
  };

  const signup = async (userData) => {
    const data = await authServices.register(userData);
    if (data.success && data.user) {
      setUser(data.user);
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
