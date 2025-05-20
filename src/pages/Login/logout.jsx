import { useAuth } from '../../hooks/AuthProvider';
import './login.css';
import './logout.css';
import { BiLogOut  } from "react-icons/bi";
import { useLocation } from 'react-router-dom';

const LogoutPage = () => {
    const { token, logout } = useAuth();
    const location = useLocation();
    const currentPath = location.pathname;
    const toShow = currentPath !== '/auth/callback';
    const handleLogout = () => {
      logout();
    };
  
    return token && toShow && (
      <div className='logout'>
        <button onClick={handleLogout}><BiLogOut /></button>
      </div>
    );
};
export default LogoutPage;