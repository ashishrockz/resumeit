const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Resume {
  id: number;
  title: string;
  content: Record<string, any>;
  template: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResumeCreate {
  title: string;
  content: Record<string, any>;
  template: number | null;
  is_active: boolean;
}

export const resumesApi = {
  getResumes: async (): Promise<Resume[]> => {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_URL}/resumes/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resumes');
    }

    const data = await response.json();
    return data.results;
  },

  getResume: async (id: number): Promise<Resume> => {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_URL}/resumes/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resume');
    }

    return response.json();
  },

  createResume: async (data: ResumeCreate): Promise<Resume> => {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_URL}/resumes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create resume');
    }

    return response.json();
  },

  updateResume: async (id: number, data: Partial<ResumeCreate>): Promise<Resume> => {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_URL}/resumes/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update resume');
    }

    return response.json();
  },

  deleteResume: async (id: number): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_URL}/resumes/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete resume');
    }
  },
};