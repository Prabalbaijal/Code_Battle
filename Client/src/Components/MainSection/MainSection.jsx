import React, { useEffect, useState, useRef } from 'react';
import './MainSection.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const MainSections = () => {
  const { loggedinUser } = useSelector(store => store.user);

  const messages = [
    "CCode. Compete. Conquer!",
    "JJoin us for exciting coding challenges!",
  ];

  const [typedMessage, setTypedMessage] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const charIndexRef = useRef(0); // Use a ref for charIndex
  const typingSpeed = 100; // typing speed in milliseconds
  const messagePause = 2000; // pause after the message is fully typed

  useEffect(() => {
    let typingTimeout;

    const typeMessage = () => {
      const currentMessage = messages[currentMessageIndex];

      if (charIndexRef.current < currentMessage.length) {
        setTypedMessage((prev) => prev + currentMessage.charAt(charIndexRef.current));
        charIndexRef.current++; // Increment charIndexRef
        typingTimeout = setTimeout(typeMessage, typingSpeed);
      } else {
        // Pause before starting the next message
        typingTimeout = setTimeout(() => {
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length); // Move to the next message
          setTypedMessage(''); // Clear the typed message for the next one
          charIndexRef.current = 0; // Reset charIndexRef for the next message
        }, messagePause);
      }
    };

    typeMessage(); // Start typing the current message

    return () => {
      clearTimeout(typingTimeout); // Clean up the timeout
    };
  }, [currentMessageIndex]); // Only run when the current message changes

  return (
    <section className="relative min-h-screen overflow-hidden text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      {/* Background coding animation */}
      <div className="absolute inset-0 bg-center bg-cover bg-coding-background opacity-20 animate-backgroundScroll"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 space-y-8 text-center">
        {/* Typing Effect Output */}
        <div className="font-mono text-2xl">{typedMessage}</div>
        
        <h1 className="text-5xl font-bold">Welcome back, {loggedinUser?.fullname}! Ready for a new coding challenge?</h1>
        <p className="text-lg">Unleash your potential!</p>
        <Link to="/match"> <button className="btn btn-primary btn-lg">Go for Battle</button></Link>
        
        {/* Animated Announcement Blocks */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg animate-pulse">New: Code Challenge starts in 2 hours!</div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg animate-pulse">Top Scorers updated! Check the leaderboard.</div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg animate-pulse">Daily Challenge: Complete for extra points!</div>
        </div>
      </div>
    </section>
  );
};

export default MainSections;
