import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'

  const login = (token) => {
    localStorage.setItem('access_token', token);
    setIsLoggedIn(true);
    setShowAuthModal(false); // close modal automatically on successful login/signup
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
  };

  // Call this from any "locked" button/feature — e.g. onClick={() => requireAuth()}
  const requireAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, showAuthModal, authModalMode, requireAuth, closeAuthModal, setAuthModalMode }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}