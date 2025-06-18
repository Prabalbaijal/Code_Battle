import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import HomePage from "./HomePage/HomePage";
import Match from "./Matching/Match";
import Profile from "./Profile/Profile";
import FriendRequests from "./FriendRequest/FriendRequest";
import Friends from "./Friends/Friends";
import ActiveContests from "./ActiveContests/ActiveContests";
import Login from "./Login/Login";
import Problem from "./Problem/Problem";
import { useSelector } from "react-redux";
import ForgotPassword from "./PasswordReset/ForgotPassword";
import ResetPassword from "./PasswordReset/ResetPassword";
import Layout from "../Layout";
import Error from "./Error";
import AddQuestion from "./AddQuestion/AddQuestion";
import Leaderboard from "./LeaderBoard/LeaderBoard";

function RedirectToHome() {
  const { loggedinUser } = useSelector((store) => store.user);

  if (!loggedinUser) return <Login />;
  if (loggedinUser.isAdmin) return <Navigate to="/add-question" replace />;
  return <Navigate to="/home" replace />;
}


const router = createBrowserRouter([
  { path: "/", element: <RedirectToHome /> , errorElement:<Error/> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  //User Protected Routes
  {
    element: <ProtectedRoute adminOnly={false}/>,
    children: [
      {
        element: <Layout />, // layout wraps all protected pages
        children: [
          { path: "/home", element: <HomePage /> },
          { path: "/match", element: <Match /> },
          { path: "/profile", element: <Profile /> },
          { path: "/friendrequests", element: <FriendRequests /> },
          { path: "/friends", element: <Friends /> },
          { path: "/activecontests", element: <ActiveContests /> },
          { path: "/problem", element: <Problem /> },
          { path: "/leaderboard", element: <Leaderboard/>}
        ],
      },
    ],
  },
  //Admin-Only Routes
  {
    element: <ProtectedRoute adminOnly={true} />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/add-question", element: <AddQuestion /> },
        ],
      },
    ],
  },
]);

export default router;
