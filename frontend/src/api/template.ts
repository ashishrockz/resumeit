import { Template } from "@/pages/TemplateSelectionPage"; // Import the Template type

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Define the type for creating a template based on Swagger
interface CreateTemplateData {
  name: string;
  description?: string;
  category?: number | null;
  html_structure: string;
  css_styles?: string;
  is_premium?: boolean;
  is_active?: boolean;
  sections?: any[]; // Adjust based on actual section structure if needed
}

export const getTemplates = async () => {
  const response = await fetch(`${API_URL}/templates/`, {
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming admin token
    },
  });

  if (!response.ok) {
     const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch templates');
  }

  return response.json();
};

export const createTemplate = async (data: CreateTemplateData) => {
  const response = await fetch(`${API_URL}/templates/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming JWT authentication
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(Object.values(error).flat().join(', ') || 'Failed to create template');
  }

  return response.json();
};

// Modify getTemplates or create a new function if admin view is different
// For now, assuming getTemplates can be used by admin as well
// export const getTemplates = async (): Promise<Template[]> => { ... };

// Add admin specific template functions if needed (e.g., create, update, delete)