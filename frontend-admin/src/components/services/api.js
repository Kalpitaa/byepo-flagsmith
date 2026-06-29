import axios from 'axios'

const api = axios.create({
  baseURL: 'https://byepo-flagsmith.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('oa_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('oa_token')
      localStorage.removeItem('oa_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getOrganisations: () => api.get('/organisations'),
}

export const flagsAPI = {
  getFlags: () => api.get('/flags'),
  createFlag: (data) => api.post('/flags', data),
  updateFlag: (id, data) => api.put(`/flags/${id}`, data),
  deleteFlag: (id) => api.delete(`/flags/${id}`),
}

export default api;