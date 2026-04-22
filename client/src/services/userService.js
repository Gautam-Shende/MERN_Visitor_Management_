import api from './api'

export const fetchUsers = () => api.get('/users').then(res => res.data)