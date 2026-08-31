const SHOGO_BACKEND = 'https://f433563c-b214-4c91-81ec-8db56a59a1b4.preview.shogo.ai'
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname.includes('vercel')
    ? '' // Same-origin: backend now runs on Vercel too (see api/index.ts + vercel.json)
    : SHOGO_BACKEND)

export const api = (path: string) => `${API_BASE}${path}`
