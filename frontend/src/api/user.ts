const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: 'admin' | 'user';
  is_verified: boolean;
  created_at: string;
}

export interface Subscription {
  id: number;
  plan: {
    id: number;
    name: string;
    description: string;
    price: string;
    duration_months: number;
    features: Record<string, any>;
    is_active: boolean;
  };
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  start_date: string;
  end_date: string;
  is_auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_URL}/users/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data.results[0]; // API returns an array with a single user
  },

  getUserSubscription: async (): Promise<Subscription | null> => {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_URL}/subscriptions/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscription data');
    }

    const data = await response.json();
    return data.results.length > 0 ? data.results[0] : null;
  },
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming admin token
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch users');
  }

  return response.json();
};