import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    mobile: '',
    profilePicture: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Pre-fill from local storage on mount
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setFormData({
        firstName: userInfo.firstName || '',
        surname: userInfo.surname || '',
        mobile: userInfo.mobile || '',
        profilePicture: userInfo.profilePicture || ''
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.put('/auth/profile', formData);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Profile</h1>
            <p className="text-gray-500 text-sm mt-2">Manage your personal information and profile settings.</p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Avatar Preview */}
            <div className="flex flex-col items-center mb-6">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-500 shadow-sm">
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-blue-600 uppercase">
                    {formData.firstName?.charAt(0)}{formData.surname?.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 transition-all" 
                  required 
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Surname</label>
                <input 
                  type="text" 
                  name="surname" 
                  value={formData.surname} 
                  onChange={handleChange} 
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 transition-all" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Mobile Number</label>
              <input 
                type="tel" 
                name="mobile" 
                value={formData.mobile} 
                onChange={handleChange} 
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 transition-all" 
                required 
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Profile Photo URL (Optional)</label>
              <input 
                type="url" 
                name="profilePicture" 
                value={formData.profilePicture} 
                onChange={handleChange} 
                placeholder="https://example.com/avatar.png"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 transition-all" 
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-white font-medium rounded-lg text-sm px-5 py-3 text-center shadow-md transition-all flex justify-center items-center ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'}`}
              >
                {isLoading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                ) : null}
                {isLoading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
