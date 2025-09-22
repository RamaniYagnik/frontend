import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { signupValidationSchema } from "../../../component/formikvalidation/Validationschema";
import { AuthContext } from "../../../context/AuthContext";

export default function SignupForm() {
  const navigate = useNavigate();
  const { createUser,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility, } = useContext(AuthContext);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const response = await createUser("/users", {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: "user",
      });

      toast.success(response.message || "User registered successfully!");
      resetForm();
      navigate("/login");
    } catch (error) {
      // Display backend error message
      const errorMsg =
        error.response?.data?.message || "Failed to register user. Try again!";
      toast.error(errorMsg);
      console.error("Error registering user:", error.response || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={signupValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

            {/* Name */}
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Name</label>
              <Field
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Email</label>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Password */}
            <div className="mb-4 relative">
              <label className="block mb-1 text-gray-700">Password</label>
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 pr-10"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-9 cursor-pointer text-gray-600 bg-transparent border-none p-0"
                onClick={togglePasswordVisibility}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    togglePasswordVisibility();
                  }
                }}
                tabIndex={0}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4 relative">
              <label className="block mb-1 text-gray-700">Confirm Password</label>
              <Field
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 pr-10"
              />
              <button
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <ErrorMessage
                name="confirmPassword"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="mt-6">
              <p className="text-end">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 text-xs">
                  Login
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}