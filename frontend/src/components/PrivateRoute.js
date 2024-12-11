import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PrivateRoute = ({ children }) => {
  const { user } = useUser();  // Correct access to the user

  if (!user.user_id) {  // Check if the user is logged in based on their user.id
    alert("You need to login first!");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
