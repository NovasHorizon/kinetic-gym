import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from './api';

const AuthContext = createContext(null);

// Holds the logged-in member for the whole app.
export function AuthProvider({ children }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api('/me')
      .then(setMember)
      .catch(() => setToken(null)) // expired or revoked token
      .finally(() => setLoading(false));
  }, []);

  const saveSession = ({ token, member }) => {
    setToken(token);
    setMember(member);
  };

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    setToken(null);
    setMember(null);
  };

  return <AuthContext.Provider value={{ member, loading, saveSession, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
