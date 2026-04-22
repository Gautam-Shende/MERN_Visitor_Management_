import api from './api';


export const fetchDashboardStats = () => api.get('/dashboard').then(res => res.data);