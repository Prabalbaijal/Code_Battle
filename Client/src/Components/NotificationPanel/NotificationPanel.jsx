// NotificationPanel.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeChallenge, setCreatingRoom, setWaitingMessage } from "../../redux/uiSlice";

const NotificationPanel = () => {
  const { challenges } = useSelector((state) => state.ui);
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  const acceptChallenge = (challenge) => {
    dispatch(setCreatingRoom(true));
    dispatch(setWaitingMessage("Creating Room.DON'T REFRESH THE PAGE..."));
    socket.emit("joinRoom", challenge.roomName);
    socket.emit("roomCreationStarted", { to: challenge.initiator });
    dispatch(removeChallenge(challenge));
  };

  const declineChallenge = (challenge) => {
    socket.emit("challengeRejected", { initiator: challenge.initiator });
    dispatch(removeChallenge(challenge));
  };

  return (
    <div className="fixed z-50 flex flex-col max-w-sm gap-4 bottom-4 right-4">
      {challenges.map((challenge, index) => (
        <div key={index} className="p-4 bg-white border border-gray-200 rounded shadow-lg">
          <p className="mb-2 font-semibold text-gray-800">
            {challenge.initiator} challenged you!
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => acceptChallenge(challenge)}
              className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-500"
            >
              Accept
            </button>
            <button
              onClick={() => declineChallenge(challenge)}
              className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-500"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;
