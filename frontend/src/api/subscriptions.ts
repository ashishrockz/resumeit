const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getSubscriptions = async () => {
  const response = await fetch(`${API_URL}/subscriptions/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming admin token
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch subscriptions');
  }

  return response.json();
};

export const getTransactions = async () => {
  const response = await fetch(`${API_URL}/subscriptions/transactions/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming admin token
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch transactions');
  }

  return response.json();
};