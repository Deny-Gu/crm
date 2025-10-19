import type { UserRole } from "../const/users";

export type Credentials = { login: string; password: string }

export type User = { 
  id: string; 
  login: string;
  fullName: string;
  city: string;
  district: string;
  contacts: string;
  telegram: string;
  registeredAt: string;
  lastActivity: string;
  transportMode: string;
  workingDays: string[];
  role: UserRole;
}

export type AuthState = { user: User | null }

export type AuthContextValue = AuthState & {
  ready: boolean
  signIn: (creds: Credentials) => Promise<{ user: User; accessToken: string; }>
  signOut: () => void
}

export type Order = {
  id: string
  masterId: string
  customerName: string
  description: string
  status: 'новый' | 'в работе' | 'завершён'
  dueDate: string // ISO
}
