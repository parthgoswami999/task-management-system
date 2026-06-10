import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';

export const AppShell = ({ children }: PropsWithChildren) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const menuItemClasses =
    'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white';

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-300">Task Management System</p>
            <h1 className="text-2xl font-semibold text-white">Control the board, not just the backlog.</h1>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white"
              aria-label="Open profile menu"
              aria-expanded={menuOpen}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path
                  d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M4.5 20.25C4.5 16.9363 7.85786 14.25 12 14.25C16.1421 14.25 19.5 16.9363 19.5 20.25"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {menuOpen ? (
              <div className="absolute right-0 top-14 z-30 w-52 rounded-[1.25rem] border border-white/10 bg-slate-900/95 p-2 shadow-soft backdrop-blur">
                <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Account</p>
                </div>
                <ul className='mt-2 space-y-1'>
                  <li>
                    <Link to="/profile" className={menuItemClasses}>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                          <path
                            d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                          <path
                            d="M4.5 20.25C4.5 16.9363 7.85786 14.25 12 14.25C16.1421 14.25 19.5 16.9363 19.5 20.25"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <div className="mx-2 h-px bg-white/10" />
                  </li>
                  <li>
                    <Link to="/change-password" className={menuItemClasses}>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                          <path
                            d="M16.5 10.5V7.875C16.5 5.38972 14.4853 3.375 12 3.375C9.51472 3.375 7.5 5.38972 7.5 7.875V10.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <rect
                            x="4.5"
                            y="10.5"
                            width="15"
                            height="10.125"
                            rx="2.25"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                        </svg>
                      </span>
                      <span>Change Password</span>
                    </Link>
                  </li>
                  <li>
                    <div className="mx-2 h-px bg-white/10" />
                  </li>
                  <li>
                    <button type="button" onClick={handleSignOut} className={menuItemClasses}>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                          <path
                            d="M15.75 8.25L19.5 12L15.75 15.75"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.5 12H9"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10.5 4.5H7.875C6.01104 4.5 4.5 6.01104 4.5 7.875V16.125C4.5 17.989 6.01104 19.5 7.875 19.5H10.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span>Sign out</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};
