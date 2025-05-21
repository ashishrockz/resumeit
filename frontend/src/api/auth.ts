const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  full_name: string;
  phone_number?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to login');
    }

    return response.json();
  },

  register: async (data: RegisterData) => {
    const response = await fetch(`${API_URL}/users/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(Object.values(error).flat().join(', '));
    }

    return response.json();
  },

  logout: async (): Promise<void> => {
    // In a real application, you might want to call a backend endpoint
    // to invalidate the token on the server side.
    // For this example, we'll just clear the tokens from local storage.
    // const response = await fetch(`${API_URL}/logout/`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    //   },
    // });

    // if (!response.ok) {
    //   const error = await response.json();
    //   console.error('Backend logout failed:', error);
    //   // We might still want to clear local storage even if backend fails
    // }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};