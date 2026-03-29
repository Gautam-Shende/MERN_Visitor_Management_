import api from './api'

export const getUsers = () => api.get('/users').then(res => res.data)