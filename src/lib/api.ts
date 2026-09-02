const api = (path: string) => {
  // Avoid double /api prefix
  const clean = path.startsWith('/api') ? path : `/api${path}`
  return clean
}

export { api }
