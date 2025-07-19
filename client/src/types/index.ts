export interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  role: 'client' | 'admin';
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface GameResult {
  result: 'gagné' | 'perdu';
  generatedNumber: number;
  newBalance: number;
  balanceChange: number;
}

export interface GameHistoryEntry {
  _id?: string;
  gameId: string;
  userId?: string;
  date: string;
  generatedNumber: number;
  result: 'gagné' | 'perdu';
  balanceChange: number;
  newBalance: number;
  user?: {
    username: string;
    email: string;
  };
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateUserData extends RegisterData {
  role: 'client' | 'admin';
}

export interface UpdateUserData {
  username: string;
  email: string;
  phone: string;
  role: 'client' | 'admin';
  balance: number;
}