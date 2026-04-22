import api from './api';


export const fetchAppointments = () => api.get('/appointments').then(res => res.data);

export const approveAppointment = (id) => api.put(`/appointments/approve/${id}`).then(res => res.data);

export const rejectAppointment = (id) => api.put(`/appointments/reject/${id}`).then(res => res.data);

export const fetchAppointmentById = (id) => api.get(`/appointments/${id}`).then(res => res.data);

export const fetchPendingRequests = async () => {
  try {
    const response = await api.get('/appointments/requested')
    return response.data
  } catch (err) {
    console.error("Error fetching pending requests:", err)
    throw err
  }
}

export const convertRequestToAppointment = async (requestId, data) => {
  try {
    const response = await api.put(`/appointments/${requestId}/convert`, data)
    return response.data
  } catch (err) {
    console.error("Error converting request:", err)
    throw err
  }
}