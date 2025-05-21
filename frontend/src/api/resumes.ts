// This file seems to be a duplicate of resume.ts, let's consolidate and use resume.ts
// I will add the admin specific resume fetching function here if needed, otherwise use the existing one.
// Based on the swagger, there is a GET /resumes/ endpoint which should list all resumes.

import { Resume } from "@/pages/UserDashboardPage"; // Import the Resume type

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getAllResumes = async () => {
  const response = await fetch(`${API_URL}/resumes/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming admin token
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch resumes');
  }

  return response.json();
};