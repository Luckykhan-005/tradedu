const api = (path: string) => {
  // Avoid double /api prefix
  const clean = path.startsWith('/api') ? path : `/api${path}`
  return clean
}

/**
 * Authenticated fetch helper.
 *
 * Authentication is carried by the server-issued HttpOnly session cookie, so
 * requests must always send credentials. The client must NEVER assert its own
 * identity or plan via headers — the server derives that from the session.
 */
const apiFetch = (path: string, init: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(init.headers || undefined)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(api(path), {
    ...init,
    headers,
    credentials: 'include',
  })
}

export { api, apiFetch }
