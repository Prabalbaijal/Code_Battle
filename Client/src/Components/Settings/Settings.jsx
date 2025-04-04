
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoggedinUser } from "../../redux/userSlice.js";
import Footer from "../Footer/Footer.jsx"; // ✅ Import Footer

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
    <div className="flex flex-col min-h-screen text-white bg-gray-900">
      {/* Navbar-like Header */}
      <header className="w-full px-6 py-4 text-2xl font-bold text-left shadow-lg bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600">
        Settings
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-xl">
          
          {/* Username */}
          <div className="flex items-center justify-between pb-2 mb-4 border-b border-gray-700">
            <div>
              <p className="text-sm text-gray-400">Username:</p>
              {editField === "username" ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded"
                />
              ) : (
                <p className="text-lg font-semibold">{formData.username}</p> // ✅ Now always displays current data
              )}
            </div>
            {editField === "username" ? (
              <button
                onClick={() => handleSave("username")}
                className="px-4 py-2 text-white transition bg-green-600 rounded-lg shadow-md hover:bg-green-700">
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditField("username")}
                className="px-4 py-2 text-white transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">
                Change
              </button>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center justify-between pb-2 mb-4 border-b border-gray-700">
            <div>
              <p className="text-sm text-gray-400">Email:</p>
              {editField === "email" ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded"
                />
              ) : (
                <p className="text-lg font-semibold">{formData.email}</p> // ✅ Displays updated email
              )}
            </div>
            {editField === "email" ? (
              <button
                onClick={() => handleSave("email")}
                className="px-4 py-2 text-white transition bg-green-600 rounded-lg shadow-md hover:bg-green-700">
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditField("email")}
                className="px-4 py-2 text-white transition bg-green-600 rounded-lg shadow-md hover:bg-green-700">
                Change
              </button>
            )}
          </div>

          {/* Password */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Password:</p>
              {editField === "password" ? (
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded"
                />
              ) : (
                <p className="text-lg font-semibold">********</p> // ✅ Keeps password hidden
              )}
            </div>
            {editField === "password" ? (
              <button
                onClick={() => handleSave("password")}
                className="px-4 py-2 text-white transition bg-green-600 rounded-lg shadow-md hover:bg-green-700">
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditField("password")}
                className="px-4 py-2 text-white transition bg-purple-600 rounded-lg shadow-md hover:bg-purple-700">
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


