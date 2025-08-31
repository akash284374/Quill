import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authServices";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation: check passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Call backend register API WITHOUT confirmPassword
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword
      });

      if (res.success) {
        toast.success("OTP sent to your email. Please verify!");

        // Store email in sessionStorage in case of page reload
        sessionStorage.setItem("otpEmail", formData.email);

        // Navigate to Verify OTP page
        navigate("/verify-otp", { state: { email: formData.email } });
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 outline-none"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
