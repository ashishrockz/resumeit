const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Define User type based on Swagger
export interface User {
  id: number;
  username: string;
  email?: string;
  full_name?: string;
  phone_number?: string;
  role: 'admin' | 'user';
  is_verified: boolean;
  created_at: string;
}

// Define type for creating a user based on Swagger UserRegistration
interface CreateUserData {
  username: string;
  email?: string;
  full_name?: string;
  phone_number?: string;
  password: string;
  password2: string; // Confirm password field
}


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

// Function to fetch details of a single user
export const getUserDetails = async (id: number): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${id}/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming admin token
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || `Failed to fetch user details for ID ${id}`);
  }

  return response.json();
};

// Function to update a user
export const updateUser = async (id: number, data: any) => { // Use 'any' for now, refine type later
  const response = await fetch(`${API_URL}/users/${id}/`, {
    method: 'PATCH', // Use PATCH for partial updates
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming admin token
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(Object.values(error).flat().join(', ') || `Failed to update user with ID ${id}`);
  }

  return response.json();
};

// Function to create a new user
export const createUser = async (data: CreateUserData) => {
  const response = await fetch(`${API_URL}/users/register/`, { // Use the registration endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Assuming admin token is not needed for this endpoint, or handled by backend
      // 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(Object.values(error).flat().join(', ') || 'Failed to create user');
  }

  return response.json();
};