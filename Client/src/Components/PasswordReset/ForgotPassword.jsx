import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post("http://localhost:9000/api/users/forgot-password", { email });
            toast.success(res.data.message || "Reset link sent successfully!");
            setEmail("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending reset email");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-gray-100">
            {/* Background decorative elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 rounded-full -left-4 h-72 w-72 bg-purple-500/30 blur-3xl" />
                <div className="absolute bottom-0 rounded-full -right-4 h-72 w-72 bg-blue-500/30 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md p-6">
                <div className="p-8 border border-gray-800 shadow-xl bg-gray-900/80 backdrop-blur-xl rounded-2xl">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
                            Recover Access
                        </h2>
                        <p className="mt-2 text-gray-400">
                            Enter your email to receive a password reset link
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 text-white placeholder-gray-500 transition bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold flex items-center justify-center
                                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div className="mt-4 text-center">
                            <Link
                                to="/"
                                className="text-sm text-gray-400 transition hover:text-white"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}