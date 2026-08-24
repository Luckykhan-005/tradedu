const SHOGO_BACKEND = 'http://f433563c-b214-4c91-81ec-8db56a59a1b4.preview.shogo.ai'
const API_BASE = import.meta.env.VITE_API_URL || (window.location.hostname.includes('vercel') ? SHOGO_BACKEND : '')

export const api = (path: string) => `${API_BASE}${path}`
