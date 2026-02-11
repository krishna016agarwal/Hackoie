import React, { useState } from 'react';
import { useAuth } from '../App';
import { Link as LinkIcon, Sparkles, Send, Info, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'; 

const CreateTeam: React.FC = () => {
  const { auth, setError, setMessage } = useAuth();
  const navigate = useNavigate();
  
  const [isScrapping, setIsScrapping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for form submission
  const [isDataLoaded, setIsDataLoaded] = useState(false); 
  const [hackathonKey, setHackathonKey] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    hackathonLink: '',
    title: '',
    organization: '',
    teamSize: '4',
    location: '',
    date: '',
    hackathonName: '',
    requirementsText: ''
  });

  if (!auth.user?.isProfileComplete) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center text-black">
        <div className="w-20 h-20 bg-gray-100 rounded-[32px] flex items-center justify-center mx-auto mb-8">
          <Lock className="text-gray-500" size={32} />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tighter">Profile Incomplete</h1>
        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
          You must complete your profile before you can create hackathon teams.
        </p>
        <button onClick={() => navigate('/profile')} className="bg-black text-white px-10 py-5 rounded-full font-bold">
          Finish Profile Setup
        </button>
      </div>
    );
  }

  const handleLinkChange = async (link: string) => {
    setFormData(prev => ({ ...prev, hackathonLink: link }));
    
    setIsDataLoaded(false);
    setHackathonKey(null);

    if (link.length > 15) {
      setIsScrapping(true);
      try {
        const response = await fetch(`${API_URL}/api/tickets/link`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          },
          body: JSON.stringify({ rawUrl: link }),
        });

        const data = await response.json();

        if (data.status) {
          setHackathonKey(data.hackathonKey);
          setFormData(prev => ({
            ...prev,
            hackathonLink: data.normalizedUrl,
            organization: data.cleanData?.organization || '',
            hackathonName: data.cleanData?.name || '',
            date: data.cleanData?.date || '',
            location: data.cleanData?.location || '',
            requirementsText: data.cleanData?.description || ''
          }));
          setIsDataLoaded(true);
          setMessage("AI successfully analyzed the hackathon!");
        } else {
          setError(data.message || "Could not analyze this link.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setIsScrapping(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDataLoaded || isSubmitting) return;

    setIsSubmitting(true); // START PROCESSING
    try {
      const response = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ ...formData, hackathonKey }),
      });

      const data = await response.json();
      if (data.status) {
        setMessage(data.message);
        navigate('/home');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to create ticket.");
    } finally {
      setIsSubmitting(false); // STOP PROCESSING
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-black">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
          <Sparkles className="text-lime-custom" size={20} />
        </div>
        <span className="font-bold text-gray-600 tracking-widest uppercase text-xs">AI Powered Team Generation</span>
      </div>
      
      <h1 className="text-5xl font-bold tracking-tighter mb-4">Make your own Team.</h1>
      <p className="text-gray-600 text-lg mb-12">Enter the hackathon link and our AI will fetch the details.</p>

      <form onSubmit={handleSubmit} className="space-y-12">
        <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
          
          <div className="space-y-4">
             <label className="text-sm font-bold uppercase tracking-widest text-gray-500">Step 1: Hackathon URL</label>
             <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="url" 
                  value={formData.hackathonLink}
                  onChange={(e) => handleLinkChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black text-black"
                  placeholder="https://devpost.com/hackathons/..."
                  required
                />
             </div>
          </div>

          {isScrapping && (
            <div className="flex items-center justify-center gap-3 py-10 bg-lime-50 rounded-3xl border border-lime-100 animate-pulse">
              <Loader2 className="animate-spin text-lime-600" size={24} />
              <span className="font-bold text-lime-700">AI Processing... Fetching Hackathon Details</span>
            </div>
          )}

          {!isDataLoaded && !isScrapping && formData.hackathonLink.length > 10 && (
            <div className="p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-300 text-center text-gray-500 font-medium">
              Waiting for valid Hackathon URL to unlock details...
            </div>
          )}

          <div className={`space-y-8 transition-all duration-500 ${!isDataLoaded ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Team Name</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black"
                    placeholder="e.g. Team Cyberdyne"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Team Size</label>
                  <select 
                    value={formData.teamSize}
                    onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black appearance-none"
                  >
                    {[2,3,4,5,6].map(n => <option key={n} value={n}>{n} People</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Organization / Host</label>
                  <input type="text" value={formData.organization} onChange={(e) => setFormData({...formData, organization: e.target.value})} className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Hackathon Name</label>
                  <input type="text" value={formData.hackathonName} onChange={(e) => setFormData({...formData, hackathonName: e.target.value})} className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Event Date</label>
                  <input type="text" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black" />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Requirements & Description</label>
                <textarea 
                  rows={4}
                  value={formData.requirementsText}
                  onChange={(e) => setFormData({...formData, requirementsText: e.target.value})}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black resize-none"
                />
             </div>
          </div>
        </section>

        <div className={`flex flex-col md:flex-row gap-6 ${!isDataLoaded ? 'hidden' : 'block'}`}>
           <div className="flex-grow p-8 bg-black rounded-[32px] text-white flex items-center justify-between shadow-2xl">
              <div>
                 <p className="text-lime-custom font-bold uppercase tracking-widest text-xs mb-1">Status: AI Verified</p>
                 <h4 className="text-xl font-bold">Ready to broadcast</h4>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-lime-custom text-black px-10 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-70 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>Processing... <Loader2 className="animate-spin" size={18} /></>
                ) : (
                  <>Create & Broadcast <Send size={18} /></>
                )}
              </button>
           </div>
           <div className="md:w-64 p-8 bg-gray-100 rounded-[32px] flex items-center gap-4 text-black">
              <Info className="text-gray-500" size={24} />
              <p className="text-xs text-gray-600 font-medium">matching users will be notified immediately.</p>
           </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTeam;
