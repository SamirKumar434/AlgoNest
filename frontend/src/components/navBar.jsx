import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import axiosClient from '../utils/axiosClient';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      // Call backend logout API
      await axiosClient.post('/user/logout');
      
      // Clear Redux state
      dispatch(logoutUser());
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear cookies
      document.cookie.split(";").forEach(c => {
        document.cookie = c.replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Clear axios headers
      delete axiosClient.defaults.headers.common['Authorization'];
      
      // Force redirect to login (full page reload to clear all state)
      navigate('/');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API fails
      dispatch(logoutUser());
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  // Updated paths
  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Problems', path: '/problems' },
    { name: 'Visualize', path: 'https://algoflickv2.netlify.app/', isExternal: true },
    { name: 'Contact Us', path: '#contact', isScroll: true },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 p-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        
        {/* Logo */}
        <div className={`transition-all duration-500 transform ${isScrolled ? 'opacity-0 -translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
            <span className="text-orange-500">{"<>"}</span> AlgoNest
          </Link>
        </div>

        {/* Navigation Pill */}
        <div className={`flex items-center gap-1 p-1.5 rounded-full border border-white/10 bg-[#1a1a1a]/80 backdrop-blur-md transition-all duration-500 ${isScrolled ? 'mx-auto' : ''}`}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            // Render external link for Visualize
            if (item.isExternal) {
              return (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  {item.name}
                </a>
              );
            }

            // Render scroll link for Contact Us
            if (item.isScroll) {
              return (
                <a
                  key={item.name}
                  href={item.path}
                  className="px-6 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  {item.name}
                </a>
              );
            }

            // Render standard internal Link
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Auth UI */}
        <div className={`transition-all duration-500 transform ${isScrolled ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-white text-sm font-medium px-4 hover:text-orange-500 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="btn btn-sm h-10 bg-orange-600 hover:bg-orange-700 border-none text-white rounded-full px-6 transition-colors">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 text-white flex items-center justify-center text-lg font-bold">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow-2xl bg-[#0d0d0d] border border-white/10 rounded-2xl w-52 mt-4">
                <li className="mb-2 px-3 py-2">
                  <div className="text-sm text-gray-400">Signed in as</div>
                  <div className="font-bold text-white">{user?.firstName}</div>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <Link to="/profile" className="py-3 hover:bg-white/5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                </li>
                {user?.role === 'admin' && (
                  <li>
                    <Link to="/admin" className="py-3 hover:bg-white/5 text-orange-500 font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Admin Panel
                    </Link>
                  </li>
                )}
                <div className="divider my-1"></div>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="py-3 text-red-500 hover:bg-white/5 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;