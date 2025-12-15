import React from "react";
import { NavLink } from "react-router-dom";
import { House, Package } from "lucide-react";
import logo from "../../assets/logo.png"

const Sidebar = () => {
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-md ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-300 hover:bg-gray-800/30"
    }`;

  return (
    <aside className="w-64 bg-[#141820] min-h-screen text-white p-4">
      {/* LOGO */}
      <div className="flex items-center justify-center mb-6">
        <img
          src={logo}
          alt="logo"
          className="w-41 h-auto object-contain"
        />
      </div>

      <div className="space-y-1">
        <NavLink to="/dashboard/home" className={navClass}>
          <span className="w-6 text-center">
            {" "}
            <House />
          </span>
          <span>Home</span>
        </NavLink>

        <NavLink to="/dashboard/products" className={navClass}>
          <span className="w-6 text-center">
            <Package />
          </span>
          <span>Products</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
