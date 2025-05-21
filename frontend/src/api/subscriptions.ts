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

// Function to fetch details of a single subscription
export const getSubscriptionDetails = async (id: number) => {
  const response = await fetch(`${API_URL}/subscriptions/${id}/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming admin token
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || `Failed to fetch subscription details for ID ${id}`);
  }

  return response.json();
};

// Function to update a subscription
export const updateSubscription = async (id: number, data: any) => { // Use 'any' for now, refine type later
  const response = await fetch(`${API_URL}/subscriptions/${id}/`, {
    method: 'PATCH', // Use PATCH for partial updates
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming admin token
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(Object.values(error).flat().join(', ') || `Failed to update subscription with ID ${id}`);
  }

  return response.json();
};