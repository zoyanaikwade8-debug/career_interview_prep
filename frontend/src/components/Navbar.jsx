import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!userInfo) return null; // Don't show navbar on login/register if not authenticated

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            <Link to="/dashboard" onClick={closeMobileMenu} className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">Interview Prep</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/performance" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
              My Performance
            </Link>
            <Link to="/admin" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
              Question Bank
            </Link>
            
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
              <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
                {userInfo.profilePicture ? (
                  <img src={userInfo.profilePicture} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    {userInfo.firstName?.charAt(0)}{userInfo.surname?.charAt(0)}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-900">
                  {userInfo.firstName} {userInfo.surname}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg absolute top-16 left-0 w-full z-40">
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3">
            <Link 
              to="/profile" 
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-gray-50"
            >
              {userInfo.profilePicture ? (
                <img src={userInfo.profilePicture} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {userInfo.firstName?.charAt(0)}{userInfo.surname?.charAt(0)}
                </div>
              )}
              <span className="text-base font-medium text-slate-900">
                {userInfo.firstName} {userInfo.surname}
              </span>
            </Link>
            
            <Link 
              to="/performance" 
              onClick={closeMobileMenu}
              className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
            >
              My Performance
            </Link>
            
            <Link 
              to="/admin" 
              onClick={closeMobileMenu}
              className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
            >
              Question Bank
            </Link>
            
            <div className="border-t border-gray-200 pt-2 mt-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
