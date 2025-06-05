import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Header from "../Header/Header";

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const { loggedinUser } = useSelector((store) => store.user);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${BACKEND_URL}/api/friends/getfriendrequests`, {
          withCredentials: true,
        });

        setFriendRequests(
          response.data.friendRequests.map((request) => ({
            ...request,
            status: "pending",
          }))
        );
      } catch (error) {
        console.error("Error fetching friend requests:", error);
        toast.error("Failed to fetch friend requests.");
      }
    };

    fetchFriendRequests();
  }, [loggedinUser.username]);

  const handleAction = async (senderUsername, action) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      await axios.post(`${BACKEND_URL}/api/friends/handleRequest`, {
        senderUsername,
        receiverUsername: loggedinUser.username,
        action,
      },{
        withCredentials:true
      });
      toast.success(`Friend request ${action}ed!`);

      setFriendRequests((prevRequests) =>
        prevRequests.filter((req) => req.sender.username !== senderUsername)
      );
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
      toast.error(`Failed to ${action} friend request.`);
    }
  };

  return (
    <section className="min-h-screen p-6 friends-section bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
        <Header />
      </div>

      <div className="flex flex-col justify-center p-6 pt-24 m-auto w-full max-w-[95vw] md:max-w-[80vw] lg:max-w-[50vw]">
        <h1 className="mt-4 mb-6 text-2xl font-bold text-center md:text-3xl dark:text-gray-100">
          Friend Requests
        </h1>

        {friendRequests.length === 0 ? (
          <p className="text-lg text-center dark:text-gray-100">No friend requests available.</p>
        ) : (
          <div className="w-full p-4 border rounded-lg shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-md hover:shadow-xl border-white/20 dark:border-gray-700/20">
            {/* Scrollable Friend Requests List */}
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              {friendRequests.map((request) => (
                <div
                  key={request._id}
                  className="flex flex-col items-center justify-between gap-4 p-4 transition-all duration-300 md:flex-row rounded-xl hover:shadow-lg md:gap-2"
                >
                  {/* User Info */}
                  <div className="flex items-center w-full space-x-4 md:w-auto">
                    <img
                      src={request.sender.avatar || "https://via.placeholder.com/50"}
                      alt={request.sender.username}
                      className="w-12 h-12 border-2 border-gray-300 rounded-full"
                    />
                    <span className="font-medium text-center text-md md:text-lg dark:text-gray-100 md:text-left">
                      {request.sender.fullname} (@{request.sender.username})
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap justify-center w-full gap-2 md:justify-end md:w-auto">
                    <button
                      onClick={() => handleAction(request.sender.username, "accept")}
                      className="w-full px-4 py-2 text-white bg-green-500 rounded-lg shadow hover:bg-green-600 md:w-auto"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(request.sender.username, "reject")}
                      className="w-full px-4 py-2 text-white bg-red-500 rounded-lg shadow hover:bg-red-600 md:w-auto"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => toast.info(`Viewing profile of ${request.sender.username}`)}
                      className="w-full px-4 py-2 text-gray-900 bg-gray-300 rounded-lg shadow hover:bg-gray-400 md:w-auto"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FriendRequests;
