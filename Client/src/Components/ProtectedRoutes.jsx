  import { Navigate, Outlet, useLocation } from "react-router-dom";
  import { useSelector } from "react-redux";
  import Header from "./Header/Header";

  export default function ProtectedRoute() {
    const { loggedinUser } = useSelector((state) => state.user);

    return loggedinUser ? (
    <>
    <Header/>
    <Outlet />
    </>
  ) : <Navigate to="/" replace />;
  }
