
import React from 'react';
import ProfileHeader from './ProfileHeader';
import Stats from './Stats';
import PerformanceGraph from './PerformanceGraph';
import ContestHistory from './ContestHistory';
import './Profile.css';

const Profile = () => {
  return (
    <div className="profile-page h-screen w-full flex flex-col">
      {/* Header */}
      <ProfileHeader />

      {/* Main Content */}
      <div className="flex h-full">
        {/* Left Sidebar (25%) */}
        <div className="w-1/4 bg-gray-100 border-r border-gray-300">
          <Stats />
        </div>

        {/* Right Content (75%) */}
        <div className="w-3/4 p-4 flex flex-col space-y-4">
          {/* Performance Graph */}
          <div className="h-1/2 bg-white shadow p-4">
            <PerformanceGraph />
          </div>

          {/* Contest History */}
          <div className="h-1/2 bg-white shadow p-4 overflow-y-auto">
            <ContestHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;