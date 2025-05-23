import { useAuth } from '../hooks/AuthProvider';
import { BiLogOut, BiLogIn } from "react-icons/bi";
import { useLocation, useNavigate } from 'react-router-dom';

const LoginLogoutComponent = () => {
    // const { token, removeToken } = useAuth();
    const auth = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const toShow = currentPath !== '/auth/callback';
    const handleLogout = () => {
      auth.removeToken();
      navigate('/login', {replace: true})
    };
    const handleLogin = () => {
      navigate('/login', {replace: true})
    };
    console.log("LoginLogoutComponent || redirectPathCHeck loginLogout", location, location.pathname, location.state)
    return !auth.token ? 
      <div className="absolute top-3 right-0 p-4 ">
          <button
            onClick={handleLogin}
            className="rounded-[55px] cursor-pointer text-xl font-inherit relative group"
          >
            <BiLogIn className="inline-block w-5 h-5" />
            <span className="absolute -top-5 right-2 rounded-inherit hidden group-hover:inline-block">
              Login
            </span>
          </button>
        </div>
    
    : auth.token && toShow && (
      // <div className='logout'>
      //   <button onClick={handleLogout}><BiLogOut /></button>
      // </div>

      <div className="absolute top-3 right-0 p-4 ">
        <button
          onClick={handleLogout}
          className="rounded-[55px] cursor-pointer text-xl font-inherit relative group"
        >
          <BiLogOut className="inline-block w-5 h-5" />
          <span className="absolute -top-5 right-2 rounded-inherit hidden group-hover:inline-block">
            Logout
          </span>
        </button>
      </div>

    );
};
export default LoginLogoutComponent;