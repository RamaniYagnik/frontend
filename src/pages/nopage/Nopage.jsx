import React from "react";
import { Link } from "react-router-dom";

const Nopage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="text-center">
                {/* Error Code */}
                <h1 className="text-9xl font-extrabold text-red-600 drop-shadow-lg">
                    404
                </h1>

                {/* Message */}
                <p className="text-2xl md:text-3xl font-semibold mt-4 text-gray-800">
                    Oops! Page not found
                </p>
                <p className="text-gray-500 mt-2">
                    The page you’re looking for doesn’t exist or has been moved.
                </p>

                {/* Button */}
                <div className="mt-6">
                    <Link
                        to="/"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
                    >
                        ⬅ Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Nopage;
