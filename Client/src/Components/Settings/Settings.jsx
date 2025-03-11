
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoggedinUser } from "../../redux/userSlice.js";
import Footer from "../Footer/footer.jsx"; // ✅ Import Footer

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser);

  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // ✅ Load user's data on component mount
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "", // Keep password empty for security
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = (field) => {
    let updatedUser = { ...user, [field]: formData[field] };
    dispatch(setLoggedinUser(updatedUser));
    setEditField(null);
    console.log(`✅ ${field} updated successfully!`, updatedUser);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Navbar-like Header */}
      <header className="w-full bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600 shadow-lg py-4 px-6 text-left text-2xl font-bold">
        Settings
      </header>

      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl">
          
          {/* Username */}
          <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
            <div>
              <p className="text-gray-400 text-sm">Username:</p>
              {editField === "username" ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded mt-1"
                />
              ) : (
                <p className="text-lg font-semibold">{formData.username}</p> // ✅ Now always displays current data
              )}
            </div>
            {editField === "username" ? (
              <button
                onClick={() => handleSave("username")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditField("username")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                Change
              </button>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
            <div>
              <p className="text-gray-400 text-sm">Email:</p>
              {editField === "email" ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded mt-1"
                />
              ) : (
                <p className="text-lg font-semibold">{formData.email}</p> // ✅ Displays updated email
              )}
            </div>
            {editField === "email" ? (
              <button
                onClick={() => handleSave("email")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditField("email")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                Change
              </button>
            )}
          </div>

          {/* Password */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Password:</p>
              {editField === "password" ? (
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded mt-1"
                />
              ) : (
                <p className="text-lg font-semibold">********</p> // ✅ Keeps password hidden
              )}
            </div>
            {editField === "password" ? (
              <button
                onClick={() => handleSave("password")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditField("password")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                Change
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Settings;


