import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const res = await api.post('/auth/google', {
        email: user.email,
        displayName: user.displayName
      });
      
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setSuccess('Google login successful! Redirecting...');
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!formData.identifier.trim() || !formData.password.trim()) {
      setIsLoading(false);
      return setError('Both fields are required.');
    }

    try {
      const isEmail = formData.identifier.includes('@');
      const payload = isEmail ? { email: formData.identifier, password: formData.password } : { username: formData.identifier, password: formData.password };
      
      const res = await api.post('/auth/login', payload);
      
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
        <h2 className="text-md text-center text-gray-300 mb-8">Log in to your account</h2>

        {error && <div className="bg-red-500/20 border-l-4 border-red-500 text-red-200 p-3 rounded mb-6 text-sm font-medium backdrop-blur-sm">{error}</div>}
        {success && <div className="bg-green-500/20 border-l-4 border-green-500 text-green-200 p-3 rounded mb-6 text-sm font-medium backdrop-blur-sm">{success}</div>}

        <button 
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="flex items-center justify-center gap-3 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 rounded-lg transition duration-200 shadow-md mb-6"
        >
          {isGoogleLoading ? (
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-white/20"></div>
          <span className="px-4 text-gray-400 text-sm">or sign in with email</span>
          <div className="flex-grow border-t border-white/20"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-200 block mb-1">Email or Username *</label>
            <input 
              type="text" 
              name="identifier" 
              value={formData.identifier} 
              onChange={handleChange} 
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none px-4 py-3 rounded-lg transition" 
              placeholder="Enter your email or username" 
              required 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 block mb-1">Password *</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none px-4 py-3 rounded-lg transition" 
              placeholder="Enter your password" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || isGoogleLoading}
            className={`w-full text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200 transform active:scale-95 flex justify-center items-center mt-2 ${isLoading || isGoogleLoading ? 'bg-indigo-500/50 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'}`}
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
            ) : null}
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-8">
          Don't have an account? <Link to="/register" className="text-indigo-400 font-medium hover:underline transition">Register here</Link>
        </p>
      </div>
    </div>
  );
}
