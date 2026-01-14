import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Search, MapPin, Calendar, Users, Sparkles, X, Building2, ExternalLink, Loader2 } from 'lucide-react';
import { UserProfileModal } from './profile/Modals';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'; 

const Dashboard: React.FC = () => {
  const { auth, setMessage, setError } = useAuth();
  const [teams, setTeams] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // Search State
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitial = (name?: string) => (name ? name.charAt(0).toUpperCase() : '?');

  // 1. Fetch Home Data (Matched + Others)
  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/tickets/home`, {
          headers: { 'Authorization': `Bearer ${auth.token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
          // Combine matched tickets first, then other tickets
          const combined = [...(data.matchedTickets || []), ...(data.otherTickets || [])];
          setTeams(combined);
        }
      } catch (err) {
        setError("Failed to load team feed.");
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, [auth.token]);

  // 2. Handle Join Request (POST /api/request)
  const handleRequest = async (ticketId: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/request`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}` 
        },
        body: JSON.stringify({ ticketId })
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Application sent successfully!");
        setSelectedTeam(null);
      } else {
        setError(data.message || "Could not send application.");
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Search Filter Logic
  const filteredTeams = teams.filter((team) => {
    const query = searchQuery.toLowerCase();
    return (
      team.title?.toLowerCase().includes(query) ||
      team.organization?.toLowerCase().includes(query) ||
      team.hackathonName?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8 sm:py-12 text-black overflow-hidden font-['Inter']">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-10 h-10 bg-lime-custom rounded-xl flex items-center justify-center shadow-lime">
                <Sparkles className="text-black" size={24} />
             </div>
             <span className="font-bold text-gray-500 text-xs sm:text-sm uppercase tracking-widest">AI Personalized Feed</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-black leading-none">Browse Teams</h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Discover hackers and teams matching your college and skill set.</p>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hackathons, orgs..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-black text-black shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-100 h-80 rounded-[40px] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {filteredTeams.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest">No teams match your search</div>
          ) : (
            filteredTeams.map(team => (
              <div 
                key={team._id} 
                className="group bg-white p-6 sm:p-10 rounded-[40px] border border-gray-100 hover:shadow-2xl hover:border-lime-custom/40 transition-all cursor-pointer flex flex-col hover:-translate-y-1"
                onClick={() => setSelectedTeam(team)}
              >
                <div className="flex justify-between items-start mb-6">
                   <div className="px-4 py-1.5 bg-black text-white rounded-full text-[9px] font-bold uppercase tracking-widest">
                     {team.hackathonName}
                   </div>
                   <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pt-1">
                      {new Date(team.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                   </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-1 group-hover:text-black transition-colors text-black tracking-tight">{team.title}</h3>
                <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Building2 size={12} className="text-lime-600" />
                  {team.organization}
                </div>

                <p className="text-gray-500 text-sm mb-8 line-clamp-2 leading-relaxed flex-grow">{team.description}</p>
                
                <div className="space-y-4 mb-8">
                   <div className="flex items-center gap-3 text-gray-600 text-xs font-semibold">
                      <MapPin size={14} className="text-gray-300" />
                      <span>{team.location}</span>
                   </div>
                   <div className="flex items-center gap-3 text-gray-600 text-xs font-semibold">
                      <Users size={14} className="text-gray-300" />
                      <span>{team.members?.length || 0} / {team.teamSize} Members</span>
                      <div className="flex -space-x-2 ml-1">
                         {team.members?.slice(0, 3).map((m: any, idx: number) => (
                           <div 
                             key={idx} 
                             onClick={(e) => { e.stopPropagation(); setSelectedUser(m); }}
                             className="w-7 h-7 rounded-full border-2 border-white bg-black flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-sm text-lime-custom text-[10px] font-black"
                           >
                              {getInitial(m.name)}
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2 overflow-hidden" onClick={(e) => { e.stopPropagation(); setSelectedUser(team.createdBy); }}>
                     <div className="w-8 h-8 rounded-full border border-gray-100 shrink-0 bg-lime-custom flex items-center justify-center text-black text-[10px] font-black">
                        {getInitial(team.createdBy?.name)}
                     </div>
                     <span className="text-xs font-bold hover:underline cursor-pointer text-black truncate">{team.createdBy?.name}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRequest(team._id); }}
                    className="px-6 py-2.5 bg-black text-white hover:bg-black/90 rounded-full font-bold text-xs transition-all shadow-sm active:scale-95"
                  >
                    Join
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Team Details Popup */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto" onClick={() => setSelectedTeam(null)}>
          <div className="bg-white w-full max-w-2xl rounded-[48px] p-8 sm:p-12 relative text-black shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedTeam(null)} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-colors">
               <X size={28} />
            </button>
            <div className="flex items-center gap-2 mb-6">
              <span className="px-4 py-1 bg-lime-custom/20 text-lime-700 text-[10px] font-bold rounded-full uppercase tracking-widest">Active Recruiting</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-1 tracking-tighter leading-tight">{selectedTeam.title}</h2>
            <div className="flex items-center gap-2 text-gray-500 mb-10">
               <Building2 size={20} className="text-lime-600" />
               <span className="text-lg sm:text-xl font-bold">{selectedTeam.organization}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12">
               <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Project Requirements</h4>
                  <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar text-gray-700 leading-relaxed bg-gray-50 p-6 sm:p-8 rounded-[40px] border border-gray-100 italic text-sm sm:text-base">
                    {selectedTeam.description || selectedTeam.requirementsText}
                  </div>
               </div>
               <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Stats</h4>
                  <ul className="space-y-4 mb-8">
                     <li className="flex items-center gap-4 text-gray-700 font-bold text-sm">
                        <MapPin size={20} className="text-lime-600" /> {selectedTeam.location}
                     </li>
                     <li className="flex items-center gap-4 text-gray-700 font-bold text-sm">
                        <Calendar size={20} className="text-lime-600" /> {new Date(selectedTeam.createdAt).toLocaleDateString()}
                     </li>
                     <li className="flex items-center gap-4 text-gray-700 font-bold text-sm">
                        <Users size={20} className="text-lime-600" /> {selectedTeam.members?.length} / {selectedTeam.teamSize} Members
                     </li>
                  </ul>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Team Roster</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeam.members?.map((m: any, idx: number) => (
                      <button 
                        key={idx} 
                        onClick={() => setSelectedUser(m)}
                        className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100 hover:bg-lime-custom/10 transition-colors shadow-sm"
                      >
                         <div className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm bg-black text-lime-custom flex items-center justify-center text-[8px] font-black">
                            {getInitial(m.name)}
                         </div>
                         <span className="text-[10px] font-bold text-gray-600">{m.name}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.open(selectedTeam.hackathonLink, "_blank")}
                className="flex-1 bg-gray-100 text-center py-5 rounded-[24px] font-bold hover:bg-gray-200 transition-colors text-black flex items-center justify-center gap-2 text-lg"
              >
                View Hackathon <ExternalLink size={20} />
              </button>
              <button 
                disabled={isSubmitting}
                onClick={() => handleRequest(selectedTeam._id)}
                className="flex-[2] bg-black text-white py-5 rounded-[24px] font-bold text-lg hover:bg-gray-800 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Send Join Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Popup */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;