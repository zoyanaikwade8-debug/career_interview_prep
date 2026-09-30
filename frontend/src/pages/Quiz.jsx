import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Quiz() {
  const { role } = useParams();
  const navigate = useNavigate();
  const decodedRole = decodeURIComponent(role);
  
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/questions/role/${encodeURIComponent(decodedRole)}`);
        setQuestions(res.data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [decodedRole]);

  useEffect(() => {
    if (loading || submitted) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [loading, submitted]);

  const handleOptionChange = (questionId, option) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSave = () => {
    alert('Progress saved successfully!');
  };

  const handleSubmit = async () => {
    if (submitted || isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const res = await api.post('/results', {
        jobRole: decodedRole,
        answers
      });

      setSubmitted(true);
      navigate('/results', { 
        state: { 
          score: res.data.score, 
          total: res.data.total, 
          jobRole: decodedRole 
        } 
      });

    } catch (error) {
      console.error('Failed to submit results:', error);
      alert('Failed to submit results. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Timer Bar (Sticky) */}
        <div className="sticky top-20 z-10 bg-white shadow-sm border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{decodedRole} Assessment</h1>
            <p className="text-sm text-gray-500 mt-1">Select the best answer for each question.</p>
          </div>
          <div className="text-center bg-slate-50 px-5 py-3 rounded-xl border border-gray-200 min-w-[140px]">
            <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Time Remaining</span>
            <span className={`text-2xl font-mono font-bold tracking-tight ${timeLeft < 300 ? 'text-red-600' : 'text-slate-900'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {!submitted && questions.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
            <p className="text-lg font-medium text-slate-900">No questions available</p>
            <p className="text-sm mt-2 mb-6">Please ask an administrator to add questions for this role.</p>
            <button 
              onClick={() => navigate('/home')}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {!submitted && questions.length > 0 && questions.map((q, index) => (
          <div key={q._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-shadow hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-5 leading-relaxed">
              <span className="text-blue-600 mr-2">{index + 1}.</span> {q.questionText}
            </h3>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <label 
                  key={i} 
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    answers[q._id] === opt ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600' : 'hover:bg-slate-50 border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q._id}`}
                    value={opt}
                    checked={answers[q._id] === opt}
                    onChange={() => handleOptionChange(q._id, opt)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300"
                  />
                  <span className={`ml-3 text-sm font-medium ${answers[q._id] === opt ? 'text-blue-900' : 'text-gray-700'}`}>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Form Controls */}
        {!submitted && questions.length > 0 && (
          <div className="flex justify-between items-center bg-transparent pt-6 pb-16">
            <button
              onClick={handleSave}
              className="text-gray-500 font-medium px-5 py-2.5 rounded-lg hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-sm"
            >
              Save Progress
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`text-white font-medium px-8 py-3 rounded-lg shadow-sm transition-all flex items-center text-sm ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'}`}
            >
              {isSubmitting ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              ) : null}
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
