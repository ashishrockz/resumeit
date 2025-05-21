import { Resume } from "@/pages/UserDashboardPage"; // Import the Resume type

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getUserResumes = async (): Promise<Resume[]> => {
  // TODO: Implement actual API call to fetch user's resumes
  // const response = await fetch(`${API_URL}/resumes/`, {
  //   headers: {
  //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Example auth header
  //   },
  // });

  // if (!response.ok) {
  //   throw new Error('Failed to fetch resumes');
  // }

  // return response.json();

  // Returning mock data for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Software Engineer Resume", updated_at: "2023-10-27T10:00:00Z" },
        { id: 2, title: "Data Scientist CV", updated_at: "2023-10-26T14:30:00Z" },
      ]);
    }, 1000);
  });
};