import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function AdminDashboard() {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    department: '',
    jobRole: '',
    questionText: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: ''
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      const res = await api.get('/questions');
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    const payload = {
      department: formData.department,
      jobRole: formData.jobRole,
      questionText: formData.questionText,
      options: [formData.option1, formData.option2, formData.option3, formData.option4],
      correctAnswer: formData.correctAnswer
    };

    try {
      if (editId) {
        await api.put(`/questions/${editId}`, payload);
        setMessage('Question updated successfully!');
      } else {
        await api.post('/questions', payload);
        setMessage('Question added successfully!');
      }
      setFormData({
        department: '', jobRole: '', questionText: '',
        option1: '', option2: '', option3: '', option4: '', correctAnswer: ''
      });
      setEditId(null);
      fetchQuestions();
    } catch (err) {
      setMessage('Operation failed. Please check inputs or server connection.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (q) => {
    setEditId(q._id);
    setFormData({
      department: q.department,
      jobRole: q.jobRole,
      questionText: q.questionText,
      option1: q.options[0] || '',
      option2: q.options[1] || '',
      option3: q.options[2] || '',
      option4: q.options[3] || '',
      correctAnswer: q.correctAnswer
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/questions/${id}`);
        setMessage('Question deleted successfully!');
        fetchQuestions();
      } catch (err) {
        setMessage('Failed to delete question.');
        console.error(err);
      }
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({
      department: '', jobRole: '', questionText: '',
      option1: '', option2: '', option3: '', option4: '', correctAnswer: ''
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Question Bank Administration
          </h1>
          <p className="text-gray-500 text-sm">Manage, create, and update interview questions for all roles.</p>
        </div>

        {message && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg mb-8 font-medium shadow-sm max-w-4xl mx-auto">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-slate-900 border-b border-gray-100 pb-3">
                {editId ? 'Edit Question' : 'Add New Question'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm transition-all" placeholder="e.g., Engineering" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Job Role</label>
                  <input type="text" name="jobRole" value={formData.jobRole} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm transition-all" placeholder="e.g., Software Developer" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Question Text</label>
                  <textarea name="questionText" value={formData.questionText} onChange={handleChange} required rows="3" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm transition-all resize-none" placeholder="Enter the interview question..." />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 block">Options</label>
                  <input type="text" name="option1" value={formData.option1} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" placeholder="Option 1" />
                  <input type="text" name="option2" value={formData.option2} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" placeholder="Option 2" />
                  <input type="text" name="option3" value={formData.option3} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" placeholder="Option 3" />
                  <input type="text" name="option4" value={formData.option4} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" placeholder="Option 4" />
                </div>

                <div className="pt-2">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Correct Answer</label>
                  <input type="text" name="correctAnswer" value={formData.correctAnswer} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm" placeholder="Must match one option exactly" />
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex justify-center items-center ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'}`}
                  >
                    {isSubmitting ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    ) : null}
                    {editId ? (isSubmitting ? 'Updating...' : 'Update Question') : (isSubmitting ? 'Adding...' : 'Save Question')}
                  </button>
                  {editId && (
                    <button type="button" onClick={cancelEdit} className="w-full bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">Existing Questions ({questions.length})</h2>
            {questions.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-500">
                No questions found. Add your first question using the form.
              </div>
            ) : (
              questions.map((q) => (
                <div key={q._id} className="bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {q.department}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {q.jobRole}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(q)} className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(q._id)} className="text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-4">{q.questionText}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                    {q.options.map((opt, i) => (
                      <div key={i} className={`p-3 border rounded-lg ${opt === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-900 font-medium' : 'bg-gray-50 border-gray-200'}`}>
                        {i + 1}. {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
