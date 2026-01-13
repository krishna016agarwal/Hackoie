import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { ProfileHeader } from './ProfileHeader';
import { TeamDetailModal, UserProfileModal, SkillsModal, AIRecommendationsModal } from './Modals';
import { Layers, UserPlus, Send, Archive, UserCheck, Building2, Loader2, Sparkles, Trash2 } from 'lucide-react';
import type { User } from '../../types';

const API_URL = 'http://localhost:3000';

const Profile: React.FC = () => {
    const { auth, updateProfile, setMessage, setError } = useAuth();

    // --- UI STATES ---
    const [activeTab, setActiveTab] = useState<'joined' | 'incoming' | 'sent' | 'created' | 'friends'>('joined');
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showAllSkills, setShowAllSkills] = useState(false);

    // --- DATA STATES ---
    const [joinedTeams, setJoinedTeams] = useState<any[]>([]);
    const [isLoadingJoined, setIsLoadingJoined] = useState(false);

    const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
    const [isLoadingIncoming, setIsLoadingIncoming] = useState(false);
    const [isLoadingSent, setIsLoadingSent] = useState(false);
    const [createdTeams, setCreatedTeams] = useState<any[]>([]);
    const [isLoadingCreated, setIsLoadingCreated] = useState(false);
    const [sentRequests, setSentRequests] = useState<any[]>([]);
    const [friendRequests, setFriendRequests] = useState<any[]>([]);
    const [isLoadingFriends, setIsLoadingFriends] = useState(false);

    // --- MODAL & SELECTION STATES ---
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [memberRemoved, setMemberRemoved] = useState(false);
    // --- AI RECOMMENDATION STATES ---
    const [showRecModal, setShowRecModal] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [isLoadingRecs, setIsLoadingRecs] = useState(false);

    const [editForm, setEditForm] = useState<User>({ ...auth.user! });

    const getInitial = (name?: string) => (name ? name.charAt(0).toUpperCase() : '?');

    // 1. Fetch Data Logic
    useEffect(() => {
        if (activeTab === 'joined') fetchJoined();
        if (activeTab === 'incoming') fetchIncoming();
        if (activeTab === 'created') fetchCreated();
        if (activeTab === 'friends') fetchFriendRequests();
        if (activeTab === 'sent') fetchSentRequests();
    }, [auth.token, activeTab]);

    const fetchJoined = async () => {
        setIsLoadingJoined(true);
        try {
            const res = await fetch(`${API_URL}/api/tickets/joined`, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            const data = await res.json();
            if (res.ok) setJoinedTeams(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setIsLoadingJoined(false); }
    };

    const fetchIncoming = async () => {
        setIsLoadingIncoming(true);
        try {
            const res = await fetch(`${API_URL}/api/request/incoming`, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            const data = await res.json();
            if (res.ok) setIncomingRequests(data);
        } catch (err) { console.error(err); }
        finally { setIsLoadingIncoming(false); }
    };

    const fetchCreated = async () => {
        setIsLoadingCreated(true);
        try {
            const res = await fetch(`${API_URL}/api/tickets/created`, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            const data = await res.json();
            if (res.ok) setCreatedTeams(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setIsLoadingCreated(false); }
    };

    const fetchFriendRequests = async () => {
        setIsLoadingFriends(true);
        try {
            const res = await fetch(`${API_URL}/api/join-requests/received`, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            const data = await res.json();
            if (data.status) setFriendRequests(data.requests || []);
        } catch (err) { console.error(err); }
        finally { setIsLoadingFriends(false); }
    };

    const fetchSentRequests = async () => {
        setIsLoadingSent(true);
        try {
            const res = await fetch(`${API_URL}/api/request/sent`, { headers: { Authorization: `Bearer ${auth.token}` } });
            const data = await res.json();
            if (data.status) setSentRequests(data.applications || []);
        } finally { setIsLoadingSent(false); }
    };

    // --- ACTION HANDLERS ---

    // For Friends Tab (Respond to Join Request)
    const handleRespondJoinRequest = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
        try {
            const res = await fetch(`${API_URL}/api/join-requests/respond`, {
                method: 'POST', // Actions usually POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                body: JSON.stringify({ requestId, status })
            });
            const data = await res.json();
            if (data.status) {
                setMessage(data.message);
                setFriendRequests(prev => prev.filter(r => r._id !== requestId));
            } else {
                setError(data.message);
            }
        } catch (err) { setError("Action failed"); }
    };

    // For Incoming Tab (Approve/Reject Application)
    const handleUpdateStatus = async (applicationId: string, newStatus: 'ACCEPTED' | 'REJECTED') => {
        try {
            const res = await fetch(`${API_URL}/api/request/${applicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                setIncomingRequests(prev => prev.filter(req => req._id !== applicationId));
            } else { setError(data.message); }
        } catch (err) { setError("Action failed"); }
    };

    const handleDeleteApplication = async (applicationId: string) => {
        try {
            const res = await fetch(`${API_URL}/api/request/${applicationId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            const data = await res.json();
            if (data.status) {
                setMessage(data.message);
                setSentRequests(prev => prev.filter(r => r._id !== applicationId));
            }
        } catch {
            setError('Withdraw failed');
        }
    };


    const handleFetchRecommendations = async (ticketId: string) => {
        setShowRecModal(true);
        setIsLoadingRecs(true);
        try {
            const res = await fetch(`${API_URL}/api/tickets/ticket/${ticketId}`, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            const data = await res.json();
            if (data.status) setRecommendations(data.recommendations || []);
        } catch (err) { console.error(err); }
        finally { setIsLoadingRecs(false); }
    };

    const handleSendInvite = async (userId: string) => {
        try {
            const res = await fetch(`${API_URL}/api/join-requests/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
                body: JSON.stringify({ ticketId: selectedTeam._id, userId })
            });
            const data = await res.json();
            if (data.status) setMessage(data.message);
            else setError(data.message);
        } catch (err) { setError("Failed to send request"); }
    };

    const fetchTeamMembers = async (ticketId: string) => {
        setIsLoadingMembers(true);
        try {

            const res = await fetch(`${API_URL}/api/auth/ticket/${ticketId}/members`, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });

            const data = await res.json();

            if (res.ok) setTeamMembers(data.members);
        } catch (err) { console.error(err); }
        finally { setIsLoadingMembers(false); }
    };

    const handleTeamClick = (team: any) => {

        setSelectedTeam(team);

        fetchTeamMembers(team._id);
    };

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (res.ok) { updateProfile(data.user); setIsEditing(false); setMessage(data.message); }
        } catch (err) { setError("Save failed"); }
        finally { setIsUpdating(false); }
    };

    const handleRemoveMember = async (memberId: string) => {
        try {
            const res = await fetch(
                `${API_URL}/api/tickets/${selectedTeam._id}/member/${memberId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                }
            );

            const data = await res.json();

            if (data.status) {
                setMessage(data.message);   // popup shown
              
                fetchTeamMembers(selectedTeam._id);
                setMemberRemoved(true); // 🔔 trigger useEffect
            } else {
                setError(data.message || 'Failed to remove member');
            }
        } catch (err) {
            setError('Failed to remove member');
        }
    };


    useEffect(() => {
        if (!memberRemoved) return;

        const timer = setTimeout(() => {
            fetchCreated();   // 🔄 refetch from backend

            setMemberRemoved(false); // reset flag
        }, 1500); // wait till popup is seen

        return () => clearTimeout(timer);
    }, [memberRemoved]);




    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8 sm:py-12 text-black font-['Inter',sans-serif]">

            <ProfileHeader
                user={auth.user} isEditing={isEditing} setIsEditing={setIsEditing} editForm={editForm}
                setEditForm={setEditForm} handleSave={handleSave} isUpdating={isUpdating}
                getInitial={getInitial} SKILL_LIMIT={8} setShowAllSkills={setShowAllSkills}
                handleSkillsChange={(e: any) => setEditForm({ ...editForm, skills: e.target.value.split(',').map((s: any) => s.trim()) })}
            />

            <div className="flex gap-6 sm:gap-12 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar scroll-smooth px-2">
                {[{ id: 'joined', label: 'Joined', icon: Layers }, { id: 'incoming', label: 'Incoming', icon: UserPlus }, { id: 'sent', label: 'Sent', icon: Send }, { id: 'created', label: 'Created', icon: Archive }, { id: 'friends', label: 'Friend Request', icon: UserCheck }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 sm:gap-3 pb-4 font-bold border-b-2 whitespace-nowrap text-sm sm:text-base ${activeTab === tab.id ? 'border-b-[color:#a3ff33] text-black' : 'border-transparent text-gray-400'}`}>
                        <tab.icon size={18} /> <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {/* --- JOINED --- */}
                {activeTab === 'joined' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                        {isLoadingJoined ? <Loader2 className="animate-spin col-span-full mx-auto" size={40} /> : joinedTeams.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border border-dashed text-gray-400 font-bold uppercase tracking-widest text-xs">You have not joined any team</div>
                        ) : joinedTeams.map(team => (
                            <div key={team._id} onClick={() => handleTeamClick(team)} className="bg-white p-6 sm:p-10 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group cursor-pointer relative flex flex-col hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">{team.title}</h3>
                                    <Layers className="text-gray-200 group-hover:text-lime-custom transition-colors shrink-0" size={24} />
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1"><Building2 size={12} className="text-lime-custom" /> {team.organization}</div>
                                <p className="text-gray-500 text-sm mb-8 flex-grow leading-relaxed">{team.hackathonName}</p>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-full border border-gray-100 shadow-sm bg-lime-custom flex items-center justify-center text-black text-[10px] font-black">{getInitial(team.createdBy?.name)}</div>
                                        <span className="text-xs font-bold text-black truncate">Leader: {team.createdBy?.name}</span>
                                    </div>
                                    <div className="flex -space-x-2 shrink-0">
                                        {team.members?.map((m: any, i: number) => (
                                            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-black flex items-center justify-center text-lime-custom text-[10px] font-black">{getInitial(m.name)}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- INCOMING --- */}
                {activeTab === 'incoming' && (
                    <div className="space-y-6">
                        {isLoadingIncoming ? <Loader2 className="animate-spin text-lime-600 col-span-full mx-auto" size={40} /> : incomingRequests.length === 0 ? (
                            <div className="py-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200"><p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No pending applications found</p></div>
                        ) : incomingRequests.map((req) => (
                            <div key={req._id} onClick={() => handleTeamClick(req.ticket)} className="bg-white p-6 sm:p-10 rounded-[40px] border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm hover:border-lime-custom transition-all cursor-pointer group">
                                <div className="flex items-center gap-6">
                                    <div onClick={(e) => { e.stopPropagation(); setSelectedUser(req.applicant); }} className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-lime-custom font-black text-xl cursor-pointer">{getInitial(req.applicant?.name)}</div>
                                    <div>
                                        <p onClick={(e) => { e.stopPropagation(); setSelectedUser(req.applicant); }} className="inline-block font-bold text-black text-lg hover:underline cursor-pointer">{req.applicant?.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">APPLIED FOR <span className="text-black">{req.ticket?.title}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => handleUpdateStatus(req._id, 'ACCEPTED')} className="flex-1 sm:flex-none px-10 py-3 bg-black text-white hover:bg-gray-800 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95">Accept</button>
                                    <button onClick={() => handleUpdateStatus(req._id, 'REJECTED')} className="flex-1 sm:flex-none px-10 py-3 border border-gray-200 text-black hover:bg-gray-50 rounded-full font-bold text-sm transition-all active:scale-95">Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- CREATED --- */}
                {activeTab === 'created' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                        {isLoadingCreated ? <Loader2 className="animate-spin col-span-full mx-auto" size={40} /> : createdTeams.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200"><p className="text-gray-400 font-bold uppercase tracking-widest text-xs">You haven't created any teams yet</p></div>
                        ) : createdTeams.map(team => (
                            <div key={team._id} onClick={() => handleTeamClick(team)} className="bg-black text-white p-6 sm:p-10 rounded-[40px] hover:shadow-2xl transition-all group cursor-pointer relative flex flex-col hover:-translate-y-1">
                                <div className="absolute top-6 right-6 text-lime-custom/20 group-hover:text-lime-custom transition-all"><Sparkles size={24} /></div>
                                <div className="flex justify-between items-start mb-8"><div className="w-12 h-12 bg-lime-custom rounded-2xl flex items-center justify-center shadow-lime"><Archive className="text-black" size={24} /></div></div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tighter text-white">{team.title}</h3>
                                <div className="flex items-center gap-1.5 text-lime-custom/50 text-[10px] font-bold uppercase tracking-widest mb-1"><Building2 size={12} /> {team.organization}</div>
                                <p className="text-gray-400 text-sm mb-8 flex-grow leading-relaxed">{team.hackathonName}</p>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-800/50">
                                    <div className="flex -space-x-2">
                                        {team.members?.map((m: any, i: number) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-lime-custom flex items-center justify-center text-black text-[10px] font-black shadow-sm">{getInitial(m.name)}</div>
                                        ))}

                                    </div>
                                    <button className="px-6 py-2 bg-white text-black hover:bg-lime-custom rounded-full font-bold text-xs transition-all active:scale-95">Manage</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- FRIEND REQUEST --- */}
                {activeTab === 'friends' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                        {isLoadingFriends ? <Loader2 className="animate-spin col-span-full mx-auto" size={40} /> : friendRequests.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200"><p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No pending join requests</p></div>
                        ) : friendRequests.map(req => (
                            <div key={req._id} onClick={() => handleTeamClick(req.ticket)} className="bg-white p-6 sm:p-10 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group cursor-pointer flex flex-col hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">{req.ticket?.title}</h3>
                                    <UserPlus className="text-gray-200" size={24} />
                                </div>
                                <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-2xl border border-dashed border-gray-200">
                                    <div onClick={(e) => { e.stopPropagation(); setSelectedUser(req.requestedBy); }} className="w-10 h-10 rounded-full bg-black text-lime-custom flex items-center justify-center text-xs font-black cursor-pointer">{getInitial(req.requestedBy?.name)}</div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">WANTS TO JOIN</p>
                                        <p onClick={(e) => { e.stopPropagation(); setSelectedUser(req.requestedBy); }} className="text-xs font-bold text-black truncate hover:underline cursor-pointer">{req.requestedBy?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1"><Building2 size={12} className="text-lime-custom" /> {req.ticket?.hackathonName}</div>
                                <p className="text-gray-500 text-xs mb-8 flex-grow italic line-clamp-2">"{req.ticket?.organization}"</p>
                                <div className="flex gap-3 pt-6 border-t border-gray-50" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => handleRespondJoinRequest(req._id, 'ACCEPTED')} className="flex-1 bg-black text-white py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-lime-custom  transition-all">Accept</button>
                                    <button onClick={() => handleRespondJoinRequest(req._id, 'REJECTED')} className="flex-1 bg-gray-100 text-gray-500 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest">Ignore</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {/* --- SENT --- */}
                {activeTab === 'sent' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                        {isLoadingSent ? <Loader2 className="animate-spin col-span-full mx-auto" /> : sentRequests.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border border-dashed text-gray-400 font-bold uppercase tracking-widest text-xs">No sent requests found</div>
                        ) : sentRequests.map(app => (
                            <div key={app._id} onClick={() => {

                                handleTeamClick({
                                    ...app.ticket,
                                    createdAt: app.createdAt

                                })
                            }
                            } className="bg-white p-6 sm:p-10 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group cursor-pointer flex flex-col hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-6"><h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">{app.ticket?.title}</h3><Send className="text-blue-200 group-hover:text-blue-500" size={24} /></div>
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1"><Building2 size={12} className="text-blue-500" /> {app.ticket?.organization}</div>
                                <p className="text-gray-500 text-sm mb-8 flex-grow">Request sent on {new Date(app.createdAt).toLocaleDateString()}</p>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">STATUS: {app.status}</div>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteApplication(app._id); }} className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl transition-all shadow-sm"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Popups */}
            {showAllSkills && <SkillsModal skills={auth.user?.skills} onClose={() => setShowAllSkills(false)} />}
            {selectedUser && <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

            {/* {selectedTeam && (
                <TeamDetailModal
                    team={selectedTeam}
                    teamMembers={teamMembers}
                    isLoadingMembers={isLoadingMembers}
                    onClose={() => setSelectedTeam(null)}
                    openMemberProfile={(id: string) => {
                        const m = teamMembers.find(member => member._id === id);
                        if (m) setSelectedUser(m);
                    }}
                    getInitial={getInitial}
                    activeTab={activeTab}
                    authUser={auth.user}
                    onOpenRecommendations={() => handleFetchRecommendations(selectedTeam._id)}
                />
            )} */}
            {selectedTeam && (
                <TeamDetailModal
                    team={selectedTeam}
                    teamMembers={teamMembers}
                    isLoadingMembers={isLoadingMembers}
                    onClose={() => setSelectedTeam(null)}
                    openMemberProfile={(id: string) => {
                        const m = teamMembers.find(member => member._id === id);
                        if (m) setSelectedUser(m);
                    }}
                    getInitial={getInitial}
                    activeTab={activeTab}
                    onOpenRecommendations={() =>
                        handleFetchRecommendations(selectedTeam._id)
                    }
                    onRemoveMember={handleRemoveMember}
                />
            )}

            {showRecModal && (
                <AIRecommendationsModal
                    recommendations={recommendations}
                    isLoading={isLoadingRecs}
                    onClose={() => setShowRecModal(false)}
                    onSendRequest={handleSendInvite}
                    openMemberProfile={(id: any) => setSelectedUser(recommendations.find(r => (r.userId || r._id) === id))}
                    getInitial={getInitial}
                />
            )}
        </div>
    );
};

export default Profile;