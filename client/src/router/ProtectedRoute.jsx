import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../utils/auth";

function ProtectedRoute({ roles = [] }) {
  const auth = getUser();
  return roles.includes(auth?.role) || auth?.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
}

export default ProtectedRoute;
