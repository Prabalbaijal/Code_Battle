import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const { loggedinUser } = useSelector((store) => store.user); // Assuming `loggedinUser` includes `_id`.

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Send user ID as a query parameter
        const response = await axios.get(`http://localhost:9000/api/users/getfriends?id=${loggedinUser._id}`);
        setFriends(response.data.friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
        toast.error('Failed to fetch friends.');
      }
    };

    if (loggedinUser && loggedinUser._id) fetchFriends();
  }, [loggedinUser]);

  return (
    <section className="friends-section">
      <h3>Online Friends</h3>
      {friends.length === 0 ? (
        <p>No friends available.</p>
      ) : (
        <ul className="friends-list">
          {friends.map((friend) => (
            <li key={friend._id} className="friend-item">
              <div className="friend-info">
                <img
                  src={friend.avatar}
                  alt={friend.username}
                  className="avatar"
                />
                <span>{friend.fullname} (@{friend.username})</span>
              </div>
              <div className="friend-status">
                <span className={`status ${friend.status}`}>
                  {friend.status === 'online' && 'Online'}
                  {friend.status === 'in-game' && 'In-Game'}
                  {friend.status === 'offline' && 'Offline'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button className="invite-button">Invite Friends</button>
    </section>
  );
};

export default Friends;
