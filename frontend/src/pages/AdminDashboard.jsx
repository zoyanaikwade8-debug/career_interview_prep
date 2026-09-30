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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          ADMIN DASHBOARD - QUESTIONS
        </h1>

        {message && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-3 rounded mb-6 font-medium shadow-sm">
            {message}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            {editId ? 'Edit Question' : 'Add New Question'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Engineering" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                <input type="text" name="jobRole" value={formData.jobRole} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Software Developer" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
              <textarea name="questionText" value={formData.questionText} onChange={handleChange} required rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter the interview question..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Option 1</label>
                <input type="text" name="option1" value={formData.option1} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Option 2</label>
                <input type="text" name="option2" value={formData.option2} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Option 3</label>
                <input type="text" name="option3" value={formData.option3} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Option 4</label>
                <input type="text" name="option4" value={formData.option4} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
              <input type="text" name="correctAnswer" value={formData.correctAnswer} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Must match one of the options exactly" />
            </div>

            <div className="flex gap-4 pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`text-white px-6 py-2 rounded-md transition font-semibold flex items-center ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isSubmitting ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                ) : null}
                {editId ? (isSubmitting ? 'Updating...' : 'Update Question') : (isSubmitting ? 'Adding...' : 'Add Question')}
              </button>
              {editId && (
                <button type="button" onClick={cancelEdit} className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition font-semibold">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Existing Questions</h2>
          
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No questions found. Add some above.</p>
          ) : (
            <div className="space-y-6">
              {questions.map((q) => (
                <div key={q._id} className="border p-4 rounded-md hover:shadow-sm transition bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 font-medium">
                        {q.department}
                      </span>
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-medium">
                        {q.jobRole}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(q)} className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded transition">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(q._id)} className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition">
                        Delete
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{q.questionText}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                    {q.options.map((opt, i) => (
                      <div key={i} className={`p-2 border rounded ${opt === q.correctAnswer ? 'bg-green-100 border-green-300 font-medium text-green-800' : 'bg-white'}`}>
                        {i + 1}. {opt}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm">
                    <span className="font-semibold text-gray-700">Correct Answer: </span> 
                    <span className="text-green-600 font-medium">{q.correctAnswer}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
