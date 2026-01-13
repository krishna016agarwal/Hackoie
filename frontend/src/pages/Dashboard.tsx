
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Search, MapPin, Calendar, Users, Sparkles, X, Building2, Github, Linkedin, ExternalLink, Zap, Phone, Globe, Plus } from 'lucide-react';
import type { Team, User } from '../types';

const Dashboard: React.FC = () => {
  const { auth, setMessage, setError } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAllUserSkills, setShowAllUserSkills] = useState(false);

  const SKILL_LIMIT = 8;

  const getInitial = (name?: string) => (name ? name.charAt(0).toUpperCase() : '?');

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 800)); 
      const mockTeams: Team[] = [
        {
          id: 't1',
          title: 'GenAI Innovators',
          organizationName: 'HackMIT 2024',
          teamSize: 4,
          location: 'Remote',
          date: 'Nov 12, 2024',
          hackathonName: 'HackMIT 2024',
          hackathonLink: 'https://hackmit.org',
          requirementText: 'Need 1 Backend Developer (Go/Python) and 1 UI Designer. Prior hackathon experience preferred. We are building a high-scale RAG system for researchers.',
          createdBy: 'u1',
          creatorName: 'Alex Rivers',
          members: ['u1', 'u5','u2','u3']
        },
        {
          id: 't2',
          title: 'Blockchain Pioneers',
          organizationName: 'ETHDenver Foundation',
          teamSize: 3,
          location: 'Denver, CO',
          date: 'Feb 15, 2025',
          hackathonName: 'ETHDenver',
          hackathonLink: 'https://ethdenver.com',
          requirementText: 'Building a decentralized voting system. Need Solidity expert to handle complex smart contracts.',
          createdBy: 'u2',
          creatorName: 'Sarah Chen',
          members: ['u2']
        },
        {
          id: 't3',
          title: 'Eco Warriors',
          organizationName: 'Green Tech Hub',
          teamSize: 2,
          location: 'London',
          date: 'Dec 05, 2024',
          hackathonName: 'EcoHack',
          hackathonLink: 'https://ecohack.com',
          requirementText: 'Frontend developer (Next.js/Tailwind) needed for climate dashboard project focused on carbon tracking.',
          createdBy: 'u3',
          creatorName: 'Marco Rossi',
          members: ['u3']
        }
      ];
      setTeams(mockTeams);
      setLoading(false);
    };
    fetchTeams();
  }, []);

  const handleRequest = async (teamId: string) => {
    setMessage("Request sent successfully to team leader!");
  };

  const openUserProfile = (userId: string, name?: string) => {
    setSelectedUser({
      id: userId,
      name: name || (userId === 'u1' ? 'Alex Rivers' : userId === 'u2' ? 'Sarah Chen' : 'Hackoie Member'),
      email: 'member@example.com',
      isProfileComplete: true,
      college: 'Global Tech Institute',
      skills: ['React', 'Python', 'AI', 'Node.js', 'PostgreSQL', 'Tailwind', 'Next.js', 'Typescript', 'AWS', 'Docker', 'Redis'],
      about: 'Passionate developer and problem solver. I love building tools that make people more productive.',
      github: 'https://github.com/hackoie-dev',
      linkedin: 'https://linkedin.com/in/hackoie-dev',
      devfolio: 'https://devfolio.co/@hackoie',
      contactNo: '+1 (123) 456-7890'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8 sm:py-12 text-black overflow-hidden">
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
              placeholder="Search hackathons, orgs..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-black text-black shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-100 h-80 rounded-[40px] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {teams.map(team => (
            <div 
              key={team.id} 
              className="group bg-white p-6 sm:p-10 rounded-[40px] border border-gray-100 hover:shadow-2xl hover:border-lime-custom/40 transition-all cursor-pointer flex flex-col hover:-translate-y-1"
              onClick={() => setSelectedTeam(team)}
            >
              <div className="flex justify-between items-start mb-6">
                 <div className="px-4 py-1.5 bg-black text-white rounded-full text-[9px] font-bold uppercase tracking-widest">
                   {team.hackathonName}
                 </div>
                 <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pt-1">{team.date}</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-1 group-hover:text-black transition-colors text-black tracking-tight">{team.title}</h3>
              <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                <Building2 size={12} className="text-lime-600" />
                {team.organizationName}
              </div>

              <p className="text-gray-500 text-sm mb-8 line-clamp-2 leading-relaxed flex-grow">{team.requirementText}</p>
              
              <div className="space-y-4 mb-8">
                 <div className="flex items-center gap-3 text-gray-600 text-xs font-semibold">
                    <MapPin size={14} className="text-gray-300" />
                    <span>{team.location}</span>
                 </div>
                 <div className="flex items-center gap-3 text-gray-600 text-xs font-semibold">
                    <Users size={14} className="text-gray-300" />
                    <span>{team.members.length} / {team.teamSize} Members</span>
                    <div className="flex -space-x-2 ml-1">
                       {team.members.slice(0, 3).map((m, idx) => (
                         <div 
                           key={idx} 
                           onClick={(e) => { e.stopPropagation(); openUserProfile(m); }}
                           className="w-7 h-7 rounded-full border-2 border-white bg-black flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-sm text-lime-custom text-[10px] font-black"
                         >
                            {getInitial()}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2 overflow-hidden" onClick={(e) => { e.stopPropagation(); openUserProfile(team.createdBy, team.creatorName); }}>
                   <div className="w-8 h-8 rounded-full border border-gray-100 shrink-0 bg-lime-custom flex items-center justify-center text-black text-[10px] font-black">
                      {getInitial(team.creatorName)}
                   </div>
                   <span className="text-xs font-bold hover:underline cursor-pointer text-black truncate">{team.creatorName}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRequest(team.id); }}
                  className="px-6 py-2.5 bg-black text-white hover:bg-black/90 rounded-full font-bold text-xs transition-all shadow-sm active:scale-95"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
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
               <span className="text-lg sm:text-xl font-bold">{selectedTeam.organizationName}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12">
               <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Project Requirements</h4>
                  <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar text-gray-700 leading-relaxed bg-gray-50 p-6 sm:p-8 rounded-[40px] border border-gray-100 italic text-sm sm:text-base">
                    {selectedTeam.requirementText}
                  </div>
               </div>
               <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Stats</h4>
                  <ul className="space-y-4 mb-8">
                     <li className="flex items-center gap-4 text-gray-700 font-bold text-sm">
                        <MapPin size={20} className="text-lime-600" /> {selectedTeam.location}
                     </li>
                     <li className="flex items-center gap-4 text-gray-700 font-bold text-sm">
                        <Calendar size={20} className="text-lime-600" /> {selectedTeam.date}
                     </li>
                     <li className="flex items-center gap-4 text-gray-700 font-bold text-sm">
                        <Users size={20} className="text-lime-600" /> {selectedTeam.members.length} / {selectedTeam.teamSize} Members
                     </li>
                  </ul>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Team Roster</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeam.members.map((m, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => openUserProfile(m)}
                        className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100 hover:bg-lime-custom/10 transition-colors shadow-sm"
                      >
                         <div className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm bg-black text-lime-custom flex items-center justify-center text-[8px] font-black">
                            {getInitial()}
                         </div>
                         <span className="text-[10px] font-bold text-gray-600">Member {idx + 1}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href={selectedTeam.hackathonLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-100 text-center py-5 rounded-[24px] font-bold hover:bg-gray-200 transition-colors text-black flex items-center justify-center gap-2 text-lg">
                View Hackathon <ExternalLink size={20} />
              </a>
              <button 
                onClick={() => { handleRequest(selectedTeam.id); setSelectedTeam(null); }}
                className="flex-[2] bg-black text-white py-5 rounded-[24px] font-bold text-lg hover:bg-black/90 transition-all shadow-2xl"
              >
                Send Join Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Popup - Refined Margins and Spacing */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-4 sm:p-6" onClick={() => { setSelectedUser(null); setShowAllUserSkills(false); }}>
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-6 sm:p-10 text-center relative text-black shadow-2xl animate-in fade-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex justify-end absolute top-6 right-6 z-10">
              <button onClick={() => { setSelectedUser(null); setShowAllUserSkills(false); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            {/* <div className="relative inline-block mb-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] border-4 border-white shadow-xl bg-black flex items-center justify-center text-lime-custom text-5xl font-black">
                {getInitial(selectedUser.name)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-lime-custom text-black p-2.5 rounded-2xl shadow-lg ring-4 ring-white">
                <Zap size={20} fill="currentColor" />
              </div>
            </div> */}
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-1 tracking-tighter leading-tight">{selectedUser.name}</h2>
            <p className="text-gray-400 font-bold mb-6 uppercase tracking-widest text-[10px] sm:text-xs opacity-70">{selectedUser.college}</p>
            
            <div className="flex justify-center gap-4 mb-6">
              {selectedUser.github && (
                <a href={selectedUser.github} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-[1.5rem] hover:bg-black hover:text-white transition-all transform hover:-translate-y-1">
                  <Github size={24} />
                </a>
              )}
              {selectedUser.linkedin && (
                <a href={selectedUser.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-[1.5rem] hover:bg-[#0077b5] hover:text-white transition-all transform hover:-translate-y-1">
                  <Linkedin size={24} />
                </a>
              )}
              {selectedUser.devfolio && (
                <a href={selectedUser.devfolio} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-[1.5rem] hover:bg-[#3770FF] hover:text-white transition-all transform hover:-translate-y-1">
                  <Globe size={24} />
                </a>
              )}
            </div>

            <div className="flex flex-col items-center gap-2 mb-6">
               {selectedUser.contactNo && (
                 <div className="flex items-center gap-2 bg-gray-50 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-gray-600">
                    <Phone size={14} className="text-lime-600" /> {selectedUser.contactNo}
                 </div>
               )}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {showAllUserSkills ? (
                <div className="w-full flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto p-2 custom-scrollbar bg-gray-50 rounded-3xl border border-gray-100/50">
                  {selectedUser.skills?.map(s => (
                    <span key={s} className="px-4 py-2 bg-white rounded-full text-[10px] font-bold uppercase tracking-widest text-black shadow-sm">{s}</span>
                  ))}
                </div>
              ) : (
                <>
                  {selectedUser.skills?.slice(0, SKILL_LIMIT).map(s => (
                    <span key={s} className="px-4 py-2 bg-gray-50 rounded-full text-[10px] font-bold uppercase tracking-widest text-black hover:bg-gray-100 transition-colors">{s}</span>
                  ))}
                  {selectedUser.skills && selectedUser.skills.length > SKILL_LIMIT && (
                    <button 
                      onClick={() => setShowAllUserSkills(true)}
                      className="px-4 py-2 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:scale-105 transition-all shadow-md"
                    >
                      + {selectedUser.skills.length - SKILL_LIMIT} More
                    </button>
                  )}
                </>
              )}
            </div>
            
            <div className="bg-[#fcfcfc] p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 mb-8 relative">
               <p className="text-gray-600 leading-relaxed italic text-sm sm:text-base font-medium">
                 "{selectedUser.about}"
               </p>
            </div>
            
            <button 
              onClick={() => { setSelectedUser(null); setShowAllUserSkills(false); }} 
              className="w-full bg-black text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-black/90 transition-all shadow-2xl active:scale-95"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
