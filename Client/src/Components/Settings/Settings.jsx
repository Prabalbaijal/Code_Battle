import React, { useState } from 'react';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    console.log("✅ Saving changes:", { username, email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="p-6 max-w-3xl w-full bg-gray-800 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">⚙️ Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400">Change Username</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-gray-700 text-white mt-1"
              placeholder="Enter new username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-400">Change Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded bg-gray-700 text-white mt-1"
              placeholder="Enter new email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-400">Change Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded bg-gray-700 text-white mt-1"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
