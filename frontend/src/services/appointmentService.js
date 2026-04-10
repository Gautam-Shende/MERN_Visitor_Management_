import api from './api';


export const getAppointments = () => api.get('/appointments').then(res => res.data);

// export const createAppointment = (data) => api.put('/appointments', data).then(res => res.data);
export const createAppointment = (data) => api.post('/appointments', data).then(res => res.data);

export const approveAppointment = (id) => api.put(`/appointments/approve/${id}`).then(res => res.data);

export const rejectAppointment = (id) => api.put(`/appointments/reject/${id}`).then(res => res.data);

export const getAppointmentById = (id) => api.get(`/appointments/${id}`).then(res => res.data);