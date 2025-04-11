import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addChallenge, clearChallenges,setRequestSentModal, setInContest, setCreatingRoom, setWaitingMessage,removeChallenge } from './redux/uiSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SocketHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedinUser } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);

  useEffect(() => {
    if (!socket || !loggedinUser) return;

    socket.on('playNotification', ({ roomName, initiator }) => {
      console.log("playnotification received",initiator)
      if (initiator !== loggedinUser.username) {
        dispatch(addChallenge({ roomName, initiator }));
      }
    });

    socket.on('startContest', ({ roomName, endTime, problem }) => {
      dispatch(setInContest(true));
      dispatch(clearChallenges());  
      dispatch(setCreatingRoom(false));
      dispatch(setWaitingMessage(''));
      dispatch(setRequestSentModal(false));
      navigate('/problem', { state: { roomName, endTime, problem } });
    });
    socket.on("challengeCancelled", ({ initiator }) => {
      console.log("cancel received")
      dispatch(removeChallenge({ initiator })); // remove from challenge list
    });

    socket.on('opponentOffline', ({ message }) => {
      toast.error(message);
      dispatch(setCreatingRoom(false));
      dispatch(setWaitingMessage(''));
      dispatch(setRequestSentModal(false));
    });

    socket.on("challengeRejected", ({ initiator }) => {
      if (initiator === loggedinUser.username) {
        toast.error("Your challenge was rejected!!.");
        dispatch(setCreatingRoom(false));
        dispatch(setWaitingMessage(''));
        dispatch(setRequestSentModal(false));
      }
    });

    socket.on('requestSent', ({ message }) => {
      dispatch(setWaitingMessage(message));
      dispatch(setRequestSentModal(true))
    });

    socket.on('reconnectContest', ({ roomName, endTime, problem }) => {
      dispatch(setInContest(true));
      dispatch(clearChallenges());
      navigate('/problem', { state: { roomName, endTime, problem } });
    });

    return () => {
      socket.off('playNotification');
      socket.off('startContest');
      socket.off('opponentOffline');
      socket.off('challengeRejected');
      socket.off('requestSent');
      socket.off('reconnectContest');
    };
  }, [socket, loggedinUser, dispatch, navigate]);

  return null;
};

export default SocketHandler;
