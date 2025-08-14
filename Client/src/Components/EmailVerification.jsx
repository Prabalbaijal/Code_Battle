import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(`${BACKEND_URL}/api/auth/verify/${token}`);
        setStatus(res.data.message || "Email verified successfully!");
        setLoading(false);

        setTimeout(() => {
          navigate("/");
        }, 5000);
      } catch (err) {
        setStatus(
          err.response?.data?.message || "Invalid or expired verification link."
        );
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      {loading ? (
        <h2>⏳ Verifying your email...</h2>
      ) : (
        <>
          <h2>{status}</h2>
          {!loading && status.includes("successfully") && (
            <p>Redirecting to login page...</p>
          )}
        </>
      )}
    </div>
  );
};

export default EmailVerification;
