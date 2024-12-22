import { useEffect, useState } from 'react';
import axios from 'axios';

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/users/friendrequests', {
          params: { userId: loggedinUser._id },
        });
        setFriendRequests(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriendRequests();
  }, [loggedinUser._id]);

  const handleRequestAction = async (requestId, action) => {
    try {
      const response = await axios.post('http://localhost:9000/api/users/handlefriendrequest', {
        requestId,
        action,
      });
      alert(response.data.message);
      setFriendRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error(error);
      alert('Failed to handle friend request.');
    }
  };

  return (
    <div className="friend-requests">
      <h3>Friend Requests</h3>
      <ul>
        {friendRequests.map((request) => (
          <li key={request._id}>
            {request.sender.username}
            <button onClick={() => handleRequestAction(request._id, 'accept')}>Accept</button>
            <button onClick={() => handleRequestAction(request._id, 'reject')}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequests;
