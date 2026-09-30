import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const userInfo = localStorage.getItem('userInfo');

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
