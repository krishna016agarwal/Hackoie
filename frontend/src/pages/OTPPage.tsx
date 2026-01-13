import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { ShieldCheck, ArrowRight, Zap } from 'lucide-react';

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { verifyOTP, setError } = useAuth();
  const navigate = useNavigate();
  
  const email = sessionStorage.getItem('pending_email');

  useEffect(() => {
    if (!email) {
      setError("No pending registration found. Please sign up again.");
      navigate('/signup');
    }
  }, [email, navigate, setError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a 6-digit code.");
      return;
    }

    setIsLoading(true);
    const success = await verifyOTP(otp, email || '');
    setIsLoading(false);

    if (success) {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center">
        <div className="inline-flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Zap className="text-white w-6 h-6 fill-current" />
          </div>
          <span className="font-bold text-2xl tracking-tighter">Hackoie</span>
        </div>
        
        <div className="w-16 h-16 bg-lime-custom/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="text-lime-custom" size={32} />
        </div>
        
        <h1 className="text-3xl font-bold mb-2 tracking-tighter">Verify your identity</h1>
        <p className="text-gray-500 mb-10">
          Enter the code sent to <span className="text-black font-semibold">{email}</span>
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <input 
            type="text" 
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full text-center text-4xl tracking-widest font-bold py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
            placeholder="000000"
          />
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg disabled:bg-gray-400"
          >
            {isLoading ? "Verifying..." : "Verify & Finish"} <ArrowRight size={20} />
          </button>
        </form>
        
        <button className="mt-8 text-sm text-gray-400 hover:text-black">Didn't receive a code? Resend</button>
      </div>
    </div>
  );
};

export default OTPPage;