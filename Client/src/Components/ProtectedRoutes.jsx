  import { Navigate, Outlet, useLocation } from "react-router-dom";
  import { useSelector } from "react-redux";

  export default function ProtectedRoute() {
    const { loggedinUser } = useSelector((state) => state.user);

    return loggedinUser ? <Outlet /> : <Navigate to="/" replace />;
  }
