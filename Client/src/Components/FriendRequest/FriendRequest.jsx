// FriendRequests.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const { loggedinUser }= useSelector((store)=>store.user);

  useEffect(() => {
    // Fetch friend requests
    const fetchFriendRequests = async () => {
      try {
        console.log(loggedinUser.username)
        const response = await axios.get('http://localhost:9000/api/users/getfriendrequests', {
            withCredentials: true,
          });
          
        setFriendRequests(response.data.friendRequests);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
        toast.error('Failed to fetch friend requests.');
      }
    };

    fetchFriendRequests();
  }, [loggedinUser.username]);

  
  const handleAccept = async (senderUsername) => {
    try {
      await axios.post('http://localhost:9000/api/users/handleRequest', {
        senderUsername,
        receiverUsername: loggedinUser.username,
        action: 'accept',
      });
      toast.success('Friend request accepted!');
      setFriendRequests(friendRequests.filter((req) => req.sender.username !== senderUsername));
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Failed to accept friend request.');
    }
  };
  
  const handleReject = async (senderUsername) => {
    try {
      await axios.post('http://localhost:9000/api/users/handleReject', {
        senderUsername,
        receiverUsername: loggedinUser.username,
        action: 'reject',
      });
      toast.success('Friend request rejected.');
      setFriendRequests(friendRequests.filter((req) => req.sender.username !== senderUsername));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error('Failed to reject friend request.');
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
                <button
                  className="btn btn-success"
                  onClick={() => handleAccept(request.sender.username)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleReject(request.sender.username)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequests;
