import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaClock, FaUsers, FaRedo } from "react-icons/fa";
import Header from "../Header/Header";

export default function ActiveContests() {
    const { loggedinUser } = useSelector((store) => store.user);
    const { socket } = useSelector((store) => store.socket);
    const navigate = useNavigate();

    const [activeContests, setActiveContests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!loggedinUser) return;

        axios.post("http://localhost:9000/api/users/activecontests", { username: loggedinUser.username })
            .then((res) => {
                setActiveContests(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching active contests:", err);
                toast.error("Failed to fetch active contests.");
                setLoading(false);
            });
    }, [loggedinUser]);

    const handleReconnect = (roomName) => {
        if (!socket || !loggedinUser) return;
        toast.loading("Reconnecting to contest...", { id: "reconnect-toast" });
        socket.emit("reconnectContest", { roomName, username: loggedinUser.username });
    
        socket.once("reconnectContest", ({ roomName, endTime, problem }) => {
            toast.dismiss("reconnect-toast");
            navigate("/problem", { state: { roomName, endTime, problem } });
        });
    
        socket.once("contestError", (error) => {
            toast.error(error.message);
        });
    };
    
    return (
        <section className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
                <Header />
            </div>
            
            <div className="flex flex-col items-center w-full p-6 pt-24 m-auto sm:max-w-[50vw]">
                <h1 className="mt-4 mb-6 text-3xl font-bold text-center dark:text-gray-100">Active Contests</h1>
                
                <div className="w-full max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
                    {loading ? (
                        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                    ) : activeContests.length === 0 ? (
                        <p className="mt-6 text-gray-600 dark:text-gray-400">No active contests.</p>
                    ) : (
                        <ul className="space-y-4">
                            {activeContests.map((contest) => (
                                <li
                                    key={contest.roomName}
                                    className="p-4 transition-shadow duration-300 border rounded-lg shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-md hover:shadow-xl border-white/20 dark:border-gray-700/20"
                                >
                                    <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                                        <div className="flex items-center space-x-4">
                                            <FaUsers className="text-xl text-blue-500" />
                                            <div>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    Opponent: {contest.opponentName}
                                                </p>
                                                <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <FaClock className="mr-1" /> Ends at: {new Date(contest.endTime).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleReconnect(contest.roomName)}
                                            className="flex items-center px-4 py-2 text-white transition-all duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
                                        >
                                            <FaRedo className="mr-2" /> Continue
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}