import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [departments, setDepartments] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, resultsRes] = await Promise.all([
          api.get('/departments'),
          api.get('/results')
        ]);
        setDepartments(deptRes.data);
        setRecentResults(resultsRes.data.slice(0, 3)); // Just show top 3 recent
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoleClick = (role) => {
    navigate(`/interview/${encodeURIComponent(role)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Profile Summary Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md flex-shrink-0">
            {userInfo.profilePicture ? (
              <img src={userInfo.profilePicture} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-blue-600 uppercase">
                {userInfo.firstName?.charAt(0)}{userInfo.surname?.charAt(0)}
              </span>
            )}
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {userInfo.firstName}!</h1>
            <p className="text-gray-500 mt-1">Ready to ace your next technical interview?</p>
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-slate-50 px-5 py-3 rounded-xl border border-gray-100">
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Sessions</span>
                <span className="text-2xl font-bold text-slate-900">{recentResults.length > 0 ? 'Active' : '0'}</span>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="bg-white border border-gray-300 text-gray-700 px-5 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm flex items-center"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Interview Tracks */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4">Select Interview Track</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {departments.map((dept) => (
                  <div key={dept._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
                    <div className="p-5 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-slate-900">{dept.name}</h3>
                      {dept.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{dept.description}</p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-5 flex-grow">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Available Roles ({dept.jobRoles.length})
                      </h4>
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                        {dept.jobRoles.map((role, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleRoleClick(role)}
                            className="text-left w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:ring-1 hover:ring-blue-500 hover:text-blue-700 transition-all duration-200 text-sm font-medium text-gray-700 shadow-sm"
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Recent Activity */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4">Recent Activity</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              {recentResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No recent activity.</p>
                  <p className="text-xs mt-1">Start a track to see your history!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentResults.map((res) => {
                    const dateObj = new Date(res.createdAt);
                    return (
                      <div key={res._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold text-slate-900">{res.jobRole}</h4>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {res.score}/{res.totalQuestions} pts
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {dateObj.toLocaleDateString()}
                        </p>
                      </div>
                    )
                  })}
                  <button 
                    onClick={() => navigate('/performance')}
                    className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 pt-2 transition-colors"
                  >
                    View All History &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
