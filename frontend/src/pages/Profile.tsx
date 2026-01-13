
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { User as UserIcon, Mail, Github, Linkedin, Edit3, Save, Layers, UserPlus, Send, Archive, MapPin, Calendar, Users, X, ExternalLink, Sparkles, Zap, Building2, Trash2, Phone, Globe, Code, Plus, UserCheck, Check } from 'lucide-react';
import type { Request, Team, User } from '../types';

const Profile: React.FC = () => {
    const { auth, updateProfile, setMessage, setError } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'joined' | 'incoming' | 'sent' | 'created' | 'friends'>('joined');
    const [showAllSkills, setShowAllSkills] = useState(false);
    const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);
    const [editForm, setEditForm] = useState<User>({
        ...auth.user!,
        phone: auth.user?.phone || '',
        devfolio: auth.user?.devfolio || '',
        github: auth.user?.github || '',
        linkedin: auth.user?.linkedin || '',
        about: auth.user?.about || '',
        branch: auth.user?.branch || '',
        year: auth.user?.year || '',
        skills: auth.user?.skills || []
    });

    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const SKILL_LIMIT = 8;


    const getInitial = (name?: string) => (name ? name.charAt(0).toUpperCase() : '?');

    const handleSave = () => {
        updateProfile({ ...editForm, isProfileComplete: true });
        setIsEditing(false);
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
        setEditForm({ ...editForm, skills: skillsArray });
    };

    const openMemberProfile = (userId: string, name?: string) => {
        setSelectedUser({
            id: userId,
            name: name || 'Hacker Member',
            email: 'member@example.com',
            isProfileComplete: true,
            college: 'Hackoie University',
            skills: ['React', 'PostgreSQL', 'Cloud Native', 'AWS', 'Docker', 'Kubernetes', 'Go', 'Python', 'Redis', 'GraphQL'],
            about: 'Passionate hacker looking to win and build cool stuff.',
            github: 'https://github.com/hackoie-dev',
            linkedin: 'https://linkedin.com/in/hackoie-dev',
            phone: '+1 (987) 654-3210',
            devfolio: 'https://devfolio.co/@member'
        });
    };

    const handleUpdateStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
        setMessage(`Application ${status} successfully!`);
        setSelectedRequest(null);
    };

    const handleDeleteApplication = async (applicationId: string) => {
        setMessage("Application withdrawn.");
        setSelectedRequest(null);
    };

    const handleFriendRequest = async (id: string, action: 'accept' | 'ignore') => {
        setMessage(`Join request ${action === 'accept' ? 'accepted' : 'ignored'}.`);
    };

    const handleInviteUser = (userName: string) => {
        setMessage(`Request sent to ${userName} successfully!`);
    };

    // --- MOCK DATA ---
    const mockJoinedTeams: Team[] = [
        {
            id: 't4',
            title: 'Deep Learning Squad',
            organizationName: 'AI Hackathon Global',
            teamSize: 4,
            location: 'Online',
            date: 'Oct 20, 2024',
            hackathonName: 'AI-2024',
            hackathonLink: '#',
            requirementText: 'Developing a neural network for sentiment analysis on real-time news feeds.',
            createdBy: 'u5',
            creatorName: 'Jane Doe',
            members: [auth.user!.id, 'u5', 'u6']
        }
    ];

    const incomingRequests: Request[] = [
        {
            id: 'r1',
            ticketId: 't4',
            userId: 'u10',
            teamName: 'Deep Learning Squad',
            hackathonName: 'AI-2024',
            date: 'Oct 18, 2024',
            status: 'pending',
            applicantName: 'Sarah Smith'
        }
    ];

    // Modified mock data for Friend Request tab to be Team Cards
    const mockTeamJoinRequests = [
        {
            id: 'fr1',
            applicantName: 'Julian Casablancas',
            applicantId: 'j1',
            college: 'NYU',
            team: {
                id: 't10',
                title: 'Project Neural-Link',
                organizationName: 'Innovation Lab',
                teamSize: 5,
                location: 'Remote',
                date: 'Dec 12, 2024',
                hackathonName: 'GenAI 2024',
                hackathonLink: '#',
                requirementText: 'Building an interface for real-time brain-computer communication. We need neuro-specialists.',
                createdBy: auth.user!.id,
                creatorName: auth.user!.name,
                members: [auth.user!.id]
            }
        },
        {
            id: 'fr2',
            applicantName: 'Karen O',
            applicantId: 'k2',
            college: 'Parsons',
            team: {
                id: 't11',
                title: 'Cyber-Shield AI',
                organizationName: 'Defense Hack',
                teamSize: 3,
                location: 'London',
                date: 'Jan 15, 2025',
                hackathonName: 'Security Summit',
                hackathonLink: '#',
                requirementText: 'Building an AI firewall. Need security researchers and red-teamers.',
                createdBy: auth.user!.id,
                creatorName: auth.user!.name,
                members: [auth.user!.id]
            }
        }
    ];

    const sentRequests: Request[] = [
        {
            id: 'r2',
            ticketId: 't5',
            userId: auth.user!.id,
            teamName: 'Web3 Pioneers',
            hackathonName: 'Blockchain Global',
            date: 'Nov 05, 2024',
            status: 'pending'
        }
    ];

    const mockCreatedTeams: Team[] = [
        {
            id: 't1',
            title: 'Project Neural-Link',
            organizationName: 'Innovation Lab',
            teamSize: 5,
            location: 'Remote',
            date: 'Dec 12, 2024',
            hackathonName: 'GenAI 2024',
            hackathonLink: '#',
            requirementText: 'Building an interface for real-time brain-computer communication.',
            createdBy: auth.user!.id,
            creatorName: auth.user!.name,
            members: [auth.user!.id, 'u22']
        }
    ];

    const mockRecommendations = [
        { name: 'Sarah Jenkins', match: '98%', role: 'Rust Expert' },
        { name: 'David Miller', match: '94%', role: 'Backend Dev' },
        { name: 'Emma Wilson', match: '91%', role: 'UI/UX Lead' },
        { name: 'Liam Chen', match: '89%', role: 'Data Scientist' },
        { name: 'Sofia Rodriguez', match: '87%', role: 'Frontend Dev' }
    ];

    const mockGlobalTeams: Team[] = [
        {
            id: 't5',
            title: 'Web3 Pioneers',
            organizationName: 'Blockchain Global',
            teamSize: 3,
            location: 'Dubai',
            date: 'Nov 05, 2024',
            hackathonName: 'Web3 Summit',
            hackathonLink: '#',
            requirementText: 'Searching for a Solidity developer to build a decentralized identity protocol.',
            createdBy: 'u99',
            creatorName: 'Vitalik Mock',
            members: ['u99']
        }
    ];

    const getTeamForRequest = (req: Request): Team | null => {
        const allTeams = [...mockJoinedTeams, ...mockCreatedTeams, ...mockGlobalTeams];
        return allTeams.find(t => t.id === req.ticketId) || null;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8 sm:py-12 text-black overflow-x-hidden font-['Inter',sans-serif]">
            {/* Profile Header Card */}
            <div className="bg-white rounded-[32px] sm:rounded-[48px] border border-gray-100 p-6 sm:p-12 mb-8 sm:mb-12 flex flex-col md:flex-row gap-8 sm:gap-12 items-center md:items-start shadow-sm transition-all text-center md:text-left">
                <div className="relative shrink-0">
                    <div className="w-40 h-56 sm:w-48 sm:h-64 rounded-[40px] shadow-2xl bg-black flex items-center justify-center text-lime-custom text-7xl font-black ring-8 ring-gray-50/50">
                        {getInitial(auth.user?.name)}
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute -bottom-2 -right-2 w-12 h-12 bg-lime-custom rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform ring-4 ring-white"
                        >
                            <Edit3 size={20} className="text-black" />
                        </button>
                    )}
                </div>

                <div className="flex-grow space-y-4 w-full">
                    {isEditing ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top duration-300">
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-custom text-black font-medium" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="Name" />
                            </div>
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">College</label>
                                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-custom text-black" value={editForm.college} onChange={e => setEditForm({ ...editForm, college: e.target.value })} placeholder="College" />
                            </div>
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Branch</label>
                                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-custom text-black" value={editForm.branch} onChange={e => setEditForm({ ...editForm, branch: e.target.value })} placeholder="e.g. Computer Science" />
                            </div>
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Graduation Year</label>
                                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-custom text-black" value={editForm.year} onChange={e => setEditForm({ ...editForm, year: e.target.value })} placeholder="e.g. 2025" />
                            </div>
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Contact No</label>
                                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-custom text-black" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} placeholder="Contact No" />
                            </div>
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Devfolio</label>
                                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-custom text-black" value={editForm.devfolio} onChange={e => setEditForm({ ...editForm, devfolio: e.target.value })} placeholder="Devfolio URL" />
                            </div>
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">GitHub URL</label>
                                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-custom text-black" value={editForm.github} onChange={e => setEditForm({ ...editForm, github: e.target.value })} placeholder="https://github.com/..." />
                            </div>
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">LinkedIn URL</label>
                                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-custom text-black" value={editForm.linkedin} onChange={e => setEditForm({ ...editForm, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div className="md:col-span-2 space-y-1 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">About Bio</label>
                                <textarea className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-custom text-black resize-none" rows={3} value={editForm.about} onChange={e => setEditForm({ ...editForm, about: e.target.value })} placeholder="Tell us about yourself..." />
                            </div>
                            <div className="md:col-span-2 space-y-1 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Skills (Comma separated)</label>
                                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-custom text-black" value={editForm.skills?.join(', ')} onChange={handleSkillsChange} placeholder="React, Python, AWS..." />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                                <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-full border border-gray-200 font-bold text-black hover:bg-gray-50 transition-colors">Cancel</button>
                                <button onClick={handleSave} className="px-8 py-2 bg-black text-white rounded-full font-bold flex items-center gap-2 hover:bg-black/90 transition-colors">
                                    <Save size={18} /> Save Profile
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-3">
                                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-black leading-tight">{auth.user?.name}</h1>
                                {auth.user?.isProfileComplete && <span className="text-lime-700 text-[10px] font-bold uppercase tracking-widest bg-lime-custom/20 px-2 py-0.5 rounded">Pro Member</span>}
                            </div>
                            <p className="text-lg sm:text-2xl text-gray-500 font-medium tracking-tight">
                                {auth.user?.college} • {auth.user?.branch} • {auth.user?.year}
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm font-medium text-gray-500 pt-2">
                                {auth.user?.phone && (
                                    <span className="flex items-center gap-2">
                                        <Phone size={16} className="text-lime-600" /> {auth.user.phone}
                                    </span>
                                )}
                                <span className="flex items-center gap-2">
                                    <Mail size={16} className="text-lime-600" /> {auth.user?.email}
                                </span>
                            </div>

                            <p className="text-gray-700 max-w-2xl leading-relaxed text-sm sm:text-base font-medium">{auth.user?.about}</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4 border-t border-gray-50">
                                {auth.user?.github && (
                                    <a href={auth.user.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-bold text-sm">
                                        <Github size={20} /> GitHub
                                    </a>
                                )}
                                {auth.user?.linkedin && (
                                    <a href={auth.user.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-bold text-sm">
                                        <Linkedin size={20} /> LinkedIn
                                    </a>
                                )}
                                {auth.user?.devfolio && (
                                    <a href={auth.user.devfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-bold text-sm">
                                        <Globe size={20} /> Devfolio
                                    </a>
                                )}
                            </div>

                            <div className="pt-8">
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 max-w-4xl">
                                    {auth.user?.skills?.slice(0, SKILL_LIMIT).map(skill => (
                                        <span key={skill} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-black shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                    {auth.user?.skills && auth.user.skills.length > SKILL_LIMIT && (
                                        <button
                                            onClick={() => setShowAllSkills(true)}
                                            className="px-4 py-2 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:bg-black/80 transition-all shadow-lg"
                                        >
                                            <Plus size={10} /> {auth.user.skills.length - SKILL_LIMIT} More
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Tabs Section */}
            <div className="flex gap-6 sm:gap-12 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar scroll-smooth px-2">
                {[
                    { id: 'joined', label: 'Joined', icon: Layers },
                    { id: 'incoming', label: 'Incoming', icon: UserPlus },
                    { id: 'sent', label: 'Sent', icon: Send },
                    { id: 'created', label: 'Created', icon: Archive },
                    { id: 'friends', label: 'Friend Request', icon: UserCheck }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 sm:gap-3 pb-4 font-bold transition-all border-b-2 whitespace-nowrap text-sm sm:text-base ${activeTab === tab.id ? 'border-b-[color:#a3ff33] text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'joined' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                        {mockJoinedTeams.map(team => (
                            <div key={team.id} onClick={() => setSelectedTeam(team)} className="bg-white p-6 sm:p-10 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group cursor-pointer relative flex flex-col hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl sm:text-2xl font-bold group-hover:text-black transition-colors text-black tracking-tight">{team.title}</h3>
                                    <Layers className="text-gray-200 group-hover:text-lime-custom transition-colors shrink-0" size={24} />
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                                    <Building2 size={12} className="text-lime-custom" />
                                    {team.organizationName}
                                </div>
                                <p className="text-gray-500 text-sm mb-8 flex-grow leading-relaxed">{team.hackathonName}</p>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-3 overflow-hidden" onClick={(e) => { e.stopPropagation(); openMemberProfile(team.createdBy, team.creatorName); }}>
                                        <div className="w-8 h-8 rounded-full border border-gray-100 shadow-sm bg-lime-custom flex items-center justify-center text-black text-[10px] font-black">
                                            {getInitial(team.creatorName)}
                                        </div>
                                        <span className="text-xs font-bold text-black truncate hover:underline">Leader: {team.creatorName}</span>
                                    </div>
                                    <div className="flex -space-x-2 shrink-0">
                                        {team.members.map((m, i) => (
                                            <div key={i} onClick={(e) => { e.stopPropagation(); openMemberProfile(m); }} className="w-7 h-7 rounded-full border-2 border-white bg-black flex items-center justify-center hover:scale-110 transition-transform shadow-sm text-lime-custom text-[10px] font-black">
                                                {getInitial()}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'friends' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                        {mockTeamJoinRequests.map(req => (
                            <div
                                key={req.id}
                                onClick={() => setSelectedTeam(req.team)}
                                className="bg-white p-6 sm:p-10 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group cursor-pointer relative flex flex-col hover:-translate-y-1"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl sm:text-2xl font-bold group-hover:text-black transition-colors text-black tracking-tight">{req.team.title}</h3>
                                    <UserPlus className="text-gray-200 group-hover:text-lime-custom transition-colors shrink-0" size={24} />
                                </div>

                                <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-2xl border border-dashed border-gray-200">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openMemberProfile(req.applicantId, req.applicantName); }}
                                        className="shrink-0"
                                    >
                                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-black text-lime-custom flex items-center justify-center text-xs font-black">
                                            {getInitial(req.applicantName)}
                                        </div>
                                    </button>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wants to join</p>
                                        <p
                                            onClick={(e) => { e.stopPropagation(); openMemberProfile(req.applicantId, req.applicantName); }}
                                            className="text-xs font-bold text-black truncate hover:underline"
                                        >
                                            {req.applicantName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                                    <Building2 size={12} className="text-lime-custom" />
                                    {req.team.organizationName}
                                </div>
                                <p className="text-gray-500 text-xs mb-8 flex-grow leading-relaxed line-clamp-2 italic">"{req.team.requirementText}"</p>

                                <div className="flex gap-3 pt-6 border-t border-gray-50" onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={() => handleFriendRequest(req.id, 'accept')}
                                        className="flex-1 bg-black text-white py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-lime-custom hover:text-black transition-all shadow-sm active:scale-95"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleFriendRequest(req.id, 'ignore')}
                                        className="flex-1 bg-gray-100 text-gray-500 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                                    >
                                        Ignore
                                    </button>
                                </div>
                            </div>
                        ))}
                        {mockTeamJoinRequests.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No pending join requests</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'incoming' && (
                    <div className="space-y-4">
                        {incomingRequests.map(req => (
                            <div key={req.id} onClick={() => setSelectedRequest(req)} className="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:border-lime-custom transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div onClick={(e) => { e.stopPropagation(); openMemberProfile(req.userId, req.applicantName); }} className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-lime-custom font-black">
                                        {getInitial(req.applicantName)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-black hover:underline" onClick={(e) => { e.stopPropagation(); openMemberProfile(req.userId, req.applicantName); }}>{req.applicantName}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Applied for <span className="text-black font-bold">{req.teamName}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => handleUpdateStatus(req.id, 'accepted')} className="flex-1 sm:flex-none px-6 py-2 bg-black text-white hover:bg-black/90 rounded-full font-bold text-sm transition-all shadow-sm">Accept</button>
                                    <button onClick={() => handleUpdateStatus(req.id, 'rejected')} className="flex-1 sm:flex-none px-6 py-2 border border-gray-200 text-black rounded-full font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all">Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'sent' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                        {sentRequests.map(req => (
                            <div key={req.id} onClick={() => { setSelectedRequest(req); setSelectedTeam(getTeamForRequest(req)); }} className="bg-white p-6 sm:p-10 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group cursor-pointer relative flex flex-col hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl sm:text-2xl font-bold group-hover:text-black transition-colors text-black tracking-tight">{req.teamName}</h3>
                                    <Send className="text-blue-200 group-hover:text-blue-500 transition-colors shrink-0" size={24} />
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                                    <Building2 size={12} className="text-blue-500" />
                                    {req.hackathonName}
                                </div>
                                <p className="text-gray-500 text-sm mb-8 flex-grow leading-relaxed">Request sent on {req.date}</p>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                        Status: {req.status}
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteApplication(req.id); }}
                                        className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl transition-all"
                                        title="Withdraw Application"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'created' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                        {mockCreatedTeams.map(team => (
                            <div key={team.id} onClick={() => setSelectedTeam(team)} className="bg-black text-white p-6 sm:p-10 rounded-[40px] hover:shadow-2xl transition-all group cursor-pointer relative flex flex-col hover:-translate-y-1">
                                <div className="absolute top-6 right-6 text-lime-custom/20 group-hover:text-lime-custom transition-all">
                                    <Sparkles size={24} />
                                </div>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-12 h-12 bg-lime-custom rounded-2xl flex items-center justify-center shadow-lime">
                                        <Archive className="text-black" size={24} />
                                    </div>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tighter text-white">{team.title}</h3>
                                <div className="flex items-center gap-1.5 text-lime-custom/50 text-[10px] font-bold uppercase tracking-widest mb-1">
                                    <Building2 size={12} />
                                    {team.organizationName}
                                </div>
                                <p className="text-gray-400 text-sm mb-8 flex-grow leading-relaxed">{team.hackathonName}</p>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-800/50">
                                    <div className="flex -space-x-2">
                                        {team.members.map((m, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-lime-custom flex items-center justify-center hover:scale-110 transition-transform shadow-sm text-black text-[10px] font-black">
                                                {getInitial()}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="px-6 py-2 bg-white text-black hover:bg-lime-custom rounded-full font-bold text-xs transition-all active:scale-95"
                                    >
                                        Manage
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Skills Popup */}
            {showAllSkills && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-6" onClick={() => setShowAllSkills(false)}>
                    <div className="bg-white w-full max-w-2xl rounded-[40px] p-8 sm:p-12 relative animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowAllSkills(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                                <Code className="text-lime-custom" size={24} />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter">My Full Skillset</h2>
                        </div>
                        <div className="flex flex-wrap gap-3 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar p-2">
                            {auth.user?.skills?.map(skill => (
                                <span key={skill} className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold uppercase tracking-widest text-black shadow-sm ring-1 ring-black/5">
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setShowAllSkills(false)} className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-black/90 transition-all shadow-xl">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Shared User Profile Popup */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[400] flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedUser(null)}>
                    <div className="bg-white w-full max-w-lg rounded-[48px] p-8 sm:p-12 text-center relative text-black shadow-2xl animate-in fade-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                        {/* <div className="w-32 h-32 rounded-[32px] mx-auto border-4 border-lime-custom mb-6 shadow-xl bg-black flex items-center justify-center text-lime-custom text-5xl font-black">
                            {getInitial(selectedUser.name)}
                        </div> */}
                        <h2 className="text-3xl font-bold mb-1 tracking-tighter">{selectedUser.name}</h2>
                        <p className="text-gray-500 font-bold mb-6 uppercase tracking-widest text-[10px]">{selectedUser.college}</p>
                        <div className="flex justify-center gap-4 mb-8">
                            {selectedUser.github && (
                                <a href={selectedUser.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all transform hover:-translate-y-1"><Github size={20} /></a>
                            )}
                            {selectedUser.linkedin && (
                                <a href={selectedUser.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"><Linkedin size={20} /></a>
                            )}
                            {selectedUser.devfolio && (
                                <a href={selectedUser.devfolio} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-2xl hover:bg-[#3770FF] hover:text-white transition-all transform hover:-translate-y-1"><Globe size={20} /></a>
                            )}
                        </div>
                        <div className="flex flex-col items-center gap-2 mb-6 text-xs sm:text-sm font-medium text-gray-600">
                            {selectedUser.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-lime-600" /> {selectedUser.phone}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 mb-8 max-h-32 overflow-y-auto custom-scrollbar p-2 bg-gray-50 rounded-2xl">
                            {selectedUser.skills?.map(s => (<span key={s} className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-[9px] font-bold uppercase tracking-wider text-black shadow-sm">{s}</span>))}
                        </div>
                        <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 mb-8">
                            <p className="text-gray-700 leading-relaxed italic text-sm">"{selectedUser.about}"</p>
                        </div>
                        <button onClick={() => setSelectedUser(null)} className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-black/90 transition-colors shadow-lg">Close</button>
                    </div>
                </div>
            )}

            {/* AI Recommendations Popup (Dedicated Modal) */}
            {showRecommendationsModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[300] flex items-center justify-center p-4 sm:p-6" onClick={() => setShowRecommendationsModal(false)}>
                    <div className="bg-white w-full max-w-2xl rounded-[48px] p-8 sm:p-12 relative shadow-2xl animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowRecommendationsModal(false)} className="absolute top-10 right-10 p-3 hover:bg-gray-100 rounded-full transition-colors">
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
                            {mockRecommendations.map((rec, i) => (
                                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-6 bg-gray-50 p-6 rounded-[32px] hover:bg-white hover:shadow-xl transition-all border border-gray-100 group">
                                    <div
                                        className="flex items-center gap-5 flex-grow cursor-pointer"
                                        onClick={() => openMemberProfile('rec-' + i, rec.name)}
                                    >
                                        <div className="relative shrink-0 text-center">
                                            <div className="w-16 h-16 rounded-2xl border-2 border-white shadow-xl bg-black flex items-center justify-center text-lime-custom font-black">
                                                {getInitial(rec.name)}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 bg-lime-custom text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-sm border border-white">
                                                {rec.match}
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-black text-lg font-bold tracking-tight group-hover:underline">{rec.name}</h3>
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">{rec.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleInviteUser(rec.name)}
                                        className="w-full sm:w-auto px-8 py-3.5 bg-black text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-lime-custom hover:text-black transition-all shadow-xl active:scale-95"
                                    >
                                        Send Request
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowRecommendationsModal(false)}
                                className="px-10 py-4 border border-gray-200 text-black font-bold rounded-full hover:bg-gray-50 transition-all"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Team Detail Modal */}
            {(selectedTeam || selectedRequest) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto" onClick={() => { setSelectedTeam(null); setSelectedRequest(null); setShowRecommendationsModal(false); }}>
                    <div className="bg-white w-full max-w-2xl rounded-[32px] sm:rounded-[48px] p-6 sm:p-12 relative shadow-2xl text-black animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setSelectedTeam(null); setSelectedRequest(null); setShowRecommendationsModal(false); }} className="absolute top-6 sm:top-10 right-6 sm:right-10 p-3 hover:bg-gray-100 rounded-full transition-colors z-10"><X size={24} /></button>

                        {(() => {
                            const team = selectedTeam || (selectedRequest ? getTeamForRequest(selectedRequest) : null);
                            if (!team) return (
                                <div className="py-20 text-center">
                                    <Archive className="mx-auto text-gray-200 mb-6" size={64} />
                                    <h2 className="text-2xl font-bold tracking-tight mb-2">Team Details Unavailable</h2>
                                    <p className="text-gray-500">The team information could not be retrieved at this time.</p>
                                </div>
                            );
                            return (
                                <div className="space-y-6 sm:space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shrink-0"><Zap className="text-lime-custom w-6 h-6 fill-current" /></div>
                                        <div className="overflow-hidden"><span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block">Project Info</span><h2 className="text-2xl sm:text-4xl font-bold tracking-tight truncate">{team.title}</h2></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2 text-base sm:text-lg text-gray-600 font-bold"><Building2 size={20} className="text-lime-600" /> {team.organizationName}</div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-gray-700 text-sm font-medium"><MapPin size={18} /> {team.location}</div>
                                                <div className="flex items-center gap-3 text-gray-700 text-sm font-medium"><Calendar size={18} /> {team.date}</div>
                                                <div className="flex items-center gap-3 text-gray-700 text-sm font-medium"><Users size={18} /> {team.members.length} / {team.teamSize} Slots</div>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Members</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {team.members.map((m, idx) => (
                                                        <button key={idx} onClick={() => openMemberProfile(m)} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hover:bg-lime-custom/10 transition-colors">
                                                            <div className="w-5 h-5 rounded-full ring-1 ring-white bg-black text-lime-custom flex items-center justify-center text-[7px] font-black">
                                                                {getInitial()}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-gray-600">{m === auth.user?.id ? 'You' : `Member ${idx + 1}`}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Hackathon Mission</h4>
                                            <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar text-gray-700 leading-relaxed text-sm bg-gray-50 p-6 rounded-[32px] border border-gray-100 italic mb-6">
                                                {team.requirementText}
                                            </div>

                                            {/* AI Recommendations Trigger Button */}
                                            {team.createdBy === auth.user?.id && (
                                                <div className="mt-auto">
                                                    <button
                                                        onClick={() => setShowRecommendationsModal(true)}
                                                        className="w-full py-4 bg-lime-custom text-black font-black text-xs uppercase tracking-widest rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg active:scale-95"
                                                    >
                                                        <Sparkles size={16} /> View AI Recommendations
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                                        <a href={team.hackathonLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-100 text-center py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-sm">Hackathon <ExternalLink size={16} /></a>
                                        {selectedRequest && activeTab === 'sent' ? (
                                            <button onClick={() => handleDeleteApplication(selectedRequest.id)} className="flex-1 bg-red-50 text-red-600 py-4 rounded-full font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm"><Trash2 size={18} /> Withdraw</button>
                                        ) : (
                                            team.createdBy === auth.user?.id ? (
                                                <button onClick={() => setMessage("Management updated!")} className="flex-1 bg-black text-white py-4 rounded-full font-bold text-sm">Manage Broadcast</button>
                                            ) : (
                                                <button disabled className="flex-1 bg-gray-100 text-gray-400 py-4 rounded-full font-bold cursor-not-allowed text-sm">Active Member</button>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
