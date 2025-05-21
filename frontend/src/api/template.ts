import { Template } from "@/pages/TemplateSelectionPage"; // Import the Template type

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getTemplates = async (): Promise<Template[]> => {
  // TODO: Implement actual API call to fetch templates
  // const response = await fetch(`${API_URL}/templates/`);

  // if (!response.ok) {
  //   throw new Error('Failed to fetch templates');
  // }

  // return response.json();

  // Returning mock data for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Classic Professional", is_premium: false, thumbnail: "/placeholder.svg" },
        { id: 2, name: "Modern Minimalist", is_premium: true, thumbnail: "/placeholder.svg" },
        { id: 3, name: "Creative Portfolio", is_premium: true, thumbnail: "/placeholder.svg" },
      ]);
    }, 1000);
  });
};