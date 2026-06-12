import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { clearAuthError, fetchCurrentUser, logout } from '@/store/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (auth.token && !auth.user) {
      void dispatch(fetchCurrentUser());
    }
  }, [dispatch, auth.token, auth.user]);

  return {
    ...auth,
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearAuthError())
  };
};
