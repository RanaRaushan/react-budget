import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { validateToken } from "../utils/ValidateToken";
import { useAuth } from "../hooks/AuthProvider";

export const RequireAuth = ({ children }) => {
  console.log("RequireAuth || Inside RequireAuth start")
  const { token, logout } = useAuth();
  const location = useLocation();
  console.log("RequireAuth || ", location, location.pathname)
  if (location.pathname !== "/login" && (!token || !validateToken(token))) {
    console.log("RequireAuth || navigating to login??")
    return <Navigate to={'/login'} state={{redirectFrom:location}} replace={true}/>;
  }
  if (validateToken(token) && location.pathname === "/login") {
    console.log("RequireAuth || navigating to home")
    return <Navigate to="/" state={{redirectFrom:location}} replace={true} />;
  }
  console.log("RequireAuth || token", token)
  console.log("RequireAuth || Inside RequireAuth end")
  return children;
};