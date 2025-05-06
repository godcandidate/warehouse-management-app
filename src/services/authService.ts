import type { User } from '../types/index';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '../mock/mockApi';

interface TokenPayload {
  userId: string;
  exp: number;
}

export const loginUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // Using mock API instead of real API call
  const response = await authApi.login(email, password);
  const { user, token } = response.data;
  
  // Store token
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', token); // Using the same token for simplicity in mock
  
  return { user, token };
};

export const logoutUser = async (): Promise<void> => {
  try {
    // Using mock API instead of real API call
    await authApi.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

export const refreshToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  // Using mock API instead of real API call
  const response = await authApi.refreshToken();
  return response.data;
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  // Using mock API instead of real API call
  const response = await authApi.getCurrentUser();
  return response.data;
};
