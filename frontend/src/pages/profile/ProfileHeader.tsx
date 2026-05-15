import React from 'react';
import { Edit3, Save, Phone, Mail, Github, Linkedin, Globe, Plus, Loader2 } from 'lucide-react';
import type { User } from '../../types';

interface ProfileHeaderProps {
    user: User | null;
    isEditing: boolean;
    setIsEditing: (v: boolean) => void;
    editForm: User;
    setEditForm: (u: User) => void;
    handleSave: () => void;
    isUpdating: boolean;
    handleSkillsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setShowAllSkills: (v: boolean) => void;
    SKILL_LIMIT: number;
    getInitial: (n?: string) => string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    user, isEditing, setIsEditing, editForm, setEditForm, handleSave, isUpdating, handleSkillsChange, setShowAllSkills, SKILL_LIMIT, getInitial
}) => {
    return (
        <div className="bg-white rounded-[48px] border border-gray-100 p-8 sm:p-12 mb-12 flex flex-col md:flex-row gap-8 sm:gap-12 items-center md:items-start shadow-sm transition-all">
            {/* Avatar Section */}
            <div className="relative shrink-0">
                <div className="w-40 h-56 sm:w-48 sm:h-64 rounded-[40px] shadow-2xl bg-black flex items-center justify-center text-lime-custom text-7xl font-black ring-8 ring-gray-50/50">
                    {getInitial(user?.name)}
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

            {/* Info / Edit Section */}
            <div className="flex-grow space-y-4 w-full">
                {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top duration-300">
                        {/* Name & College */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                            <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-lime-custom outline-none" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="Full Name" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">College</label>
                            <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-lime-custom outline-none" value={editForm.college} onChange={e => setEditForm({ ...editForm, college: e.target.value })} placeholder="College Name" />
                        </div>

                        {/* Branch & Year */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Branch</label>
                            <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-lime-custom outline-none" value={editForm.branch} onChange={e => setEditForm({ ...editForm, branch: e.target.value })} placeholder="e.g. Computer Science" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Graduation Year</label>
                            <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-lime-custom outline-none" value={editForm.year} onChange={e => setEditForm({ ...editForm, year: e.target.value })} placeholder="e.g. 2026" />
                        </div>

                        {/* Contact & Devfolio */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Contact No</label>
                            <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-lime-custom outline-none" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} placeholder="Phone number" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Devfolio Profile</label>
                            <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-lime-custom outline-none" value={editForm.devfolio} onChange={e => setEditForm({ ...editForm, devfolio: e.target.value })} placeholder="Devfolio URL" />
                        </div>

                        {/* Socials */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">GitHub URL</label>
                            <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-lime-custom outline-none" value={editForm.github} onChange={e => setEditForm({ ...editForm, github: e.target.value })} placeholder="https://github.com/..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">LinkedIn URL</label>
                            <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-lime-custom outline-none" value={editForm.linkedin} onChange={e => setEditForm({ ...editForm, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
                        </div>

                        {/* Bio & Skills */}
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">About Bio</label>
                            <textarea rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-lime-custom outline-none resize-none" value={editForm.about} onChange={e => setEditForm({ ...editForm, about: e.target.value })} placeholder="Tell us about yourself..." />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Skills (Comma separated)</label>
                            <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-lime-custom outline-none" value={editForm.skills?.join(', ')} onChange={handleSkillsChange} placeholder="React, Node.js, Python..." />
                        </div>

                        {/* Buttons */}
                        <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                            <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-full border border-gray-200 font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                            <button onClick={handleSave} disabled={isUpdating} className="px-8 py-2 bg-black text-white rounded-full font-bold flex items-center gap-2 hover:bg-black/90 transition-colors shadow-lg disabled:opacity-50">
                                {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {isUpdating ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Display Mode */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-3">
                            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-black leading-tight">{user?.name}</h1>
                            {user?.isProfileComplete && <span className="text-lime-700 text-[10px] font-bold uppercase tracking-widest bg-lime-custom/20 px-2 py-0.5 rounded">Pro Member</span>}
                        </div>
                        <p className="text-lg sm:text-2xl text-gray-500 font-medium tracking-tight">
                            {user?.college} • {user?.branch} • {user?.year}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm font-medium text-gray-500 pt-2">
                            {user?.phone && <span className="flex items-center gap-2"><Phone size={16} className="text-lime-600" /> {user?.phone}</span>}
                            <span className="flex items-center gap-2"><Mail size={16} className="text-lime-600" /> {user?.email}</span>
                        </div>

                        <p className="text-gray-700 max-w-2xl leading-relaxed font-medium">{user?.about}</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4 border-t border-gray-50">
                            {user?.github && <a href={user.github} target="_blank" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-bold text-sm"><Github size={20} /> GitHub</a>}
                            {user?.linkedin && <a href={user.linkedin} target="_blank" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-bold text-sm"><Linkedin size={20} /> LinkedIn</a>}
                            {user?.devfolio && <a href={user.devfolio} target="_blank" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-bold text-sm"><Globe size={20} /> Devfolio</a>}
                        </div>

                        <div className="pt-8">
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 max-w-4xl">
                                {user?.skills?.slice(0, SKILL_LIMIT).map(skill => (
                                    <span key={skill} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-black shadow-sm">{skill}</span>
                                ))}
                                {user?.skills && user.skills.length > SKILL_LIMIT && (
                                    <button onClick={() => setShowAllSkills(true)} className="px-4 py-2 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:bg-black/80 transition-all shadow-lg">
                                        <Plus size={10} /> {user.skills.length - SKILL_LIMIT} More
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};