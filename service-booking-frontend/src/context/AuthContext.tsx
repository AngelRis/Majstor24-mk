import React, { createContext, useState, useEffect, useContext } from 'react';
import type { AuthContextType, AuthProviderProps } from '../types/auth';


const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  username: '',
  fullName: '',
  role:'',
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName]= useState('');
  const [role,setRole]= useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp > Math.floor(Date.now() / 1000)) {
          setIsLoggedIn(true);
          setUsername(payload.sub || '');
          setFullName(payload.fullName || '')
          setRole(payload.role || '')
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    setIsLoggedIn(true);
    setUsername(payload.sub || '');
    setFullName(payload.fullName || '')
    setRole(payload.role || '')
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, fullName,role, login, logout,loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
