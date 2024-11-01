// Stats.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const Stats = () => {
  const { loggedinUser } = useSelector(store => store.user);

  return (
    <div className="space-y-4">
      {/* Profile Picture and User Details */}
      <div className="flex items-center">
        <img
          src={loggedinUser?.avatar}
          alt="Profile Pic"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h2 className="text-lg font-semibold">{loggedinUser?.fullName}</h2>
          <p className="text-gray-600">@{loggedinUser?.userName}</p>
          <p className="text-gray-500">Rank: {loggedinUser?.rank}</p>
          <p className="text-gray-500">{loggedinUser?.email}</p>
        </div>
      </div>

      {/* Buttons */}
      <button className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
        Show Friend
      </button>
      <button className="w-full px-4 py-2 mt-2 text-white bg-green-500 rounded hover:bg-green-600">
        Add Friend
      </button>
    </div>
  );
};

export default Stats;
