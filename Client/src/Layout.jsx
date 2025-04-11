import SocketHandler from "./SocketHandler.jsx";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import NotificationPanel from "./Components/NotificationPanel/NotificationPanel.jsx";

export default function Layout() {
    const { creatingRoom, waitingMessage } = useSelector((state) => state.ui);
  return (
    <>
      <SocketHandler />
      <NotificationPanel/>
      <Outlet />
       {/* Waiting Modal */}
       {creatingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="p-6 text-center bg-white rounded shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">
              {waitingMessage || "Please wait..."}
            </h2>
          </div>
        </div>
      )}
    </>
  );
}
