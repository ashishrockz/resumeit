const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Define basic type for Template data based on Swagger
export interface Template {
  id: number;
  name: string;
  description?: string;
  category?: { name: string }; // Assuming category is a nested object with a name
  thumbnail?: string; // URL to thumbnail image
  is_premium: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  html_structure?: string; // Add if needed for editing
  css_styles?: string; // Add if needed for editing
  sections?: any[]; // Add if needed for editing
}

// Define type for creating a template based on Swagger TemplateCreateUpdate
export interface CreateTemplateData {
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