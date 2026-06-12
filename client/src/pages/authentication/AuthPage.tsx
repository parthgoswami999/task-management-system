import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, InputField } from '@/components/ui';
import { useAppDispatch } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';
import { storage } from '@/lib/storage';
import { clearAuthError, login, register } from '@/store/authSlice';

const initialForm = {
  name: '',
  email: storage.getAuthEmail(),
  password: ''
};

interface AuthPageLocationState {
  email?: string;
  password?: string;
  message?: string;
}

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isRegister = location.pathname === '/register';
  const routeState = (location.state as AuthPageLocationState | null) || null;
  const { token, loading, error } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState(routeState?.message || '');

  useEffect(() => {
    dispatch(clearAuthError());
    setValidationErrors({});
  }, [dispatch, isRegister]);

  useEffect(() => {
    setSuccessMessage(routeState?.message || '');
  }, [routeState?.message]);

  useEffect(() => {
    if (!routeState) {
      return;
    }

    setForm((current) => ({
      ...current,
      email: routeState.email ?? current.email,
      password: routeState.password ?? current.password
    }));
  }, [routeState]);

  useEffect(() => {
    storage.setAuthEmail(form.email);
  }, [form.email]);

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, token]);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (isRegister && form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Enter a valid email address';
    }

    if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    if (isRegister) {
      const result = await dispatch(
        register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        })
      );

      if (result.meta.requestStatus === 'fulfilled') {
        storage.setAuthEmail(form.email.trim());
      }
    } else {
      const result = await dispatch(login({ email: form.email.trim(), password: form.password }));

      if (result.meta.requestStatus === 'fulfilled') {
        storage.setAuthEmail(form.email.trim());
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-soft lg:grid-cols-[1.05fr,0.95fr]">
        <section className="relative hidden overflow-hidden bg-brand-900 p-10 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_35%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-100">MERN workspace</p>
            <h1 className="mt-6 max-w-md text-5xl font-semibold leading-tight text-white">
              Plan faster, ship cleaner, keep every task visible.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-brand-100/80">
              A production-ready task board with authentication, status tracking, and a clean workflow from backlog to completion.
            </p>
            <div className="mt-10 grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm font-semibold text-white">Structured for scale</p>
                <p className="mt-2 text-sm text-brand-100/80">Reusable components, Redux Toolkit, service layers, and validation on both sides.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm font-semibold text-white">Built for focused teams</p>
                <p className="mt-2 text-sm text-brand-100/80">Authentication, task status tracking, and clean workflows stay simple and consistent.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-300">{isRegister ? 'Register' : 'Login'}</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            {isRegister ? 'Create your workspace account' : 'Welcome back to your board'}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {isRegister
              ? 'Sign up to start managing tasks with a clean, focused workflow.'
              : 'Sign in to access your task pipeline and keep work moving.'}
          </p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {isRegister ? (
              <InputField
                label="Name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                error={validationErrors.name}
                placeholder="Alex Morgan"
              />
            ) : null}
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              error={validationErrors.email}
              placeholder="alex@example.com"
            />
            <InputField
              label="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              error={validationErrors.password}
              placeholder="At least 6 characters"
              enablePasswordToggle
            />
            {successMessage ? <Alert message={successMessage} tone="success" /> : null}
            {error ? <Alert message={error} /> : null}
            <Button type="submit" fullWidth>
              {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-6 text-sm text-slate-400">
            {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
            <Link
              className="font-semibold text-brand-300 hover:text-brand-200"
              to={isRegister ? '/login' : '/register'}
              state={{
                email: form.email,
                password: form.password
              }}
            >
              {isRegister ? 'Sign in' : 'Register'}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};
