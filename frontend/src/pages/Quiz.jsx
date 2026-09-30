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
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Timer Bar (Sticky) */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-t-8 border-blue-600 rounded-lg p-4 flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{decodedRole} Interview Quiz</h1>
            <p className="text-sm text-gray-500 mt-1">Answer all questions to the best of your ability.</p>
          </div>
          <div className="text-center bg-gray-100 px-4 py-2 rounded-md border border-gray-200">
            <span className="block text-xs uppercase font-bold text-gray-500 tracking-wider mb-1">Time Remaining</span>
            <span className={`text-2xl font-mono font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-800'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {!submitted && questions.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            <p className="text-lg">No questions available for this role yet.</p>
            <p className="text-sm mt-2">Please ask an administrator to add some questions.</p>
            <button 
              onClick={() => navigate('/home')}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition"
            >
              Go Back
            </button>
          </div>
        )}

        {!submitted && questions.length > 0 && questions.map((q, index) => (
          <div key={q._id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              <span className="mr-2">{index + 1}.</span> {q.questionText}
            </h3>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <label 
                  key={i} 
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                    answers[q._id] === opt ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50 border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q._id}`}
                    value={opt}
                    checked={answers[q._id] === opt}
                    onChange={() => handleOptionChange(q._id, opt)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Form Controls */}
        {!submitted && questions.length > 0 && (
          <div className="flex justify-between items-center bg-transparent pt-4 pb-12">
            <button
              onClick={handleSave}
              className="text-blue-700 font-medium px-4 py-2 hover:bg-blue-100 rounded transition"
            >
              Save Progress
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`text-white font-medium px-8 py-2 rounded shadow transition flex items-center ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              ) : null}
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
