import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleRoleClick = (role) => {
    navigate(`/quiz/${encodeURIComponent(role)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
            Choose Your Career Path
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Select a department below to explore specific job roles and start your personalized interview preparation.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <div 
                key={dept._id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-slate-900">{dept.name}</h3>
                  {dept.description && (
                    <p className="text-sm text-gray-500 mt-2">{dept.description}</p>
                  )}
                </div>

                <div className="bg-gray-50 p-6 flex-grow">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                      Select Role ({dept.jobRoles.length})
                    </h4>
                    <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                      {dept.jobRoles.map((role, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRoleClick(role)}
                          className="text-left w-full px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:ring-1 hover:ring-blue-500 hover:text-blue-700 transition-all duration-200 text-sm font-medium text-gray-700 shadow-sm"
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
