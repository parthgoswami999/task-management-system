import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/routes/ProtectedRoute';
import { PublicRoute } from '@/components/routes/PublicRoute';
import { RootRedirect } from '@/components/routes/RootRedirect';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AuthPage } from '@/pages/authentication/AuthPage';
import { ChangePasswordPage } from '@/views/Account/ChangePasswordPage';
import { ProfilePage } from '@/views/Account/ProfilePage';
import { DashboardPage } from '@/views/Dashboard/DashboardPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootRedirect />
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <AuthPage />
      },
      {
        path: '/register',
        element: <AuthPage />
      }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />
      },
      {
        path: '/profile',
        element: <ProfilePage />
      },
      {
        path: '/change-password',
        element: <ChangePasswordPage />
      },
      {
        path: '/todo',
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: '/in-progress',
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: '/done',
        element: <Navigate to="/dashboard" replace />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];

export default routes;
