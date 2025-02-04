// components/Timer/Timer.js
import React, { useState, useEffect } from 'react';

const Timer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const updateTimeLeft = () => {
            if (endTime) {
                const now = new Date().getTime();
                const timeRemaining = endTime - now;

                if (timeRemaining <= 0) {
                    setTimeLeft(0);
                } else {
                    setTimeLeft(timeRemaining);
                }
            }
        };

        const timerInterval = setInterval(updateTimeLeft, 1000);

        return () => clearInterval(timerInterval);
    }, [endTime]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <span className="text-gray-500">
            {timeLeft !== null ? formatTime(timeLeft) : 'Loading...'}
        </span>
    );
};

export default Timer;
