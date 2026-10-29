const API_BASE = '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('thanglish_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If not on login or register, optionally clear token
    if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      localStorage.removeItem('thanglish_token');
      // Dispatch custom event for auth context
      window.dispatchEvent(new Event('thanglish_unauthorized'));
    }
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { detail: response.statusText };
  }

  if (!response.ok) {
    const errorMsg = data?.detail || data?.message || 'An unexpected error occurred.';
    throw new Error(errorMsg);
  }

  return data;
}

export default apiRequest;
