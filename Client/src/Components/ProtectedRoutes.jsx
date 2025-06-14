  import { Navigate, Outlet} from "react-router-dom";
  import { useSelector } from "react-redux";

 export default function ProtectedRoute({ adminOnly = false }) {
  const { loggedinUser } = useSelector((state) => state.user);

  if (!loggedinUser) return <Navigate to="/" replace />;

  // if route is adminOnly, but user is not admin — redirecting
  if (adminOnly && !loggedinUser.isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // if route is NOT adminOnly, but user is admin — redirecting
  if (!adminOnly && loggedinUser.isAdmin) {
    return <Navigate to="/add-question" replace />;
  }
  
  return (
      <Outlet />
  );
}

