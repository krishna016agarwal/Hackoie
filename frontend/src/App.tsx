import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OTPPage from './pages/OTPPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/profile/Profile';
// import Profile from './pages/Profile';
import CreateTeam from './pages/CreateTeam';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Popup from './components/Popup';
import type { AuthState, User } from './types';

const API_URL = 'http://localhost:3000'; 

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (userData: Partial<User>) => Promise<boolean>;
  verifyOTP: (otp: string, email: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedUser: User) => void;
  error: string | null;
  setError: (msg: string | null) => void;
  message: string | null;
  setMessage: (msg: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('hackoie_auth');
    return saved ? JSON.parse(saved) : { user: null, token: null };
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('hackoie_auth', JSON.stringify(auth));
  }, [auth]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      setAuth({ user: data.user, token: data.token });
      setMessage('Welcome back!');
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const signup = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');
      
      sessionStorage.setItem('pending_email', userData.email || '');
      setMessage('OTP sent to your email!');
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const verifyOTP = async (otp: string, email: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid OTP');

      setAuth({ user: data.user, token: data.token });
      sessionStorage.removeItem('pending_email');
      setMessage('Account verified successfully!');
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem('hackoie_auth');
    setMessage('Logged out successfully.');
  };

  const updateProfile = (updatedUser: User) => {
    setAuth(prev => ({ ...prev, user: updatedUser }));
    setMessage('Profile updated!');
  };

  return (
    <AuthContext.Provider value={{ auth, login, signup, verifyOTP, logout, updateProfile, error, setError, message, setMessage }}>
      <HashRouter>
        <div className="min-h-screen bg-[#fcfcfc] flex flex-col text-black">
          {auth.token && <Navbar />}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={!auth.token ? <Landing /> : <Navigate to={auth.user?.isAdmin ? "/admin" : "/home"} />} />
              <Route path="/login" element={!auth.token ? <Login /> : <Navigate to="/home" />} />
              <Route path="/signup" element={!auth.token ? <Signup /> : <Navigate to="/home" />} />
              <Route path="/otp" element={!auth.token ? <OTPPage /> : <Navigate to="/home" />} />
              <Route path="/home" element={auth.token ? (auth.user?.isAdmin ? <Navigate to="/admin" /> : <Dashboard />) : <Navigate to="/" />} />
              <Route path="/profile" element={auth.token ? <Profile /> : <Navigate to="/" />} />
              <Route path="/create-team" element={auth.token ? <CreateTeam /> : <Navigate to="/" />} />
              <Route path="/admin" element={auth.token && auth.user?.isAdmin ? <Admin /> : <Navigate to="/" />} />
            </Routes>
          </main>
          {error && <Popup message={error} type="error" onClose={() => setError(null)} />}
          {message && <Popup message={message} type="success" onClose={() => setMessage(null)} />}
        </div>
      </HashRouter>
    </AuthContext.Provider>
  );
};

// CRITICAL: This line must exist and be at the very bottom
export default App;