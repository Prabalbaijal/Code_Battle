
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }

        setIsLoading(true);
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(
                `${BACKEND_URL}/api/users/reset-password/${token}`,
                { newPassword: formData.newPassword }
            );
            toast.success(res.data.message || "Password reset successful!");
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error resetting password");
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
                            Reset Password
                        </h2>
                        <p className="mt-2 text-gray-400">
                            Enter your new password below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-300">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                required
                                className="w-full px-4 py-3 text-white placeholder-gray-500 transition bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-300">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}