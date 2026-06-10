import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui';

export const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="max-w-lg rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 text-center shadow-soft">
      <p className="text-xs uppercase tracking-[0.3em] text-brand-300">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">This route is off the board.</h1>
      <p className="mt-4 text-sm leading-7 text-slate-400">
        The page you are looking for does not exist or has been moved somewhere else in the workspace.
      </p>
      <Link to="/" className="mt-6 inline-block">
        <Button>Go to dashboard</Button>
      </Link>
    </div>
  </div>
);
