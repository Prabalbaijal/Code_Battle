import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import Stats from "./Stats";
import PerformanceGraph from "./PerformanceGraph";
import ContestHistory from "./ContestHistory";
import axios from "axios";
import { Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoggedinUser } from "../../redux/userSlice.js";
import toast from "react-hot-toast";
import "./Profile.css";

const Profile = () => {
  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [level, setLevel] = useState(null);
  const [coins, setCoins] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(
          `${BACKEND_URL}/api/users/updateprofile`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        // console.log(response.data.matchHistory)
        setMatchHistory(response.data.matchHistory);
        setLevel(response.data.level);
        setCoins(response.data.coins);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logoutFunction = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.get(`${BACKEND_URL}/api/auth/logout`,{withCredentials:true});
      navigate("/");
      toast.success(res.data.message);
      dispatch(setLoggedinUser(null));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="profile-container">
      <ProfileHeader />

      <div className="profile-main">
        <div className="profile-sidebar">
          <Stats level={level} coins={coins} />
        </div>

        <div className="profile-content">
          <div className="profile-graph">
            <PerformanceGraph />
          </div>

          <div className="profile-history">
            {loading ? (
              <p className="loading-text">Loading...</p>
            ) : (
              <ContestHistory contests={matchHistory} />
            )}
          </div>

          {isSmallScreen && (
            <div className="settings-container">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="settings-button"
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>

              {isSettingsOpen && (
                <div className="settings-dropdown">
                  <button
                    onClick={logoutFunction}
                    className="logout-button"
                  >
                    <LogOut size={16} className="logout-icon" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
