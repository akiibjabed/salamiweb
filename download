import { Timestamp } from 'firebase/firestore';

export interface Pass {
  id?: string;
  name: string;
  token: string;
  isUsed: boolean;
  createdAt: Timestamp | Date;
}

export interface Claim {
  id?: string;
  name: string;
  amount: number;
  bkashNumber: string;
  status: 'pending' | 'paid';
  claimedAt: Timestamp | Date;
  passToken?: string;
}

export type AppState = 'landing' | 'claim' | 'spin' | 'result' | 'admin';
