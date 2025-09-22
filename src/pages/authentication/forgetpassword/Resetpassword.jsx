import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPasswordValidationSchema } from "../../../component/formikvalidation/Validationschema";
import { AuthContext } from "../../../context/Authcontext";
import { toast } from "react-toastify"
import api from "../../../api/Api";

const Resetpassword = () => {
  const {
    showPassword,
    showNewPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useContext(AuthContext);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        email: values.email,
        currentPassword: values.oldPassword, // must match backend
        newPassword: values.newPassword,
      };

      const response = await api.post("/password/reset-password", payload);

      console.log("✅ Password reset successful:", response.data);
      toast.success("Password reset successfully!");
      resetForm();
    } catch (err) {
      console.error("❌ Reset password failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Password reset failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Formik
        initialValues={{
          email: "",
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }}
        validationSchema={resetPasswordValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Old Password */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-1">Old Password</label>
              <Field
                type={showPassword ? "text" : "password"}
                name="oldPassword"
                placeholder="Enter old password"
                className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-9 text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <ErrorMessage name="oldPassword" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            {/* New Password */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-1">New Password</label>
              <Field
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Enter new password"
                className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute right-3 top-9 text-gray-600"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <ErrorMessage name="newPassword" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Confirm New Password */}
            <div className="mb-6 relative">
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <Field
                type={showConfirmPassword ? "text" : "password"}
                name="confirmNewPassword"
                placeholder="Confirm new password"
                className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-9 text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <ErrorMessage
                name="confirmNewPassword"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="flex justify-end my-4">
              <Link className="text-blue-500 hover:text-blue-800" to="/login">
                Go To Login-page
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Resetpassword;
