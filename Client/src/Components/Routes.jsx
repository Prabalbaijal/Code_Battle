import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import HomePage from "./HomePage/HomePage";
import Match from "./Matching/Match";
import Profile from "./Profile/Profile";
import Settings from "./Settings/Settings";
import FriendRequests from "./FriendRequest/FriendRequest";
import Friends from "./Friends/Friends";
import ActiveContests from "./ActiveContests/ActiveContests";
import Login from "./Login/Login";
import Problem from "./Problem/Problem";
import { useSelector } from "react-redux";
import ForgotPassword from "./PasswordReset/ForgotPassword";
import ResetPassword from "./PasswordReset/ResetPassword";

function RedirectToHome() {
  const { loggedinUser } = useSelector((store) => store.user);
  return loggedinUser ? <Navigate to="/home" replace /> : <Login />;
}

const router = createBrowserRouter([
  { path: "/", element: <RedirectToHome /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },

  {
    element: <ProtectedRoute />, 
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/match", element: <Match /> },
      { path: "/profile", element: <Profile /> },
      { path: "/settings", element: <Settings /> },
      { path: '/friendrequests', element: <FriendRequests /> },
        { path: '/friends', element: <Friends /> },
        { path:'/activecontests',element: <ActiveContests/>},
        { path: '/problem', element: <Problem /> },
    ],
  },
]);

export default router;
