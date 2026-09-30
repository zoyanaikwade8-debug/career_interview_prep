import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import InterviewRoom from './pages/InterviewRoom';
import Results from './pages/Results';
import Performance from './pages/Performance';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <ErrorBoundary>
          <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview/:role" element={<InterviewRoom />} />
            <Route path="/results" element={<Results />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
        </ErrorBoundary>
      </main>
    </Router>
  );
}

export default App;
