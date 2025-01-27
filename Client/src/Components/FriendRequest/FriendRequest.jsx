import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const { loggedinUser } = useSelector((store) => store.user);

  useEffect(() => {
    // Fetch friend requests
    const fetchFriendRequests = async () => {
      try {
        console.log(loggedinUser.username);
        const response = await axios.get('http://localhost:9000/api/users/getfriendrequests', {
          withCredentials: true,
        });

        setFriendRequests(
          response.data.friendRequests.map((request) => ({
            ...request,
            status: 'pending', // Add default 'pending' status to each request
          }))
        );
      } catch (error) {
        console.error('Error fetching friend requests:', error);
        toast.error('Failed to fetch friend requests.');
      }
    };

    fetchFriendRequests();
  }, [loggedinUser.username]);

  const handleAction = async (senderUsername, action) => {
    try {
      await axios.post('http://localhost:9000/api/users/handleRequest', {
        senderUsername,
        receiverUsername: loggedinUser.username,
        action,
      });
      toast.success(`Friend request ${action}ed!`);

      // Update the status of the processed friend request
      setFriendRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.sender.username === senderUsername ? { ...req, status: action } : req
        )
      );
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
      toast.error(`Failed to ${action} friend request.`);
    }
  };

  return (
    <div className="friend-requests-container">
      <h1>Friend Requests</h1>
      {friendRequests.length === 0 ? (
        <p>No friend requests to show.</p>
      ) : (
        <ul>
          {friendRequests.map((request) => (
            <li key={request._id} className="friend-request-item">
              <div className="request-info">
                <img
                  src={request.sender.avatar}
                  alt={request.sender.username}
                  className="avatar"
                />
                <span>{request.sender.fullname} (@{request.sender.username})</span>
              </div>
              <div className="request-actions">
                {request.status === 'pending' ? (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => handleAction(request.sender.username, 'accept')}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleAction(request.sender.username, 'reject')}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className={`status-label ${request.status}`}>
                    {request.status === 'accept' ? 'Accepted' : 'Rejected'}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequests;
