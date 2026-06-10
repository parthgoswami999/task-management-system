import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';

export const PublicRoute = () => {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};
