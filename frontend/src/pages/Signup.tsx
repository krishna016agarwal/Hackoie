
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Mail, Lock, User as UserIcon, ArrowRight, Zap } from 'lucide-react';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { signup, setError } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const getInitial = (name?: string) => (name ? name.charAt(0).toUpperCase() : '?');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    const success = await signup(formData);
    setIsLoading(false);

    if (success) {
      navigate('/otp');
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

          <h1 className="text-4xl font-bold mb-2 tracking-tighter">Create an account</h1>
          <p className="text-gray-500 mb-10">Start your journey into AI-powered collaboration.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Full name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg disabled:bg-gray-400"
            >
              {isLoading ? "Creating account..." : "Sign up"} <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-black font-bold">Log in</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex bg-lime-custom p-20 flex-col justify-end text-black">
        <div className="max-w-md">
          <h2 className="text-6xl font-bold leading-tight tracking-tighter mb-6">
            AI is your new secret recruiter.
          </h2>
          <p className="text-black/60 text-lg mb-10">
            Stop scrolling through endless profiles. Let Hackoie suggest the best matches for your skills and college.
          </p>
          <div className="flex -space-x-4">
            {['Sarah', 'David', 'Emma', 'Liam'].map((name, i) => (
              <div key={i} className="w-14 h-14 rounded-full border-4 border-lime-custom bg-black flex items-center justify-center text-lime-custom text-xl font-black">
                {getInitial(name)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
