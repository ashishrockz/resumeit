const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Define types based on Swagger documentation
interface ATSCheckRequest {
  resume_id: number;
  job_title: string;
  job_description: string;
}

interface ATSCheckResponse {
  id: number;
  score: number;
  analysis: any; // Define a more specific type based on backend response
  suggestions: any; // Define a more specific type
  keyword_matches: KeywordMatch[];
  optimization_suggestions: OptimizationSuggestion[];
  // Add other fields from the ATSScore model
}

interface KeywordMatch {
  id: number;
  keyword: string;
  found: boolean;
  importance: 'high' | 'medium' | 'low';
  context?: string;
}

interface OptimizationSuggestion {
  id: number;
  section: string;
  original_text: string;
  suggested_text: string;
  reason: string;
  applied: boolean;
}


export const initiateATSCheck = async (data: ATSCheckRequest): Promise<ATSCheckResponse> => {
  const response = await fetch(`${API_URL}/ats/scores/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming authenticated user
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(Object.values(error).flat().join(', ') || 'Failed to initiate ATS check');
  }

  return response.json();
};

export const getATSCheckResult = async (atsScoreId: number): Promise<ATSCheckResponse> => {
  const response = await fetch(`${API_URL}/ats/scores/${atsScoreId}/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming authenticated user
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch ATS check result');
  }

  return response.json();
};

export const applyOptimizationSuggestion = async (atsScoreId: number, suggestionId: number) => {
   // Based on Swagger, apply_suggestion is a POST to /ats/scores/{id}/apply_suggestion/
   // The body seems to be the ATSScore object, which might not be correct for applying a single suggestion.
   // Assuming the backend expects the suggestion ID in the body or URL for now.
   // Let's assume the backend expects the suggestion ID in the body for now.
  const response = await fetch(`${API_URL}/ats/scores/${atsScoreId}/apply_suggestion/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming authenticated user
    },
     body: JSON.stringify({ suggestion_id: suggestionId }), // Assuming this structure
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to apply suggestion');
  }

  return response.json(); // Or handle response as needed
};