// Sidebar.jsx - Updated version
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile menu button */}
            <button
                className="lg:hidden fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div
                className={`h-screen w-64 bg-gray-800 text-white p-6 flex flex-col 
                fixed top-0 left-0 z-40 transform transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
            >
                <h2 className="text-xl font-bold mb-6">Menu</h2>

                {/* Always visible */}
                {auth.isAuthenticated && (
                    <>
                        <Link to="/dashboard" className="block py-2 px-3 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>
                            Dashboard
                        </Link>

                        <Link
                            to="/products"
                            className="block py-2 px-3 rounded hover:bg-gray-700"
                            onClick={() => setIsOpen(false)}
                        >
                            All Product List
                        </Link>
                    </>
                )}

                {auth.isAuthenticated && auth.userInfo.role === "sub-admin" && (

                    <Link
                        to="/subadminproducts"
                        className="block py-2 px-3 rounded hover:bg-gray-700"
                        onClick={() => setIsOpen(false)}>
                        Sub-Admin Products
                    </Link>

                )}

                {/* Only for Admin */}
                {auth.isAuthenticated && auth.userInfo.role === "admin" && (
                    <>
                        <Link
                            to="/allusers"
                            className="block py-2 px-3 rounded hover:bg-gray-700"
                            onClick={() => setIsOpen(false)}>
                            All users
                        </Link>
                        <Link
                            to="/categories"
                            className="block py-2 px-3 rounded hover:bg-gray-700"
                            onClick={() => setIsOpen(false)}>
                            Categories
                        </Link>
                    </>
                )}

                <div className="mt-auto">
                    <button
                        onClick={() => {
                            logout();
                            navigate("/login");
                            setIsOpen(false);
                        }}
                        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 w-full"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <button
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></button>
            )}
        </>
    );
};

export default Sidebar;