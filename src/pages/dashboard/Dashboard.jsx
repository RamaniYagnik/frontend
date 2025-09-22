import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";
import {
  FaBoxOpen,
  FaUsers,
  FaTags,
  FaLockOpen,
  FaUnlockAlt,
  FaUserCircle,
} from "react-icons/fa";

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const role = auth?.userInfo?.role;
  const name = auth?.userInfo?.name;
  const email = auth?.userInfo?.email;
  const navigate = useNavigate();

  const cards = [
    {
      label: "Products",
      path: "/products",
      icon: <FaBoxOpen className="text-3xl text-blue-600" />,
    },
    // ✅ Only Admin & Sub-Admin can see Categories
    ...(role === "admin"
      ? [
        {
          label: "Categories",
          path: "/categories",
          icon: <FaTags className="text-3xl text-green-600" />,
        },
        {
          label: "All Users",
          path: "/allusers",
          icon: <FaUsers className="text-3xl text-purple-600" />,
        },
      ]
      : []),
    {
      label: "Forgot Password",
      path: "/forgetpassword",
      icon: <FaLockOpen className="text-3xl text-red-600" />,
    },
    {
      label: "Reset Password",
      path: "/resetpassword",
      icon: <FaUnlockAlt className="text-3xl text-yellow-600" />,
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="p-6">
      {/* ✅ User Info Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <FaUserCircle className="text-6xl text-gray-700 mb-3" />
        <h2 className="text-lg font-semibold text-gray-800">
          Name :- {name || "Guest User"}
        </h2>
        <p className="text-sm text-gray-500">Email :- {email || "No email"}</p>
        <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-md">
          Role :- {role || "User"}
        </span>
      </div>

      {/* Dashboard Title */}
      <h1 className="text-3xl font-bold mb-4 text-center">
        Welcome to Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
        {cards.map((card) => (
          <div
            key={card.label}
            onClick={() => handleCardClick(card.path)}
            className="cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col items-center justify-center text-center"
          >
            {card.icon}
            <p className="mt-4 text-lg font-semibold text-gray-700">
              {card.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
