export interface User {
  userId: number;
  email: string;
  name: string;
  lastLogin: string;
  regTime: string;
  isActive: number;
}

export interface AuthResponse {
  userId: number;
  email: string;
  name: string;
  token: string;
  lastLogin: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}