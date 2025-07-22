import axios from 'axios';
import { 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  User, 
  GameResult, 
  GameHistoryEntry,
  CreateUserData,
  UpdateUserData
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://truenumber-production.up.railway.app/api';

// Configuration d'axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  async register(data: RegisterData): Promise<{ message: string; user: User }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    const { token, user } = response.data;
    
    // Stocker le token et les données utilisateur
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};

// Services utilisateur
export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  },

  async getAllUsers(): Promise<{ users: User[] }> {
    const response = await api.get('/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(data: CreateUserData): Promise<User> {
    const response = await api.post('/users', data);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};

// Services de jeu
export const gameService = {
  async play(): Promise<GameResult> {
    const response = await api.post('/game/play');
    return response.data;
  }
};

// Services de solde
export const balanceService = {
  async getBalance(): Promise<{ balance: number }> {
    const response = await api.get('/balance');
    return response.data;
  }
};

// Services d'historique
export const historyService = {
  async getUserHistory(): Promise<{ history: GameHistoryEntry[] }> {
    const response = await api.get('/history');
    return response.data;
  },

  async getAllHistory(): Promise<{ history: GameHistoryEntry[] }> {
    const response = await api.get('/history/all');
    return response.data;
  }
};

export default api;