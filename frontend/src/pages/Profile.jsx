import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    mobile: '',
    profilePicture: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return setMessage({ type: 'error', text: 'Please upload a valid image file.' });
    }

    try {
      setIsUploading(true);
      setMessage({ type: '', text: '' });
      
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const userId = userInfo?._id || 'unknown';
      const fileExtension = file.name.split('.').pop();
      const fileName = `avatars/${userId}_${Date.now()}.${fileExtension}`;
      
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setFormData(prev => ({ ...prev, profilePicture: downloadURL }));
      setMessage({ type: 'success', text: 'Image uploaded! Click "Save Changes" to apply.' });
    } catch (error) {
      console.error("Firebase upload error:", error);
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.put('/auth/profile', formData);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Dispatch custom event to trigger navbar update (optional but good practice if Navbar reads from storage)
      window.dispatchEvent(new Event('storage'));
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
            
            {/* Interactive Avatar Upload */}
            <div className="flex flex-col items-center mb-8">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <div 
                onClick={triggerFileInput}
                className="group relative h-28 w-28 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 shadow-sm cursor-pointer hover:border-blue-500 transition-colors"
              >
                {isUploading ? (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></span>
                  </div>
                ) : null}

                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-blue-600 uppercase">
                    {formData.firstName?.charAt(0) || ''}{formData.surname?.charAt(0) || ''}
                  </span>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="text-white text-xs font-semibold">Change</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">Click avatar to upload new photo</p>
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

            <div className="pt-4 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={isLoading || isUploading}
                className={`w-full text-white font-medium rounded-lg text-sm px-5 py-3 text-center shadow-md transition-all flex justify-center items-center ${isLoading || isUploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'}`}
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
