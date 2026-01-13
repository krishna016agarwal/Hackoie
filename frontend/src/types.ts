
export interface User {
  id: string;
  name: string;
  email: string;
  about?: string;
  college?: string;
  branch?: string;
  year?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  phone?: string;
  devfolio?: string;
  isProfileComplete: boolean;
  isAdmin?: boolean;
}

export interface Team {
  id: string;
  title: string;
  organizationName: string;
  teamSize: number;
  location: string;
  date: string;
  hackathonName: string;
  hackathonLink: string;
  requirementText: string;
  createdBy: string;
  creatorName: string;
  members: string[]; // User IDs
}

export interface Request {
  id: string;
  ticketId: string;
  userId: string;
  teamName: string;
  hackathonName: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
  applicantName?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
