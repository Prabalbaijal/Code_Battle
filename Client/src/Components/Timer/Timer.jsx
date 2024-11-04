import React, { useState, useEffect } from 'react';

const Timer = () => {
    const [time, setTime] = useState(30 * 60 * 1000); // 30 minutes in milliseconds

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prevTime) => (prevTime > 0 ? prevTime - 1000 : 0));
        }, 1000);

        if (time === 0) clearInterval(interval);

        return () => clearInterval(interval);
    }, [time]);

    const formatTime = (milliseconds) => {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg shadow-md dark:bg-gray-700">
            <span className="mr-2 text-sm font-semibold text-gray-500 dark:text-gray-300">Time Left:</span>
            <span className="font-mono text-lg font-bold text-red-500 dark:text-red-400">
                {formatTime(time)}
            </span>
        </div>
    );
};

export default Timer;
