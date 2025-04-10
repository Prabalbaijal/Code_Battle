import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NavigationHandler = () => {
  const navigate = useNavigate();
  const { socket } = useSelector((store) => store.socket);

  useEffect(() => {
    if (!socket) return;

    socket.on('startContest', ({ roomName, endTime, problem }) => {
      console.log("✅ Contest Started!");
      navigate('/problem', { state: { roomName, endTime, problem } });
    });

    return () => socket.off('startContest');
  }, [socket, navigate]);

  return null;
};

export default NavigationHandler;
