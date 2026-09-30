import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [departments, setDepartments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/departments');
        setDepartments(res.data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleRoleClick = (role) => {
    navigate(`/quiz/${encodeURIComponent(role)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold tracking-wider text-blue-700">
              CAREER INTERVIEW PREP
            </h1>
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 font-medium transition duration-150"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Career Path
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Select a department below to explore specific job roles and start your personalized interview preparation.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {departments.map((dept) => (
              <div 
                key={dept._id} 
                className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${
                  expandedId === dept._id ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-200 hover:shadow-md'
                }`}
              >
                {/* Department Header */}
                <div 
                  className="px-6 py-5 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleExpand(dept._id)}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{dept.name}</h3>
                    {dept.description && (
                      <p className="text-sm text-gray-500 mt-1">{dept.description}</p>
                    )}
                  </div>
                  <div className={`transform transition-transform duration-300 ${expandedId === dept._id ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Job Roles Grid */}
                {expandedId === dept._id && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4 bg-gray-50/50 rounded-b-xl">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                      Available Job Roles ({dept.jobRoles.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {dept.jobRoles.map((role, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRoleClick(role)}
                          className="text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <span className="font-medium">{role}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
