import type { User, Reward, RedeemResponse, TokenResponse, RedemptionHistoryItem, UserListItem } from '../types';

const BASE = import.meta.env.VITE_API_URL ?? '/api';

function getToken(): string | null {
  return localStorage.getItem('rw_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? 'Request failed');
  }
  return res.json() as Promise<T>;
}

export const api = {
  login(username: string, password: string): Promise<TokenResponse> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  register(username: string, password: string, email: string): Promise<TokenResponse> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    });
  },

  getMe(): Promise<User> {
    return request('/users/me');
  },

  getRewards(): Promise<Reward[]> {
    return request('/rewards');
  },

  redeem(rewardId: number, quantity: number): Promise<RedeemResponse> {
    return request(`/rewards/${rewardId}/redeem`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  },

  getHistory(): Promise<RedemptionHistoryItem[]> {
    return request('/rewards/history');
  },

  getUsers(): Promise<UserListItem[]> {
    return request('/users');
  },

  addPoints(userId: number, points: number): Promise<UserListItem> {
    return request(`/users/${userId}/add-points`, {
      method: 'POST',
      body: JSON.stringify({ points }),
    });
  },
};
