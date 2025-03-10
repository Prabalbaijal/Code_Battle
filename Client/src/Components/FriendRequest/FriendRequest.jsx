
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ProfileHeader from "../Profile/ProfileHeader";

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const { loggedinUser } = useSelector((store) => store.user);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/users/getfriendrequests", {
          withCredentials: true,
        });

        // Remove duplicate requests by keeping only one request per sender
        const uniqueRequests = Object.values(
          response.data.friendRequests.reduce((acc, request) => {
            acc[request.sender.username] = request;
            return acc;
          }, {})
        );

        setFriendRequests(
          uniqueRequests.map((request) => ({
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
      await axios.post("http://localhost:9000/api/users/handleRequest", {
        senderUsername,
        receiverUsername: loggedinUser.username,
        action,
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
    <>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <ProfileHeader />
      </div>

      <div className="w-full mx-auto p-6 pt-24">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-left mt-4 ml-2">
          Friend Requests
        </h1>

        {friendRequests.length === 0 ? (
          <p className="text-left text-gray-500 text-lg">No friend requests available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {friendRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 transition-all duration-300 hover:shadow-2xl"
              >
                <img
                  src={request.sender.avatar || "https://via.placeholder.com/100"}
                  alt={request.sender.username}
                  className="w-20 h-20 rounded-full border-4 border-gray-300"
                />
                <span className="text-xl font-medium text-gray-700">
                  {request.sender.fullname} (@{request.sender.username})
                </span>
                <div className="w-full flex justify-center space-x-4">
                  {request.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleAction(request.sender.username, "accept")}
                        className="px-5 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(request.sender.username, "reject")}
                        className="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-5 py-2 rounded-lg text-white text-lg font-semibold ${
                        request.status === "accept" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {request.status === "accept" ? "Accepted" : "Rejected"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FriendRequests;
