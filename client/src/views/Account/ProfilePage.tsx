import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layouts/AppShell';
import { Alert, Button, InputField } from '@/components/ui';
import { useAppDispatch } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';
import { clearAuthError, clearAuthSuccess, updateProfile } from '@/store/authSlice';

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error, successMessage } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || ''
    });
  }, [user]);

  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(clearAuthSuccess());
  }, [dispatch]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (form.name.trim().length < 2) {
      nextErrors.name = 'Name must be at least 2 characters long';
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    setValidationErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await dispatch(
      updateProfile({
        name: form.name.trim(),
        email: form.email.trim()
      })
    );
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-300">Profile</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Update your account details</h2>
          </div>
          <Link to="/dashboard">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-6 shadow-soft">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <InputField
              label="Name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              error={validationErrors.name}
              placeholder="Your full name"
            />
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              error={validationErrors.email}
              placeholder="your@email.com"
            />
            {successMessage ? <Alert message={successMessage} tone="success" /> : null}
            {error ? <Alert message={error} /> : null}
            <div className="flex justify-end">
              <Button type="submit">{loading ? 'Saving...' : 'Save Profile'}</Button>
            </div>
          </form>
        </section>
      </div>
    </AppShell>
  );
};
