import { useState } from "react";

export default function SettingsPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Logic to update profile
    setMessage("Profile updated successfully!");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Logic to change password
    setMessage("Password changed successfully!");
  };

  const handleDeleteAccount = () => {
    // Logic to delete account
    setMessage("Account deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <form onSubmit={handleProfileUpdate} className="max-w-md space-y-6 mb-10">
        <h2 className="text-2xl font-semibold mb-2">Update Profile</h2>
        <div>
          <label className="block text-gray-300 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 rounded-md text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 rounded-md text-white focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
        >
          Save Profile
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="max-w-md space-y-6 mb-10">
        <h2 className="text-2xl font-semibold mb-2">Change Password</h2>
        <div>
          <label className="block text-gray-300 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 rounded-md text-white focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
        >
          Change Password
        </button>
      </form>

      <div className="max-w-md">
        <h2 className="text-2xl font-semibold mb-2">Danger Zone</h2>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Delete Account
        </button>
      </div>

      {message && <p className="text-green-400 mt-6">{message}</p>}
    </div>
  );
}
