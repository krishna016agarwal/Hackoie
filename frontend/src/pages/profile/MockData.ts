import type { Team, Request, User } from '../../types';

export const getMockData = (currentUser: User) => ({
    incomingRequests: [
        { id: 'r1', ticketId: 't4', userId: 'u10', teamName: 'Deep Learning Squad', hackathonName: 'AI-2024', status: 'pending', applicantName: 'Sarah Smith' }
    ] as Request[],
    mockTeamJoinRequests: [
        { id: 'fr1', applicantName: 'Julian Casablancas', applicantId: 'j1', college: 'NYU', team: { id: 't10', title: 'Project Neural-Link', organizationName: 'Innovation Lab', teamSize: 5, location: 'Remote', date: 'Dec 12, 2024', hackathonName: 'GenAI 2024', requirementText: 'Need neuro-specialists.', createdBy: currentUser.id, creatorName: currentUser.name, members: [currentUser.id] } }
    ],
    sentRequests: [
        { id: 'r2', ticketId: 't5', userId: currentUser.id, teamName: 'Web3 Pioneers', hackathonName: 'Blockchain Global', date: 'Nov 05, 2024', status: 'pending' }
    ] as Request[],
    mockCreatedTeams: [
        { id: 't1', title: 'Project Neural-Link', organizationName: 'Innovation Lab', teamSize: 5, location: 'Remote', hackathonName: 'GenAI 2024', createdBy: currentUser.id, creatorName: currentUser.name, members: [currentUser.id] }
    ] as Team[],
    mockRecommendations: [
        { name: 'Sarah Jenkins', match: '98%', role: 'Rust Expert' },
        { name: 'David Miller', match: '94%', role: 'Backend Dev' }
    ]
});