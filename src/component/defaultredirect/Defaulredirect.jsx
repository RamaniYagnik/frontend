// src/DefaultRedirect.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";

const DefaultRedirect = () => {
  const { auth } = useContext(AuthContext);

  return auth?.isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default DefaultRedirect;
