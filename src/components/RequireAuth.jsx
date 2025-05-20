import { Navigate, useLocation } from "react-router-dom";
import { validateToken } from "../utils/ValidateToken";
import { useAuth } from "../hooks/AuthProvider";

export const RequireAuth = ({ children }) => {
  console.log("Inside RequireAuth start")
  const { token, logout } = useAuth();
  const prevLocation = useLocation();
  console.log("validation",location, token)
  if (location.pathname !== "/login" && (!token || !validateToken(token))) {
    return <Navigate to={'/login?'} state={prevLocation} />;
  }
  if (validateToken(token) && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }
  console.log("RequireAuth | token", token)
  console.log("Inside RequireAuth end")
  return children;
};