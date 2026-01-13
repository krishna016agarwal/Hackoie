
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { 
  Users, Layers, Ticket, Search, User as UserIcon, Trash2, X, Github, Linkedin, 
  Globe, Phone, Zap, ShieldAlert, MoreVertical, Building2, MapPin, Calendar, 
  ExternalLink, Code, Mail, Clock, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import type{ User, Team, Request } from '../types';

// Extended Team type for Admin view to handle expiration and status
interface AdminTeam extends Team {
  isExpired?: boolean;
}

const Admin: React.FC = () => {
  const { auth, setMessage } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'teams' | 'tickets' | 'expired'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<AdminTeam | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getInitial = (name?: string) => (name ? name.charAt(0).toUpperCase() : '?');

  useEffect(() => {
    // Mock data for Admin with specific statuses
    setUsers([
      { id: 'u1', name: 'Alex Rivers', email: 'alex@mit.edu', isProfileComplete: true, college: 'MIT', branch: 'AI', year: '2025', skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'React', 'Node.js'], about: 'AI Researcher at MIT focusing on generative modeling and scalable systems.', github: 'https://github.com', linkedin: 'https://linkedin.com', contactNo: '+1 (555) 123-4567' },
      { id: 'u2', name: 'Sarah Chen', email: 'sarah@stanford.edu', isProfileComplete: true, college: 'Stanford', branch: 'CS', year: '2024', skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'], about: 'Frontend Wizard who loves building beautiful user interfaces.', github: 'https://github.com', linkedin: 'https://linkedin.com', contactNo: '+1 (555) 987-6543' },
      { id: 'u3', name: 'Marco Rossi', email: 'marco@polimi.it', isProfileComplete: true, college: 'Politecnico di Milano', branch: 'EE', year: '2026', skills: ['Solidity', 'Go', 'Rust'], about: 'Web3 developer passionate about decentralized systems.', github: 'https://github.com', linkedin: 'https://linkedin.com', contactNo: '+1 (555) 333-4444' }
    ]);

    setTeams([
      // Closed Team (Full)
      { id: 't1', title: 'GenAI Innovators', organizationName: 'HackMIT', teamSize: 2, location: 'Remote', date: 'Nov 2024', hackathonName: 'HackMIT', hackathonLink: 'https://hackmit.org', requirementText: 'Full squad working on RAG.', createdBy: 'u1', creatorName: 'Alex Rivers', members: ['u1', 'u5'], isExpired: false },
      // Open Team (Used for tickets demonstration)
      { id: 't2', title: 'Blockchain Pioneers', organizationName: 'ETHDenver', teamSize: 3, location: 'Denver', date: 'Feb 2025', hackathonName: 'ETHDenver', hackathonLink: 'https://ethdenver.com', requirementText: 'Need Solidity dev.', createdBy: 'u2', creatorName: 'Sarah Chen', members: ['u2'], isExpired: false },
      // Expired Team
      { id: 't3', title: 'Legacy AR Project', organizationName: 'Metaverse Hack', teamSize: 4, location: 'London', date: 'Jan 2024', hackathonName: 'Meta-Connect', hackathonLink: '#', requirementText: 'Completed project on spatial mapping.', createdBy: 'u3', creatorName: 'Marco Rossi', members: ['u3', 'u8', 'u9'], isExpired: true }
    ]);

    setRequests([
      { id: 'r1', ticketId: 't2', userId: 'u3', teamName: 'Blockchain Pioneers', hackathonName: 'ETHDenver', date: 'Oct 20, 2024', status: 'pending', applicantName: 'Marco Rossi' },
      { id: 'r2', ticketId: 't1', userId: 'u4', teamName: 'GenAI Innovators', hackathonName: 'HackMIT', date: 'Oct 22, 2024', status: 'pending', applicantName: 'Elena Gilbert' }
    ]);
  }, []);

  const handleRemoveUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setMessage("User removed from platform.");
  };

  const openTeamFromTicket = (ticket: Request) => {
    const team = teams.find(t => t.id === ticket.ticketId);
    if (team) {
      setSelectedTeam(team);
    } else {
      setMessage("Team data for this ticket is unavailable.");
    }
  };

  // Filter Logic
  const closedTeams = teams.filter(t => !t.isExpired && t.members.length >= t.teamSize);
  const expiredTeams = teams.filter(t => t.isExpired);
  const pendingTickets = requests.filter(r => r.status === 'pending');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#fcfcfc] font-['Inter',sans-serif]">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-black text-white p-8 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-lime-custom rounded-lg flex items-center justify-center">
            <Zap className="text-black w-5 h-5 fill-current" />
          </div>
          <span className="font-bold text-2xl tracking-tighter">Hackoie <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase ml-1">Admin</span></span>
        </div>

        <nav className="space-y-4 flex-grow">
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'users' ? 'bg-lime-custom text-black shadow-lime' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Users size={20} />
            <span>Total Users</span>
          </button>
          <button 
            onClick={() => setActiveTab('teams')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'teams' ? 'bg-lime-custom text-black shadow-lime' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <CheckCircle2 size={20} />
            <span>Total Teams</span>
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'tickets' ? 'bg-lime-custom text-black shadow-lime' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Ticket size={20} />
            <span>Total Tickets</span>
          </button>
          <button 
            onClick={() => setActiveTab('expired')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'expired' ? 'bg-lime-custom text-black shadow-lime' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Clock size={20} />
            <span>Expired Teams</span>
          </button>
        </nav>

        <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/10">
           <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="text-lime-custom" size={20} />
              <p className="text-xs font-bold uppercase tracking-widest">System Health</p>
           </div>
           <p className="text-[10px] text-gray-500 font-medium">Monitoring engine active. 0 active alerts.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 sm:p-12 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-black leading-none uppercase">
                {activeTab === 'users' ? 'User Directory' : activeTab === 'teams' ? 'Closed Squads' : activeTab === 'tickets' ? 'Pending Tickets' : 'Expired Vault'}
              </h1>
              <p className="text-gray-500 mt-2 font-medium">Platform Management Dashboard</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search records...`} 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black text-black shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Stat Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
             <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <p className="text-2xl font-black text-black leading-none">{users.length}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Hackers</p>
             </div>
             <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <p className="text-2xl font-black text-black leading-none">{closedTeams.length}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Closed Teams</p>
             </div>
             <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <p className="text-2xl font-black text-black leading-none">{pendingTickets.length}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Pending Tickets</p>
             </div>
             <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <p className="text-2xl font-black text-black leading-none">{expiredTeams.length}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Expired</p>
             </div>
          </div>

          {/* Dynamic Sections */}
          {activeTab === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUsers.map(user => (
                <div key={user.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                  <div className="shrink-0">
                     <div className="w-16 h-16 rounded-2xl border border-gray-50 bg-black text-lime-custom flex items-center justify-center text-xl font-black">
                        {getInitial(user.name)}
                     </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-black text-black text-lg truncate">{user.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{user.college || 'Guest Hacker'}</p>
                    <div className="flex gap-2 mt-3">
                       <button onClick={() => setSelectedUser(user)} className="px-4 py-1.5 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-lime-custom hover:text-black transition-all">Profile</button>
                       <button onClick={() => handleRemoveUser(user.id)} className="p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {closedTeams.map(team => (
                 <div key={team.id} onClick={() => setSelectedTeam(team)} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4">
                      <CheckCircle2 className="text-lime-custom" size={24} />
                   </div>
                   <h3 className="text-xl font-black text-black mb-2 group-hover:text-lime-700 transition-colors">{team.title}</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">{team.organizationName}</p>
                   <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex -space-x-2">
                         {team.members.map((m, idx) => (
                           <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-black flex items-center justify-center shadow-sm text-lime-custom text-[10px] font-black">
                              {getInitial()}
                           </div>
                         ))}
                      </div>
                      <span className="text-[10px] font-black text-black uppercase tracking-widest">Full Capacity</span>
                   </div>
                 </div>
               ))}
               {closedTeams.length === 0 && <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No closed teams found.</div>}
            </div>
          )}

          {activeTab === 'tickets' && (
             <div className="space-y-4">
               {pendingTickets.map(req => (
                 <div key={req.id} onClick={() => openTeamFromTicket(req)} className="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm hover:border-lime-custom cursor-pointer transition-all">
                   <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-lime-custom font-black">
                         {getInitial(req.applicantName)}
                      </div>
                      <div>
                        <p className="font-black text-black leading-tight text-lg">{req.applicantName}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Applied for <span className="text-black">{req.teamName}</span></p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-black uppercase tracking-widest">Pending</div>
                      <div className="px-4 py-2 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">{req.date}</div>
                   </div>
                 </div>
               ))}
               {pendingTickets.length === 0 && <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No pending tickets.</div>}
             </div>
          )}

          {activeTab === 'expired' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {expiredTeams.map(team => (
                 <div key={team.id} onClick={() => setSelectedTeam(team)} className="bg-gray-50 p-8 rounded-[40px] border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group grayscale hover:grayscale-0">
                   <div className="flex justify-between items-start mb-6">
                      <div className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        <AlertTriangle size={10} /> Expired
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{team.date}</span>
                   </div>
                   <h3 className="text-xl font-black text-black mb-2">{team.title}</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">{team.hackathonName}</p>
                   <div className="pt-6 border-t border-gray-200 text-right">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Archived</span>
                   </div>
                 </div>
               ))}
               {expiredTeams.length === 0 && <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No expired records.</div>}
            </div>
          )}
        </div>
      </main>

      {/* User Details Popup - Refined Styling */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[600] flex items-center justify-center p-6" onClick={() => setSelectedUser(null)}>
           <div className="bg-white w-full max-w-lg rounded-[3rem] p-6 sm:p-10 relative text-black shadow-2xl animate-in zoom-in duration-200 text-center" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedUser(null)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
              
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-[2.5rem] mx-auto border-4 border-white shadow-xl bg-black flex items-center justify-center text-lime-custom text-5xl font-black">
                  {getInitial(selectedUser.name)}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-lime-custom text-black p-2.5 rounded-2xl shadow-lg ring-4 ring-white">
                  <Zap size={18} fill="currentColor" />
                </div>
              </div>
              
              <h2 className="text-3xl font-black mb-1 tracking-tighter leading-tight">{selectedUser.name}</h2>
              <p className="text-gray-400 font-bold mb-6 uppercase tracking-widest text-[10px] opacity-70">{selectedUser.college || 'Independent Hacker'}</p>
              
              <div className="flex justify-center gap-4 mb-6">
                {selectedUser.github && (
                  <a href={selectedUser.github} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-[1.5rem] hover:bg-black hover:text-white transition-all transform hover:-translate-y-1">
                    <Github size={20} />
                  </a>
                )}
                {selectedUser.linkedin && (
                  <a href={selectedUser.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-[1.5rem] hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                    <Linkedin size={20} />
                  </a>
                )}
                {selectedUser.devfolio && (
                  <a href={selectedUser.devfolio} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-[1.5rem] hover:bg-[#3770FF] hover:text-white transition-all transform hover:-translate-y-1">
                    <Globe size={20} />
                  </a>
                )}
              </div>

              <div className="space-y-3 mb-6 flex flex-col items-center">
                <div className="flex items-center gap-3 text-xs text-gray-600 font-bold bg-gray-50 px-5 py-2.5 rounded-full">
                  <Mail size={14} className="text-lime-600" /> {selectedUser.email}
                </div>
                {selectedUser.contactNo && (
                  <div className="flex items-center gap-3 text-xs text-gray-600 font-bold bg-gray-50 px-5 py-2.5 rounded-full">
                    <Phone size={14} className="text-lime-600" /> {selectedUser.contactNo}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-8 bg-gray-50/50 p-4 rounded-[2rem] border border-gray-100">
                {selectedUser.skills?.map(s => (
                  <span key={s} className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-[9px] font-bold uppercase tracking-widest text-black shadow-sm">{s}</span>
                )) || <p className="text-xs text-gray-400 italic">No skills listed</p>}
              </div>

              <div className="bg-[#fcfcfc] p-6 rounded-[2.5rem] border border-gray-100 mb-8">
                 <p className="text-gray-600 leading-relaxed italic text-sm">
                   "{selectedUser.about || 'Platform administrator profile.'}"
                 </p>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setSelectedUser(null)} className="flex-1 bg-gray-100 text-black py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">Close</button>
                 <button onClick={() => handleRemoveUser(selectedUser.id)} className="flex-1 bg-red-500 text-white py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-lg hover:bg-red-600 transition-all">Ban User</button>
              </div>
           </div>
        </div>
      )}

      {/* Team Details Popup - Styled Consistently */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[600] flex items-center justify-center p-6" onClick={() => setSelectedTeam(null)}>
           <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 sm:p-12 relative text-black shadow-2xl animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh] custom-scrollbar" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedTeam(null)} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
              
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <Layers size={28} className="text-lime-custom" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black tracking-tighter leading-tight uppercase">{selectedTeam.title}</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] opacity-70">{selectedTeam.organizationName} • {selectedTeam.hackathonName}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 text-left">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Project Requirement</h4>
                    <p className="text-gray-700 leading-relaxed italic text-sm bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
                      "{selectedTeam.requirementText}"
                    </p>
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center gap-3 text-sm text-gray-600 font-bold">
                        <MapPin size={18} className="text-lime-600" /> {selectedTeam.location}
                     </div>
                     <div className="flex items-center gap-3 text-sm text-gray-600 font-bold">
                        <Calendar size={18} className="text-lime-600" /> {selectedTeam.date}
                     </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Team Members</h4>
                      <div className="space-y-2">
                         {selectedTeam.members.map((m, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl">
                               <div className="w-8 h-8 rounded-full border border-gray-100 bg-black text-lime-custom flex items-center justify-center text-[10px] font-black">
                                  {getInitial()}
                               </div>
                               <span className="text-xs font-bold text-gray-600">{m === selectedTeam.createdBy ? 'Team Lead' : `Hacker ${idx + 1}`}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Created By</p>
                      <p className="text-lg font-black text-black">{selectedTeam.creatorName}</p>
                   </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <a href={selectedTeam.hackathonLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-100 text-black py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-200 transition-all">Hackathon Page <ExternalLink size={18} /></a>
                <button onClick={() => setSelectedTeam(null)} className="flex-1 bg-black text-white py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black/90 transition-all">Close Brief</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
