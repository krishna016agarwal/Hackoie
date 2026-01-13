import React from 'react';
import { X, Code, Github, ExternalLink, Sparkles, Linkedin, Globe, Phone, Zap, Building2, Mail, MapPin, Calendar, Users,Trash2, Loader2 } from 'lucide-react';

// --- EXACT SKILLS UI ---
export const SkillsModal = ({ skills, onClose }: any) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[600] flex items-center justify-center p-6" onClick={onClose}>
        <div className="bg-white w-full max-w-2xl rounded-[40px] p-8 sm:p-12 relative animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
            </button>
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                    <Code className="text-lime-custom" size={24} />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter">My Full Skillset</h2>
            </div>
            <div className="flex flex-wrap gap-3 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar p-2">
                {skills?.map((skill: string) => (
                    <span key={skill} className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold uppercase tracking-widest text-black shadow-sm ring-1 ring-black/5">
                        {skill}
                    </span>
                ))}
            </div>
            <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end">
                <button onClick={onClose} className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-black/90 transition-all shadow-xl">Close</button>
            </div>
        </div>
    </div>
);

// --- EXACT USER PROFILE UI ---
export const UserProfileModal = ({ user, onClose }: any) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[700] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
        <div className="bg-white w-full max-w-lg rounded-[48px] p-8 sm:p-12 text-center relative text-black shadow-2xl animate-in fade-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            <h2 className="text-3xl font-bold mb-1 tracking-tighter">{user.name}</h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mb-4">
                {[user.college, user.branch, user.year]
                    .filter(Boolean)
                    .join(" • ")}
            </p>
            {/* Branch and Year display */}

            <div className="flex justify-center gap-4 mb-1">
                {user.github && <a href={user.github} target="_blank" className="p-3 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all transform hover:-translate-y-1"><Github size={20} /></a>}
                {user.linkedin && <a href={user.linkedin} target="_blank" className="p-3 bg-gray-50 rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"><Linkedin size={20} /></a>}
                {user.devfolio && <a href={user.devfolio} target="_blank" className="p-3 bg-gray-50 rounded-2xl hover:bg-[#3770FF] hover:text-white transition-all transform hover:-translate-y-1"><Globe size={20} /></a>}
            </div>
            <div className="flex justify-center items-center gap-3 text-gray-500 font-bold ">
                {user?.phone && (
                    <div className="flex items-center gap-3">
                        <Phone size={20} className="text-lime-600" />
                        <span>{user.phone}</span>
                    </div>
                )}
                {/* Added Email Display as requested */}
                <div className="flex items-center gap-3"><Mail size={20} className="text-lime-600" /> <span>{user.email}</span></div>
            </div>
            <div className="flex flex-col items-center gap-2 mb-6 text-xs sm:text-sm font-medium text-gray-600">
                {user.contactNo && <div className="flex items-center gap-2"><Phone size={14} className="text-lime-600" /> {user.contactNo}</div>}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-8 max-h-32 overflow-y-auto custom-scrollbar p-2 bg-gray-50 rounded-2xl">
                {user.skills?.map((s: any) => (<span key={s} className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-[9px] font-bold uppercase tracking-wider text-black shadow-sm">{s}</span>))}
            </div>


            <button onClick={onClose} className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-black/90 transition-colors shadow-lg">Close</button>
        </div>
    </div>
);

// --- EXACT TEAM DETAIL UI ---
export const TeamDetailModal = ({ team,
    teamMembers,
    isLoadingMembers,
    onClose,
    openMemberProfile,
    getInitial,
    activeTab,
    onOpenRecommendations,
    onRemoveMember }: any) => (
    
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto" onClick={onClose}>
        <div className="bg-white w-full max-w-3xl rounded-[48px] p-6 sm:p-12 relative shadow-2xl text-black animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-6 sm:top-10 right-6 sm:right-10 p-3 hover:bg-gray-100 rounded-full transition-colors z-10"><X size={24} /></button>
            <div className="space-y-6 sm:space-y-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shrink-0"><Zap className="text-lime-custom w-6 h-6 fill-current" /></div>
                    <div className="overflow-hidden"><span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block">Project Info</span><h2 className="text-2xl sm:text-4xl font-bold tracking-tight truncate">{team.title}</h2></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-base sm:text-lg text-gray-600 font-bold"><Building2 size={20} className="text-lime-600" /> {team.organization}</div>
                        <div className="space-y-3 text-gray-700 text-sm font-medium">
                            <div className="flex items-center gap-3"><MapPin size={18} /> {team.location}</div>
                            <div className="flex items-center gap-3"><Calendar size={18} /> {new Date(team.createdAt).toLocaleDateString()}</div>
                            <div className="flex items-center gap-3"><Users size={18} /> {team.members?.length} / {team.teamSize} Slots</div>
                        </div>
                        {/* <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Members</h4>
                            <div className="flex flex-wrap gap-2">
                                {isLoadingMembers ? <Loader2 className="animate-spin" /> : teamMembers?.map((m: any, idx: number) => (
                                    <button key={idx} onClick={() => openMemberProfile(m._id)} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hover:bg-lime-custom/10 transition-colors">
                                        <div className="w-5 h-5 rounded-full bg-black text-lime-custom flex items-center justify-center text-[7px] font-black">{getInitial(m.name)}</div>
                                        <span className="text-[10px] font-bold text-gray-600">{m.name}</span>
                                    </button>
                                ))}
                                
                            </div>
                        </div> */}
                        <div>
    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
        Members
    </h4>

    <div className="flex flex-wrap gap-2">
        {isLoadingMembers ? (
            <Loader2 className="animate-spin" />
        ) : (
            teamMembers?.map((m: any) => (
                <div
                    key={m._id}
                    className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
                >
                    <button
                        onClick={() => openMemberProfile(m._id)}
                        className="flex items-center gap-2"
                    >
                        <div className="w-5 h-5 rounded-full bg-black text-lime-custom flex items-center justify-center text-[7px] font-black">
                            {getInitial(m.name)}
                        </div>
                        <span className="text-[10px] font-bold text-gray-600">
                            {m.name}
                        </span>
                    </button>

                    {/* 🗑️ REMOVE MEMBER (ONLY FOR CREATED TAB) */}
                    {activeTab === 'created' && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveMember(m._id);
                            }}
                            className="ml-1 text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
            ))
        )}
    </div>
</div>

                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Hackathon Mission</h4>
                        <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar text-gray-700 leading-relaxed text-sm bg-gray-50 p-6 rounded-[32px] border border-gray-100 italic mb-6 shadow-inner">
                            {team.description}
                        </div>
                        {/* SHOW AI RECOMMENDATIONS ONLY IN CREATED TAB */}
                        {activeTab === 'created' && (
                            <button onClick={onOpenRecommendations} className="w-full py-4 bg-lime-custom text-black font-black text-xs uppercase tracking-widest rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg active:scale-95">
                                <Sparkles size={16} /> View AI Recommendations
                            </button>
                        )}
                    </div>
                </div>
                <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                    <button
                        className="flex-1 bg-gray-100 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-sm"
                        onClick={() => window.open(team.hackathonLink, "_blank")} // opens in a new tab
                    >
                        Hackathon <ExternalLink size={16} />
                    </button>

                    {/* SHOW MANAGE BROADCAST ONLY IN CREATED TAB
                    {activeTab === 'created' && (
                        <button className="flex-1 bg-black text-white py-4 rounded-full font-bold text-sm shadow-xl">Manage Broadcast</button>
                    )} */}
                </div>
            </div>
        </div>
    </div>
);

// --- AI Recommendations Modal  ---
export const AIRecommendationsModal = ({ recommendations, isLoading, onClose, onSendRequest, openMemberProfile, getInitial }: any) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[600] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
        <div className="bg-white w-full max-w-2xl rounded-[48px] p-8 sm:p-12 relative shadow-2xl animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-10 right-10 p-3 hover:bg-gray-100 rounded-full transition-colors">
                <X size={28} className="text-black" />
            </button>

            <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-2xl">
                    <Sparkles className="text-lime-custom fill-current" size={28} />
                </div>
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-black">Top Recommendations</h2>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Personalized AI matching for your team</p>
                </div>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-lime-600" size={40} />
                        <p className="text-gray-400 font-bold animate-pulse">AI is analyzing hackers...</p>
                    </div>
                ) : recommendations.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 font-bold">No recommendations found yet.</p>
                ) : (
                    recommendations.map((rec: any, i: number) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-6 bg-gray-50 p-6 rounded-[32px] hover:bg-white hover:shadow-xl transition-all border border-gray-100 group">
                            <div className="flex items-center gap-5 flex-grow cursor-pointer" onClick={() => openMemberProfile(rec.userId || rec._id)}>
                                <div className="relative shrink-0">
                                    <div className="w-16 h-16 rounded-2xl border-2 border-white shadow-xl bg-black flex items-center justify-center text-lime-custom font-black">
                                        {getInitial(rec.name)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-lime-custom text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-sm border border-white">
                                        {rec.match || '90%'}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-black text-lg font-bold tracking-tight group-hover:underline">{rec.name}</h3>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">{rec.role || 'Hacker'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onSendRequest(rec.userId || rec._id)}
                                className="w-full sm:w-auto px-8 py-3.5 bg-black text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-lime-custom transition-all active:scale-95"
                            >
                                Send Request
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                <button onClick={onClose} className="px-10 py-4 border border-gray-200 text-black font-bold rounded-full hover:bg-gray-50 transition-all">Dismiss</button>
            </div>
        </div>
    </div>
);