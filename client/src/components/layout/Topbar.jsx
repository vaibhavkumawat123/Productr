import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { SquarePen, LogOut, Handbag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const confirmLogout = async () => {
    setLoggingOut(true);

    setTimeout(() => {
      logout();
      setLoggingOut(false);
      setShowLogoutDialog(false);
      navigate("/auth/login");
    }, 1200);
  };


  return (
    <header
      className="
    flex items-center justify-between px-8 py-3
    bg-gradient-to-r
    from-[#fff7f3]
    via-[#fbfbff]
    to-[#f1f6ff]
    border-b border-gray-200
    relative
  "
    >
      <div className="flex items-center">
        {location.pathname === "/dashboard/products" && (
          <div
            className="
            flex gap-2.5
      px-4 py-1.5
      rounded-full
      bg-blue-100
      font-semibold
    "
          >
            <Handbag />
            Products
          </div>
        )}
      </div>

      <div className="relative" ref={dropdownRef}>
        {/* TOPBAR PROFILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3"
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-blue-600">
            {user?.avatar ? (
              <img
                src={`http://localhost:5000${user.avatar}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold">
                {user?.userName?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>

          {/* Arrow */}
          <span className="text-gray-600 text-sm">▾</span>
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 mt-3 w-64 bg-white border rounded-xl shadow-lg z-50">
            {/* USER INFO */}
            <div className="p-4 border-b">
              <p className="font-semibold text-gray-800">
                {user?.userName || "User"}
              </p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            {/* ACTIONS */}
            <div className="p-2">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/dashboard/profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700"
              >
                <SquarePen size={16} />
                Edit Profile
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  setShowLogoutDialog(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-red-50 text-red-600 text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-[360px] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800">
              Logout Confirmation
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutDialog(false)}
                disabled={loggingOut}
                className="px-4 py-2 rounded-md text-sm border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                disabled={loggingOut}
                className="px-4 py-2 rounded-md text-sm text-white bg-red-600 hover:bg-red-700 flex items-center gap-2"
              >
                {loggingOut && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;
