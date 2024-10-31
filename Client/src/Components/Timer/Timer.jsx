

import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa'; // Import the icons for play and pause

const Timer = () => {
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setTime((time) => time + 1);
            }, 1000);
        } else if (!isActive && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, time]);

    const handleStartPause = () => {
        setIsActive(!isActive);
    };

    const formatTime = (time) => {
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="flex items-center space-x-2">
            <i className="fi fi-rr-stopwatch"></i>
            <span>{formatTime(time)}</span>
            <button onClick={handleStartPause} className="flex items-center">
                {isActive ? <FaPause /> : <FaPlay />}
            </button>
        </div>
    );
};

export default Timer;

