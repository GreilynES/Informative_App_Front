// Simple API configuration using fetch
const BASE_URL = import.meta.env.VITE_API_URL;

// Helper to create headers with auth token
function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  const token = localStorage.getItem('authToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

// Helper to handle responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken');
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// API configuration object that mimics axios interface
const apiConfig = {
  async get<T>(url: string): Promise<{ data: T }> {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return { data };
  },

  async post<T>(url: string, body: any, _p0: { headers: { "Content-Type": string; }; }): Promise<{ data: T } > {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    const data = await handleResponse(response);
    return { data };
  },

  async put<T>(url: string, body?: any): Promise<{ data: T }> {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await handleResponse(response);
    return { data };
  },

  async delete<T>(url: string): Promise<{ data: T }> {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return { data };
  },
};

export default apiConfig;
