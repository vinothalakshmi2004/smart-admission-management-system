// Base URL of the backend API.
// - Development: http://localhost:5000
// - Production build served by the Express server: '' (same origin)
// - API on a different domain: set VITE_API_URL in client/.env (e.g. https://api.example.com)
export const API_URL =
    import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:5000' : '');

// Socket.io connects to the API server; undefined means "same origin".
export const SOCKET_URL = API_URL || undefined;
