import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import {
  BUDGET_ADD_FE_URL,
  BUDGET_FE_URL,
  BUDGET_UPLOAD_FE_URL,
  BUDGET_EXPENSES_EXP_FE_URL,
  BUDGET_BANK_FE_URL,
  BUDGET_HOME_FE_URL,
  BUDGET_INVESTMENT_FE_URL,
} from '../utils/APIHelper';
import LoginLogoutComponent from '../components/LoginLogout';
import { getCurrentYear } from '../utils/functionHelper';

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const buttonRef = useRef(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--base-font-size',
      `${fontSize}px`,
    );
  }, [fontSize]);

  const increaseSize = () => setFontSize((f) => Math.min(f + 2, 32));
  const decreaseSize = () => setFontSize((f) => Math.max(f - 2, 10));
  return (
    <div>
      <header
        ref={headerRef}
        className="bg-indigo-600 text-white fixed w-full top-0 left-0 z-10 shadow-md"
      >
        <div className="flex justify-between items-center p-4">
          <h1 className="text-[1.25em] font-bold flex-shrink-0 logo logo-spin">
            My App
          </h1>
          <nav className="flex space-x-6 mx-auto">            
            <button className="hover:text-indigo-200" onClick={()=>navigate(BUDGET_HOME_FE_URL)}>
                Home
            </button>
            <button className="hover:text-indigo-200" onClick={()=>navigate(BUDGET_INVESTMENT_FE_URL)}>
                Investment
            </button>
            <button className="hover:text-indigo-200" onClick={()=>navigate(`${BUDGET_BANK_FE_URL}?selectedYear=${getCurrentYear()}`)}>
                Bank
            </button>
            <div
              className="relative"
              onMouseEnter={() => setDropdownVisible(true)} // Show dropdown on hover
              onMouseLeave={() => setDropdownVisible(false)} // Hide dropdown when not hovering
            >
              <button className="hover:text-indigo-200" onClick={()=>navigate(BUDGET_FE_URL)}>
                  Budget
              </button>
              {/* Dropdown Menu */}
              {dropdownVisible && (
                <div
                  className="absolute bg-white text-gray-800 rounded-lg shadow-lg w-max top-full left-0 z-20 "
                  style={{
                    left:
                      buttonRef.current &&
                      buttonRef.current.getBoundingClientRect().left + 'px',
                    top:
                      buttonRef.current &&
                      buttonRef.current.getBoundingClientRect().bottom + 'px',
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
                    state={{ scrollTo: 'addBudget' }}
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

            <div className="fixed top-4 right-4 flex gap-2">
              <button
                onClick={increaseSize}
                className="px-3 py-1 border rounded"
              >
                A+
              </button>
              <button
                onClick={decreaseSize}
                className="px-3 py-1 border rounded"
              >
                A-
              </button>
            <LoginLogoutComponent />
            </div>
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
