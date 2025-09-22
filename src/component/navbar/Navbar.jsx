import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";

const Navbar = () => {

    const { auth } = useContext(AuthContext);

    return (
        <nav className=" p-4 rounded-3xl m-2">
            <div className="container mx-auto flex justify-center items-center">
                <ul className="flex space-x-6">
                    <li>
                        <Link
                            to="/dashboard"
                            className=" font-semibold hover:text-yellow-400 transition"
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/products"
                            className=" font-semibold hover:text-yellow-400 transition"
                        >
                            Products
                        </Link>
                    </li>
                    {
                        auth.role === "admin" && (
                            <li>
                                <Link
                                    to="/categories"
                                    className=" font-semibold hover:text-yellow-400 transition"
                                >
                                    Categories
                                </Link>
                            </li>
                        )
                    }
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
