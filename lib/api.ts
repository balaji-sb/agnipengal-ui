import axios from 'axios';

// Base URL configuration
// In development, this points to the backend server directly
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.2:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies (if cross-origin or same-site strict)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get auth headers for Server Components moved to lib/api-server.ts

export default api;
