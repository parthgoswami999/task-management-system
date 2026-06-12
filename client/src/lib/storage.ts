const TOKEN_KEY = 'task-management-token';
const USER_KEY = 'task-management-user';
const AUTH_EMAIL_KEY = 'task-management-auth-email';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: () => {
    const value = localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  },
  setUser: (user: unknown) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),
  getAuthEmail: () => localStorage.getItem(AUTH_EMAIL_KEY) || '',
  setAuthEmail: (email: string) => localStorage.setItem(AUTH_EMAIL_KEY, email),
  clearAuthEmail: () => localStorage.removeItem(AUTH_EMAIL_KEY),
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(AUTH_EMAIL_KEY);
  }
};
