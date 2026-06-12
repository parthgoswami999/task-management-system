import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layouts/AppShell';
import { Alert, Button, InputField } from '@/components/ui';
import { useAppDispatch } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';
import { changePassword, clearAuthError, clearAuthSuccess, logout } from '@/store/authSlice';

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAuth();
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(clearAuthSuccess());
  }, [dispatch]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.oldPassword) {
      nextErrors.oldPassword = 'Old password is required';
    }

    if (form.newPassword.length < 6) {
      nextErrors.newPassword = 'New password must be at least 6 characters long';
    }

    if (form.confirmPassword !== form.newPassword) {
      nextErrors.confirmPassword = 'Confirm password must match the new password';
    }

    setValidationErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const result = await dispatch(
      changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      })
    );

    if (result.meta.requestStatus !== 'fulfilled') {
      return;
    }

    dispatch(logout());
    navigate('/login', {
      replace: true,
      state: {
        message: 'Password changed successfully. Please sign in again.'
      }
    });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-300">Change Password</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Secure your account</h2>
          </div>
          <Link to="/dashboard">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-6 shadow-soft">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <InputField
              label="Old Password"
              type="password"
              enablePasswordToggle
              value={form.oldPassword}
              onChange={(event) => setForm((current) => ({ ...current, oldPassword: event.target.value }))}
              error={validationErrors.oldPassword}
              placeholder="Enter your current password"
            />
            <InputField
              label="New Password"
              type="password"
              enablePasswordToggle
              value={form.newPassword}
              onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))}
              error={validationErrors.newPassword}
              placeholder="Enter a new password"
            />
            <InputField
              label="Confirm New Password"
              type="password"
              enablePasswordToggle
              value={form.confirmPassword}
              onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
              error={validationErrors.confirmPassword}
              placeholder="Confirm the new password"
            />
            {error ? <Alert message={error} /> : null}
            <div className="flex justify-end">
              <Button type="submit">{loading ? 'Changing...' : 'Change Password'}</Button>
            </div>
          </form>
        </section>
      </div>
    </AppShell>
  );
};
