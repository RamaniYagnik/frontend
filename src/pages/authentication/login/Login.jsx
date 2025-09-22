import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginValidationSchema } from "../../../component/formikvalidation/Validationschema";
import { AuthContext } from "../../../context/Authcontext";

const Login = () => {
  const navigate = useNavigate();

  const { createUser, login, showPassword, togglePasswordVisibility, } = useContext(AuthContext);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Call backend login API
      const response = await createUser("/users/login", {
        email: values.email,
        password: values.password,
      });

      console.log("Login response:", response); // Debug log

      // ✅ Correct destructuring based on your backend response
      const { message, data } = response;
      const { accessToken, refreshToken, user } = data;

      // Save tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      console.log("Access Token saved:", accessToken); // Debug log

      localStorage.setItem("refreshToken", refreshToken);

      const userInfo = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      // Update auth context with user role
      login(userInfo, accessToken, refreshToken);

      toast.success(message || "Login successful!");
      navigate("/dashboard");
    } catch (err) {
      // Handle different error response structures
      let errorMsg = "Invalid email or password";

      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }

      toast.error(errorMsg);
      console.error("Login Error:", err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-8 rounded-2xl shadow-lg w-96">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email
              </label>
              <Field
                id="email"
                type="email"
                name="email"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter your email"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Password */}
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-gray-700 mb-1">
                Password
              </label>
              <Field
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full px-4 py-2 border rounded-lg pr-10"
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Forget Password */}
            <div className="flex justify-between mb-4">
              <Link className="text-blue-600" to="/forgetpassword">
                Forget Password
              </Link>
              <Link className="text-blue-600" to="/resetpassword">
                Reset Password
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <div className="mt-6">
              <p className="text-end">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-500 text-xs">
                  Signup
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;