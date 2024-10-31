import React from 'react';
import { Link } from 'react-router-dom';

export default function Match() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6"> {/* Increased space-y for more margin between cards */}

        {/* Card for "Finding another player" */}
        <Link to="/finding-player">
          <div className="p-4 bg-blue-500 rounded-lg text-center cursor-pointer hover:bg-blue-600 transition duration-200 mb-4">
            <p className="text-lg font-bold text-white">Finding another player...</p>
          </div>
        </Link>

        {/* Card for "Start Battle" */}
        <Link to="/problem">
          <div className="p-4 bg-green-500 rounded-lg text-center cursor-pointer hover:bg-green-600 transition duration-200">
            <p className="text-lg font-bold text-white">Start Battle</p>
          </div>
        </Link>


      </div>
    </div>
  );
}
