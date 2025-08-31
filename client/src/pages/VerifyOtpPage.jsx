import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // ✅ Load email from sessionStorage on mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("otpEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Redirect to register if no email found
      navigate("/register");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true }
      );

      alert(res.data.message); // OTP verified
      sessionStorage.removeItem("otpEmail"); // clean up
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Invalid OTP, try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          Verify OTP
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          An OTP has been sent to <strong>{email}</strong>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full p-2 mb-6 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded transition"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyOtpPage;
