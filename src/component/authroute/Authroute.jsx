import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";

const AuthRoute = ({ children, type = "protected", role }) => {
  const { auth } = useContext(AuthContext);

  if (type === "protected") {
    if (!auth.isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (role && auth.userInfo.role !== role) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (type === "public") {
    if (auth.isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default AuthRoute;
