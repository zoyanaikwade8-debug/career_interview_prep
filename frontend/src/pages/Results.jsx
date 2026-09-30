import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { score, total, jobRole, details } = location.state || { score: 0, total: 0, jobRole: 'Unknown Role', details: [] };
  
  // Guard if users navigate directly
  useEffect(() => {
    if (!location.state) {
      navigate('/dashboard');
    }
  }, [location.state, navigate]);

  const percentage = total > 0 ? (score / total) * 100 : 0;
  
  let progressLevel = '';
  let feedbackMessage = '';
  let colorClass = '';
  let bgClass = '';

  if (percentage >= 80) {
    progressLevel = 'Expert';
    feedbackMessage = 'Outstanding! You have a solid grasp of these concepts and are well-prepared.';
    colorClass = 'text-green-700';
    bgClass = 'bg-green-50 border-green-200';
  } else if (percentage >= 50) {
    progressLevel = 'Intermediate';
    feedbackMessage = 'Good effort! Review the questions you missed below to sharpen your skills.';
    colorClass = 'text-yellow-700';
    bgClass = 'bg-yellow-50 border-yellow-200';
  } else {
    progressLevel = 'Beginner';
    feedbackMessage = 'Keep practicing! Focus on the detailed feedback below to improve your foundation.';
    colorClass = 'text-red-700';
    bgClass = 'bg-red-50 border-red-200';
  }

  if (!location.state) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Top Summary Card */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Interview Evaluation</h1>
          <h2 className="text-md text-gray-500 mb-8 font-medium">Track: <span className="text-slate-800">{jobRole}</span></h2>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 w-full sm:w-48 shadow-sm">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Final Score</p>
              <p className="text-5xl font-black text-slate-900">{score}<span className="text-2xl text-gray-400 font-medium">/{total}</span></p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 w-full sm:w-48 shadow-sm">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Proficiency</p>
              <p className={`text-xl font-bold ${colorClass}`}>{progressLevel}</p>
            </div>
          </div>

          <div className={`p-5 rounded-xl border ${bgClass}`}>
            <p className={`text-sm font-medium ${colorClass}`}>
              {feedbackMessage}
            </p>
          </div>
        </div>

        {/* Detailed Review Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-bold text-slate-900">Detailed Review</h3>
            <p className="text-xs text-gray-500 mt-1">Review your answers against the expected models.</p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {details && details.length > 0 ? (
              details.map((item, idx) => (
                <div key={idx} className="p-8">
                  <h4 className="text-sm font-semibold text-slate-900 mb-4 leading-relaxed">
                    <span className="text-gray-400 mr-2">Q{idx + 1}.</span> {item.questionText}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border ${item.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Your Answer</p>
                      <p className={`text-sm font-medium ${item.isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                        {item.submittedAnswer || (
                          <span className="italic text-gray-500">Skipped / No Answer</span>
                        )}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1">
                        {item.isCorrect ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-200 text-green-800">Correct</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-red-200 text-red-800">Incorrect</span>
                        )}
                      </div>
                    </div>
                    
                    {!item.isCorrect && (
                      <div className="p-4 rounded-xl border bg-blue-50 border-blue-200">
                        <p className="text-[10px] uppercase font-bold text-blue-500 tracking-wider mb-2">Expected Model Answer</p>
                        <p className="text-sm font-medium text-blue-900">
                          {item.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                Detailed review is not available for this session.
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 pt-4 pb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={() => navigate(`/interview/${encodeURIComponent(jobRole)}`)}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all shadow-sm text-sm"
          >
            Retake Track
          </button>
        </div>
      </div>
    </div>
  );
}
