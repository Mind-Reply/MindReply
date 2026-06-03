import { create } from 'zustand';
import type { User, Membership } from '@/types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  membership: Membership | null;
  credits: number;
  setUser: (user: User | null) => void;
  setAuthenticated: (auth: boolean) => void;
  setMembership: (membership: Membership | null) => void;
  setCredits: (credits: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  membership: null,
  credits: 0,
  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setMembership: (membership) => set({ membership }),
  setCredits: (credits) => set({ credits }),
}));
