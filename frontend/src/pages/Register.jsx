import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    username: '',
    email: '',
    mobile: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!formData.firstName.trim() || !formData.surname.trim()) {
      setIsLoading(false);
      return setError('First Name and Surname are mandatory.');
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(formData.email)) {
      setIsLoading(false);
      return setError('Email must be a valid Gmail address (e.g., user@gmail.com).');
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8}$/;
    if (!passwordRegex.test(formData.password)) {
      setIsLoading(false);
      return setError('Password must be exactly 8 characters long and contain both letters and numbers.');
    }

    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-extrabold text-white text-center tracking-tight mb-2">
          CAREER INTERVIEW PREP
        </h1>
        <h2 className="text-md text-center text-gray-300 mb-8">Create your account</h2>

        {error && <div className="bg-red-500/20 border-l-4 border-red-500 text-red-200 p-3 rounded mb-6 text-sm font-medium backdrop-blur-sm">{error}</div>}
        {success && <div className="bg-green-500/20 border-l-4 border-green-500 text-green-200 p-3 rounded mb-6 text-sm font-medium backdrop-blur-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full">
              <label className="text-sm font-medium text-gray-200 block mb-1">First Name *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none px-4 py-3 rounded-lg transition" placeholder="John" />
            </div>
            <div className="w-full">
              <label className="text-sm font-medium text-gray-200 block mb-1">Surname *</label>
              <input type="text" name="surname" value={formData.surname} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none px-4 py-3 rounded-lg transition" placeholder="Doe" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 block mb-1">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none px-4 py-3 rounded-lg transition" placeholder="johndoe123" required />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 block mb-1">Email (Gmail only) *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none px-4 py-3 rounded-lg transition" placeholder="johndoe@gmail.com" required />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 block mb-1">Mobile Number</label>
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none px-4 py-3 rounded-lg transition" placeholder="+1 234 567 8900" required />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 block mb-1">Password *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none px-4 py-3 rounded-lg transition" placeholder="Exactly 8 chars (letters + numbers)" required />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200 transform active:scale-95 flex justify-center items-center mt-2 ${isLoading ? 'bg-indigo-500/50 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'}`}
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
            ) : null}
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-8">
          Already have an account? <Link to="/login" className="text-indigo-400 font-medium hover:underline transition">Log in</Link>
        </p>
      </div>
    </div>
  );
}
