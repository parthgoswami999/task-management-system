import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const RootRedirect = () => {
  const { token } = useAuth();
  return <Navigate to={token ? '/dashboard' : '/login'} replace />;
};
