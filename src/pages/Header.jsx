import React, { useState, useRef, useEffect  } from "react";
import { Link } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import { BUDGET_ADD_FE_URL, BUDGET_FE_URL, BUDGET_UPLOAD_FE_URL, BUDGET_EXPENSES_EXP_FE_URL } from "../utils/APIHelper";
import LoginLogoutComponent from "../components/LoginLogout";

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const buttonRef = useRef(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <div >
      <header ref={headerRef} className="bg-indigo-600 text-white fixed w-full top-0 left-0 z-10 shadow-md">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-bold flex-shrink-0 logo logo-spin">My App</h1>
          <nav className="flex space-x-6 mx-auto">
            <button className="hover:text-indigo-200" >
              <Link to="/" 
                style={{color: 'inherit'}}
                >
                  Home
              </Link>
            </button>
            <button className="hover:text-indigo-200" >
              <Link to="/" 
                style={{color: 'inherit'}}
                >
                  Bank
              </Link>
            </button>
            <div className="relative" 
                    onMouseEnter={() => setDropdownVisible(true)} // Show dropdown on hover
                    onMouseLeave={() => setDropdownVisible(false)} // Hide dropdown when not hovering
                    >
              <button className="hover:text-indigo-200">
                <Link to={BUDGET_FE_URL} 
                  style={{color: 'inherit'}}
                  >
                    Budget
                </Link>
              </button>
              {/* Dropdown Menu */}
              {dropdownVisible && (
                  <div
                    className="absolute bg-white text-gray-800 rounded-lg shadow-lg w-max top-full left-0 z-20 "
                    style={{
                      left:
                        buttonRef.current && buttonRef.current.getBoundingClientRect().left + "px",
                      top:
                        buttonRef.current && buttonRef.current.getBoundingClientRect().bottom + "px",
                    }}
                  >
                    <Link
                      to={BUDGET_EXPENSES_EXP_FE_URL}
                      className="block px-4 py-2 hover:bg-indigo-100 rounded-md"
                    >
                      Expenses
                    </Link>
                    <Link
                      to={BUDGET_ADD_FE_URL}
                      state={{ scrollTo: 'add' }}
                      className="block px-4 py-2 hover:bg-indigo-100 rounded-md"
                    >
                      Add Budget
                    </Link>
                    <Link
                      to={BUDGET_UPLOAD_FE_URL}
                      className="block px-4 py-2 hover:bg-indigo-100 rounded-md"
                    >
                      Upload Budget
                    </Link>
                  </div>
                )}
            </div>
            <LoginLogoutComponent/>
          </nav>
        </div>
      </header>
      <main style={{ paddingTop: headerHeight }}>
        <Outlet />
      </main>
    </div>
  );
};


export default Header;
