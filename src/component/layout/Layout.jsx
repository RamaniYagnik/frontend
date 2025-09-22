import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 min-h-screen bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
