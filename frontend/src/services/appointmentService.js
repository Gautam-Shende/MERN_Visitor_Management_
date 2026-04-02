import api from './api';


export const getAppointments = () => api.get('/appointments').then(res => res.data);

// export const createAppointment = (data) => api.put('/appointments', data).then(res => res.data);
export const createAppointment = (data) => api.post('/appointments', data).then(res => res.data);

export const approveAppointment = (id) => api.put(`/appointments/approve/${id}`).then(res => res.data);

export const rejectAppointment = (id) => api.put(`/appointments/reject/${id}`).then(res => res.data);

export const getAppointmentById = (id) => api.get(`/appointments/${id}`).then(res => res.data);

// Employee gets all pending requests
export const getPendingRequests = async () => {
  try {
    const response = await api.get('/appointments/requested')
    return response.data
  } catch (err) {
    console.error("Error fetching pending requests:", err)
    throw err
  }
}

// Employee gets pending requests count (for badge)
export const getPendingRequestsCount = async () => {
  try {
    const response = await api.get('/appointments/requested/count')
    return response.data
  } catch (err) {
    console.error("Error fetching count:", err)
    return { count: 0 }
  }
}

// Employee converts request to appointment
export const convertRequestToAppointment = async (requestId, data) => {
  try {
    const response = await api.put(`/appointments/${requestId}/convert`, data)
    return response.data
  } catch (err) {
    console.error("Error converting request:", err)
    throw err
  }
}