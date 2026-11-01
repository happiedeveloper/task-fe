const configuredApiUrl = import.meta.env.VITE_API_BASE_URL || 'https://task-fe-75yw.onrender.com';

export const API_BASE_URL = configuredApiUrl.replace(/\/$/, '');

