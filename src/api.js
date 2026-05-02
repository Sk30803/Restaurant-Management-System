export class AuthError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthError';
  }
}

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;
  try {
      data = text ? JSON.parse(text) : {};
  } catch (err) {
      data = {};
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new AuthError(data.message || 'Please log in to continue');
    }
    throw new Error(data.message || 'Request failed');
  }

  return data;
};
