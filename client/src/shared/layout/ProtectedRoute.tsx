import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';

export const ProtectedRoute = () => {
  const { token } = useAuth();

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
