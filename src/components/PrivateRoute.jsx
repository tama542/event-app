// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If the user is not logged in, redirect them to the login page.
  // The location state is used to remember where the user intended to go.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Otherwise, render the protected content
  return children;
};

export default PrivateRoute;

