const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getSubscriptions = async () => {
  // TODO: Implement actual API call to fetch all subscriptions (admin view)
  // const response = await fetch(`${API_URL}/subscriptions/`, {
  //   headers: {
  //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming admin token
  //   },
  // });

  // if (!response.ok) {
  //   throw new Error('Failed to fetch subscriptions');
  // }

  // return response.json();

  // Returning mock data for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        count: 20, // Total subscriptions
        results: [
          // Sample subscription data
          { id: 1, user: 1, plan: { name: "Premium" }, status: "active" },
        ]
      });
    }, 1500);
  });
};

export const getTransactions = async () => {
  // TODO: Implement actual API call to fetch all transactions (admin view)
  // const response = await fetch(`${API_URL}/subscriptions/transactions/`, {
  //   headers: {
  //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming admin token
  //   },
  // });

  // if (!response.ok) {
  //   throw new Error('Failed to fetch transactions');
  // }

  // return response.json();

  // Returning mock data for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        count: 30, // Total transactions
        results: [
          // Sample transaction data
          { id: 1, user: 1, amount: "9.99", status: "completed" },
        ]
      });
    }, 1500);
  });
};