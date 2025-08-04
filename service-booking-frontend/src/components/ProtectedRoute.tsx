
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: JSX.Element;
  requiredRole?: 'CLIENT' | 'PROVIDER'; 
}

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const { isLoggedIn, role,loading} = useAuth();
   if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
