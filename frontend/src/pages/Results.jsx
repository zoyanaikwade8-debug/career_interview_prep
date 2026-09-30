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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white p-10 rounded-2xl shadow-xl text-center border-t-8 border-blue-600">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Quiz Results</h1>
        <h2 className="text-xl text-gray-500 mb-8 font-medium">Role: {jobRole}</h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-10">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm w-48">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Final Score</p>
            <p className="text-5xl font-black text-gray-800">{score}<span className="text-3xl text-gray-400">/{total}</span></p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm w-48">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Progress Level</p>
            <p className={`text-2xl font-bold ${colorClass}`}>{progressLevel}</p>
          </div>
        </div>

        <div className={`p-6 rounded-lg mb-10 ${percentage >= 80 ? 'bg-green-50 border border-green-200' : percentage >= 50 ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-lg font-medium ${colorClass}`}>
            "{feedbackMessage}"
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate('/home')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            Return to Dashboard
          </button>
          <button 
            onClick={handleLogout}
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
