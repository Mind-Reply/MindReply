export const apiClient = {
  get: async (url: string) => fetch(`/api${url}`).then(r => r.json()),
  post: async (url: string, body?: any) => fetch(`/api${url}`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body || {})
  }).then(r => r.json())
}