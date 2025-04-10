
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from "axios";
import toast from 'react-hot-toast';
import { setLoggedinUser } from '../../redux/userSlice.js';
import { setSocket } from '../../redux/socketSlice.js';
import { io } from 'socket.io-client';

export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");

    const [registeruser, setRegisterUser] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        avatar: null
    });

    const [loginuser, setLoginUser] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(`${BACKEND_URL}/api/users/forgot-password`, 
                { email: forgotEmail },
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success("Password reset link sent to your email!");
                setShowForgotPassword(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    };

    const SignupSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullname', registeruser.fullname);
        formData.append('username', registeruser.username);
        formData.append('email', registeruser.email);
        formData.append('password', registeruser.password);
        formData.append('confirmPassword', registeruser.confirmPassword);
        if (registeruser.avatar) {
            formData.append('avatar', registeruser.avatar);
        }

        const loadingToastId = toast.loading('Signing up...');

        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(`${BACKEND_URL}/api/users/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message, { id: loadingToastId });
                setIsSignUp(false);
            }
        } catch (error) {
            toast.error(error.response.data.message, { id: loadingToastId });
        }

        setRegisterUser({
            fullname: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            avatar: null
        });
    };

    const handleFileChange = (e) => {
        setRegisterUser({ ...registeruser, avatar: e.target.files[0] });
    };

    const LoginSubmitHandler = async (e) => {
        e.preventDefault();
        toast.loading('Validating',{id:'logging-toast'})
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(`${BACKEND_URL}/api/users/login`, loginuser, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setLoggedinUser(res.data));
                toast.success(`Welcome ${res.data.fullname}`, { icon: '👋' ,id:'logging-toast'});
                const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
                const newSocket = io(`${BACKEND_URL}`, {
                    query: { userId: res.data._id },
                    reconnection: true,
                });

                dispatch(setSocket(newSocket));

                newSocket.on('connect_error', (err) => {
                    console.error('Socket connection error:', err.message);
                });

                navigate("/home");
            } else {
                toast.error("Login failed! Please try again.",{id:'logging-toast'});
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message,{id:"logging-toast"});
            } else {
                toast.error("Something went wrong!!");
            }
        }

        setLoginUser({
            username: "",
            password: "",
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-gray-100">
            <div className="absolute inset-0 bg-grid-white/[0.05]" />
            
            {/* Decorative elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 rounded-full -left-4 h-72 w-72 bg-purple-500/30 blur-3xl" />
                <div className="absolute bottom-0 rounded-full -right-4 h-72 w-72 bg-blue-500/30 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="p-8 border border-gray-800 shadow-xl bg-gray-900/80 backdrop-blur-xl rounded-2xl">
                    <div className="flex items-center justify-center mb-8">
                        <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
                            {isSignUp ? 'Sign Up' : 'Coding Battle'}
                        </div>
                    </div>

                    {showForgotPassword ? (
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 transition bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Reset Password
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(false)}
                                className="w-full text-sm text-gray-400 transition hover:text-white"
                            >
                                Back to login
                            </button>
                        </form>
                    ) : (
                        <>
                            {isSignUp ? (
                                <form onSubmit={SignupSubmitHandler} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full px-4 py-3 transition bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        value={registeruser.fullname}
                                        onChange={(e) => setRegisterUser({ ...registeruser, fullname: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-full px-4 py-3 transition bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        value={registeruser.email}
                                        onChange={(e) => setRegisterUser({ ...registeruser, email: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        className="w-full px-4 py-3 transition bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        value={registeruser.username}
                                        onChange={(e) => setRegisterUser({ ...registeruser, username: e.target.value })}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full px-4 py-3 transition bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        value={registeruser.password}
                                        onChange={(e) => setRegisterUser({ ...registeruser, password: e.target.value })}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="w-full px-4 py-3 transition bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        value={registeruser.confirmPassword}
                                        onChange={(e) => setRegisterUser({ ...registeruser, confirmPassword: e.target.value })}
                                    />
                                    <div className="space-y-2">
                                        <label className="block text-sm text-gray-400">Avatar</label>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/50 file:text-white hover:file:bg-blue-500/70"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 font-semibold text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
                                    >
                                        Sign Up
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={LoginSubmitHandler} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        className="w-full px-4 py-3 transition bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        value={loginuser.username}
                                        onChange={(e) => setLoginUser({ ...loginuser, username: e.target.value })}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full px-4 py-3 transition bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        value={loginuser.password}
                                        onChange={(e) => setLoginUser({ ...loginuser, password: e.target.value })}
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >
                                        Login
                                    </button>
                                </form>
                            )}

                            <div className="mt-6 space-y-2 text-center">
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-sm text-gray-400 transition hover:text-white"
                                >
                                    {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                                </button>
                                {!isSignUp && (
                                    <Link
                                        to="/forgot-password"
                                        className="block w-full text-sm text-gray-400 transition hover:text-white"
                                    >
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}