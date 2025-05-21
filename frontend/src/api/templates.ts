const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Template {
  id: number;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
    description: string;
  };
  thumbnail: string;
  is_premium: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateCategory {
  id: number;
  name: string;
  description: string;
}

export const templatesApi = {
  getTemplates: async (): Promise<Template[]> => {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_URL}/templates/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch templates');
    }

    const data = await response.json();
    return data.results;
  },

  getTemplate: async (id: number): Promise<Template> => {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_URL}/templates/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch template');
    }

    return response.json();
  },

  getCategories: async (): Promise<TemplateCategory[]> => {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_URL}/templates/categories/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch template categories');
    }

    const data = await response.json();
    return data.results;
  },
};