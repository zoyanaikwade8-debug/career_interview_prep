import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { score, total, jobRole } = location.state || { score: 0, total: 0, jobRole: 'Unknown Role' };
  
  // Guard if users navigate directly
  useEffect(() => {
    if (!location.state) {
      navigate('/home');
    }
  }, [location.state, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const percentage = total > 0 ? (score / total) * 100 : 0;
  
  let progressLevel = '';
  let feedbackMessage = '';
  let colorClass = '';

  if (percentage >= 80) {
    progressLevel = 'Expert';
    feedbackMessage = 'Great job! You are on the right track for this role! Your foundation is incredibly strong.';
    colorClass = 'text-green-600';
  } else if (percentage >= 50) {
    progressLevel = 'Intermediate';
    feedbackMessage = 'Good effort! You have a solid grasp but could brush up on a few advanced topics to stand out.';
    colorClass = 'text-yellow-600';
  } else {
    progressLevel = 'Beginner';
    feedbackMessage = 'Keep practicing! Review the core concepts for this role and try again. Every attempt makes you better!';
    colorClass = 'text-red-500';
  }

  if (!location.state) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-4">
      <div className="max-w-2xl w-full bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center relative overflow-hidden">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Assessment Complete</h1>
        <h2 className="text-lg text-gray-500 mb-10 font-medium">Role: <span className="text-slate-800">{jobRole}</span></h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-10">
          <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200 w-full md:w-56 transition-transform hover:scale-105">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Final Score</p>
            <p className="text-5xl font-black text-slate-900">{score}<span className="text-2xl text-gray-400 font-medium">/{total}</span></p>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200 w-full md:w-56 transition-transform hover:scale-105">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Proficiency</p>
            <p className={`text-2xl font-bold ${colorClass}`}>{progressLevel}</p>
          </div>
        </div>

        <div className={`p-6 rounded-xl mb-12 ${percentage >= 80 ? 'bg-green-50/50 border border-green-100' : percentage >= 50 ? 'bg-yellow-50/50 border border-yellow-100' : 'bg-red-50/50 border border-red-100'}`}>
          <p className={`text-lg font-medium leading-relaxed ${colorClass}`}>
            "{feedbackMessage}"
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate('/home')}
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all shadow-sm text-sm"
          >
            Return to Dashboard
          </button>
          <button 
            onClick={() => navigate(`/quiz/${encodeURIComponent(jobRole)}`)}
            className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
