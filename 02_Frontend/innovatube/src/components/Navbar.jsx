import { useState, useContext, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { authState, logout, getDecodedToken } = useContext(AuthContext);

  const [showNav, setShowNav] = useState(false);

  const decodedToken = getDecodedToken();
  const user = decodedToken ? decodedToken.Username : null;

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const handleNavLinkClick = () => {
    setShowNav(false);
  };

  const handleToggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full shadow bg-white border-gray-200">
        <div className="max-w-screen-xl relative flex flex-wrap items-center justify-between mx-auto p-4">
          <NavLink to="/home" className="italic font-semibold flex items-center space-x-3 rtl:space-x-reverse">
            INNOVATUBE
          </NavLink>
          {authState.isAuthenticated && (
            <>
              <div className="flex md:order-2">
                <button
                  onClick={() => setShowNav(!showNav)}
                  className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400  dark:focus:ring-gray-600"
                  aria-label="Open main menu"
                >
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                  </svg>
                </button>
              </div>
              <div className="relative md:order-3 ml-auto mr-2 hidden md:block" ref={profileMenuRef}>
                <button onClick={handleToggleProfileMenu} className="flex items-center space-x-2 text-gray-900 hover:text-pink-600">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 21c0-4 7-5 9-5s9 1 9 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{user}</span>
                </button>
                {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
                        <ul className="py-1 text-gray-700">
                            <li>
                                <button
                                    onClick={logout}
                                    className="flex items-center w-full text-left px-4 py-2 hover:bg-pink-100 space-x-2"
                                >
                                    <svg
                                        className="w-5 h-5 text-gray-900"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                                    </svg>
                                    <span>Cerrar Sesión</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    )}
              </div>
              <div
                className="hidden md:flex md:order-1 absolute left-1/2 transform -translate-x-1/2"
                id="navbar-search"
              >
                <ul className="flex flex-row space-x-8 font-medium">
                  <li>
                    <NavLink
                      to="/home"
                      className={({ isActive }) =>
                        `block py-2 md:px-3 italic ${
                          isActive ? 'text-pink-600' : 'text-gray-900 dark:text-black hover:text-pink-600'
                        } md:hover:text-pink-600 dark:hover:bg-white`
                      }
                    >
                      Inicio
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/favorites"
                      className={({ isActive }) =>
                        `block py-2 md:px-3 italic ${
                          isActive ? 'text-pink-600' : 'text-gray-900 dark:text-black hover:text-pink-600'
                        } md:hover:text-pink-600 dark:hover:bg-white`
                      }
                    >
                      Favoritos
                    </NavLink>
                  </li>
                </ul>
              </div>
              {showNav && (
                <div className="fixed inset-y-0 right-0 w-80 h-screen p-4 overflow-y-auto transition-transform bg-white ">
                  <button
                    onClick={() => setShowNav(false)}
                    className="items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-label="Close menu"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                  <NavLink to="/home" className="italic font-semibold flex items-center space-x-3 rtl:space-x-reverse mb-6">
                    Innovatube
                  </NavLink>
                  <ul className="flex flex-col justify-end px-4 md:p-0 mt-4 font-medium rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:bg-white ">
                    <NavLink to="/home" onClick={handleNavLinkClick}>
                      <li className="flex items-center space-x-4 cursor-pointer">
                        <svg
                          className="w-5 h-5 text-gray-950"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        <span className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 italic">
                          Inicio
                        </span>
                      </li>
                    </NavLink>
                    <NavLink to="/favorites" onClick={handleNavLinkClick}>
                        <li className="flex items-center space-x-4 cursor-pointer">
                            <svg
                                className="w-5 h-5 text-gray-950"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                            </svg>
                            <span className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 italic">
                                Favoritos
                            </span>
                        </li>
                    </NavLink>
                    <NavLink to="/favorites" onClick={logout}>
                        <li className="flex items-center space-x-4 cursor-pointer">
                            <svg
                                className="w-5 h-5 text-gray-950"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                            </svg>
                            <span className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 italic">
                                Cerrar Sesión
                            </span>
                        </li>
                    </NavLink>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
