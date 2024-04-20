import axios from 'axios';

// Set base URL for API requests
const baseURL = 'http://localhost:8000/api/v1/';

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL,
  timeout: 5000, // Timeout after 5 seconds
});

// Set JWT token from localStorage in the Authorization header
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export { api, setAuthToken };
