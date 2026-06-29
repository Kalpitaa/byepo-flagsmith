import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sa_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sa_token')
      localStorage.removeItem('sa_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const superAdminAPI = {
  login: (data) => api.post('/super-admin/login', data),
  createOrganisation: (data) => api.post('/super-admin/organisations', data),
  getOrganisations: () => api.get('/super-admin/organisations'),
}

export default api;