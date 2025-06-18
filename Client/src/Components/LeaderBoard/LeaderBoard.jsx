import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Header from '../Header/Header';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const { onlineUsers, loggedinUser } = useSelector((store) => store.user);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/users/leaderboard`, {
          withCredentials: true,
        });
        setLeaders(res.data.leaderboard);
        setMyRank(res.data.rank);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load leaderboard");
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  return (
    <section className="min-h-screen p-6 bg-gradient-to-br from-yellow-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md dark:bg-gray-900">
        <Header />
      </div>

      <div className="flex flex-col items-center w-full pt-24 sm:max-w-[60vw] mx-auto">
        <h1 className="mb-4 text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          Leaderboard
        </h1>

        {loggedinUser && myRank!==null && (
          <div className="px-6 py-3 mb-6 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
              You are ranked: <span className="font-bold text-yellow-600">#{myRank}</span>
            </p>
          </div>
        )}

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
        ) : (
          <ul className="w-full space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-transparent">
            {leaders.map((user, index) => (
              <li
                key={user._id}
                className="flex items-center justify-between p-4 transition-shadow duration-300 bg-white border rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg border-white/20 dark:border-gray-700/20"
              >
                <div className="flex items-center space-x-4">
                  <span className="w-6 text-xl font-bold text-center text-gray-600 dark:text-gray-300">{index + 1}</span>
                  <div className={`avatar ${onlineUsers?.some((u) => u.userName === user.username) ? 'online' : ''}`}>
                    <div className="w-10 rounded-full">
                      <img src={user.avatar} alt="avatar" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{user.fullname}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                  </div>
                </div>
                <div className="flex flex-col text-right">
                  <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                    🪙 {user.coins} coins
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Level {user.level}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;
