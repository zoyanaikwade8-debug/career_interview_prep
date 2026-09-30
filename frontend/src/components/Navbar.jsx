import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  if (!userInfo) return null; // Don't show navbar on login/register if not authenticated

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">Interview Prep</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
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
                <span className="text-sm font-medium text-slate-900 hidden sm:block">
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
        </div>
      </div>
    </nav>
  );
}
