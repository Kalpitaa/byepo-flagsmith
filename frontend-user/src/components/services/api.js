import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

export const checkFlag = (feature_key, organisationId) =>
  api.get('/flags/check', { params: { feature_key, organisationId } })

export const getOrganisations = () =>
  api.get('/organisations')

export default api;