export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'professional' | 'client';
  createdAt: Date;
}

export interface Professional {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: 'available' | 'booked' | 'offline';
  languages: string[];
}

export interface Booking {
  id: string;
  clientId: string;
  professionalId: string;
  startTime: Date;
  endTime: Date;
  mode: 'text' | 'call' | 'video';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
}

export interface Lexicon {
  id: string;
  name: string;
  category: string;
  terms: LexiconTerm[];
}

export interface LexiconTerm {
  id: string;
  term: string;
  definition: string;
  context: string;
}

export interface MicroTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  creditCost: number;
  category: string;
}

export enum MembershipTier {
  CURATOR = 'curator',
  STRATEGIST = 'strategist',
  SOVEREIGN = 'sovereign',
}

export interface Membership {
  id: string;
  userId: string;
  tier: MembershipTier;
  status: 'active' | 'cancelled' | 'expired';
  credits: number;
}
