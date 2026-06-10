import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPage } from '@/app/pages';
import { ChangePasswordPage, ProfilePage } from '@/features/account';
import { AuthPage, useAuth } from '@/features/auth';
import { DashboardPage } from '@/features/tasks';
import { ProtectedRoute, PublicRoute } from '@/shared/layout';

const RootRedirect = () => {
  const { token } = useAuth();
  return <Navigate to={token ? '/dashboard' : '/login'} replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/todo" element={<Navigate to="/dashboard" replace />} />
        <Route path="/in-progress" element={<Navigate to="/dashboard" replace />} />
        <Route path="/done" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
