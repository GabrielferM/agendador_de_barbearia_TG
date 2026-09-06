const defaultApiUrl = 'http://localhost:3000'

export const apiBaseUrl = (import.meta.env.VITE_API_URL?.trim() || defaultApiUrl).replace(/\/+$/, '')
