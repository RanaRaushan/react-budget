import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/ValidateToken';
import { useAuth } from '../hooks/AuthProvider';

export const RequireAuth = ({ children }) => {
  // console.log('RequireAuth || Inside RequireAuth start');
  const location = useLocation();
  const { token, logout } = useAuth();
  
  if (location.pathname !== '/login' && (!token || isTokenExpired(token))) {
    // console.log('RequireAuth || navigating to login??');
    return (
      <Navigate
        to={`/login?redirectTo=${location.pathname}`}
        state={{ redirectFrom: location }}
        replace={true}
      />
    );
  }
  if (!isTokenExpired(token) && location.pathname === '/login') {
    // console.log('RequireAuth || navigating to home');
    return (
      <Navigate to="/" state={{ redirectFrom: location }} replace={true} />
    );
  }
  // console.log('RequireAuth || Inside RequireAuth end token', token);
  return children;
};
