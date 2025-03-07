import React, { useState } from 'react';
import './Login.css'; // Keep your existing styles if needed.
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { setLoggedinUser } from '../../redux/userSlice.js';
import { io } from 'socket.io-client'
import { setSocket } from '../../redux/socketSlice.js';

export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false);

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
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        const loadingToastId = toast.loading('Signing up...');

        try {
            const res = await axios.post('http://localhost:9000/api/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message, { id: loadingToastId });
                toggle('login');
            }
        } catch (error) {
            toast.error(error.response.data.message, { id: loadingToastId });
            console.log(error);
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
        try {
            const res = await axios.post('http://localhost:9000/api/users/login', loginuser, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setLoggedinUser(res.data));

                toast.success(`Welcome ${res.data.fullname}`, { icon: '👋' });

                // Connect socket
                const newSocket = io('http://localhost:9000', {
                    query: { userId: res.data._id },
                    reconnection: true,
                });

                dispatch(setSocket(newSocket));

                // ✅ Fix: Use newSocket instead of undefined socket
                newSocket.on('connect_error', (err) => {
                    console.error('Socket connection error:', err.message);
                });

                // ✅ Navigate only once after setting up everything
                navigate("/home");
            } else {
                toast.error("Login failed! Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong!!");
            }
        }

        // Reset login form
        setLoginUser({
            username: "",
            password: "",
        });
    };


    return (
    
        <div
            className="flex items-center justify-center min-h-screen w-full back bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/images/login1.jpg')"
            }}
        >

            <div className="flex flex-col items-center p-6 bg-white border border-gray-300 rounded-lg shadow-md">
                <div className="mb-4 text-2xl font-bold underline header">{isSignUp ? 'Sign Up' : 'Login'}</div>

                {isSignUp ? (
                    <>
                        <form onSubmit={SignupSubmitHandler} action="">
                            <label className="flex items-center gap-2 mb-2 w-72">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5 opacity-70">
                                    <path
                                        d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7v1h14v-1c0-3.866-3.134-7-7-7z" />
                                </svg>
                                <input
                                    type="text"
                                    className="p-2 border-b border-gray-300 grow focus:outline-none"
                                    placeholder="FullName"
                                    value={registeruser.fullname} onChange={(e) => setRegisterUser({ ...registeruser, fullname: e.target.value })}
                                />
                            </label>


                            <label className="flex items-center gap-2 mb-2 w-72">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="w-4 h-4 opacity-70">
                                    <path
                                        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                    <path
                                        d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                </svg>
                                <input
                                    type="text"
                                    className="p-2 border-b border-gray-300 grow focus:outline-none"
                                    placeholder="Email"
                                    value={registeruser.email} onChange={(e) => setRegisterUser({ ...registeruser, email: e.target.value })}
                                />
                            </label>

                            <label className="flex items-center gap-2 mb-2 w-72">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="w-4 h-4 opacity-70">
                                    <path
                                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                </svg>
                                <input
                                    type="text"
                                    className="p-2 border-b border-gray-300 grow focus:outline-none"
                                    placeholder="Username"
                                    value={registeruser.username} onChange={(e) => setRegisterUser({ ...registeruser, username: e.target.value })}
                                />
                            </label>

                            <label className="flex items-center gap-2 mb-2 w-72">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="w-4 h-4 opacity-70">
                                    <path
                                        fillRule="evenodd"
                                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                        clipRule="evenodd" />
                                </svg>
                                <input
                                    type="password"
                                    className="p-2 border-b border-gray-300 grow focus:outline-none"
                                    placeholder="Password"
                                    value={registeruser.password} onChange={(e) => setRegisterUser({ ...registeruser, password: e.target.value })}
                                />
                            </label>

                            <label className="flex items-center gap-2 mb-2 w-72">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="w-4 h-4 opacity-70">
                                    <path
                                        fillRule="evenodd"
                                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                        clipRule="evenodd" />
                                </svg>
                                <input
                                    type="password"
                                    className="p-2 border-b border-gray-300 grow focus:outline-none"
                                    placeholder="Confirm Password"
                                    value={registeruser.confirmPassword} onChange={(e) => setRegisterUser({ ...registeruser, confirmPassword: e.target.value })}
                                />
                            </label>


                            <label className="w-full max-w-xs form-control">
                                <div className="flex flex-col justify-between md:flex-row">
                                    <span className="ml-4 text-lg text-gray-700 label-text">Avatar</span>
                                </div>
                                <input
                                    type="file"
                                    className="w-full p-0 mt-2 ml-4 cursor-pointer focus:outline-none"
                                    onChange={handleFileChange} name="avatar"
                                />
                            </label>

                            <button className="w-full p-2 mt-4 text-white bg-green-500 rounded-md btn btn-wide">Sign Up</button>
                        </form>
                    </>
                ) : (
                    <>
                        <form onSubmit={LoginSubmitHandler}>
                            <label className="flex items-center gap-2 mb-2 w-72">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="w-4 h-4 opacity-70">
                                    <path
                                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                </svg>
                                <input
                                    type="text"
                                    className="p-2 border-b border-gray-300 grow focus:outline-none"
                                    placeholder="Username"
                                    value={loginuser.username} onChange={(e) => setLoginUser({ ...loginuser, username: e.target.value })}
                                />
                            </label>

                            <label className="flex items-center gap-2 mb-2 w-72">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="w-4 h-4 opacity-70">
                                    <path
                                        fillRule="evenodd"
                                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                        clipRule="evenodd" />
                                </svg>
                                <input
                                    type="password"
                                    className="p-2 border-b border-gray-300 grow focus:outline-none"
                                    placeholder="Password"
                                    value={loginuser.password} onChange={(e) => setLoginUser({ ...loginuser, password: e.target.value })}
                                />
                            </label>

                            <button className="w-full p-2 mt-4 text-white bg-blue-500 rounded-md btn btn-wide">Login</button>
                        </form>
                    </>
                )}

                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="mt-2 text-sm text-blue-500">
                    {isSignUp ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
                </button>
            </div>
        </div>
    );
}


