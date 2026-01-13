import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Mail, Lock, ArrowRight, Zap, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      // The redirection is mostly handled by App.tsx Route logic, 
      // but we can manually push to make it immediate.
      // We use a small timeout to let the Auth state update
      setTimeout(() => {
        navigate('/home');
      }, 100);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="p-10 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5 fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tighter">Hackoie</span>
          </Link>
          
          <h1 className="text-4xl font-bold mb-2 tracking-tighter">Welcome back</h1>
          <p className="text-gray-500 mb-10">Log in to your account to find your next team.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all disabled:opacity-50"
                  placeholder="name@company.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-semibold">Password</label>
                <a href="#" className="text-xs text-gray-400 hover:text-black">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/signup" className="text-black font-bold">Sign up</Link>
          </p>
        </div>
      </div>
      
      {/* Right Side - UI remains same */}
      <div className="hidden lg:flex bg-black p-20 flex-col justify-end text-white">
        <div className="max-w-md">
          <div className="mb-8">
            <div className="w-16 h-16 bg-lime-400 rounded-2xl mb-6"></div>
            <h2 className="text-5xl font-bold leading-tight tracking-tighter mb-4">
              Connect with high-caliber talent.
            </h2>
            <p className="text-gray-400 text-lg">
              Join thousands of hackers using Hackoie to build the next generation of digital products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;