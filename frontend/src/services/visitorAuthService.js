import api from './api';

export const registerVisitor = async (formData) => {
  try {
    console.log("Sending registration request...");
    const response = await api.post('/visitor/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log("Registration response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Registration error:", err.response?.data || err.message);
    throw err;
  }
};

export const loginVisitor = async (email, password) => {
  try {
    const response = await api.post('/visitor/login', { email, password });
    return response.data;
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw err;
  }
};

export const getVisitorProfile = async () => {
  try {
    const response = await api.get('/visitor/profile');
    return response.data;
  } catch (err) {
    console.error("Error fetching profile:", err);
    throw err;
  }
};

export const updateVisitorProfile = async (formData) => {
  try {
    const response = await api.put('/visitor/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (err) {
    console.error("Error updating profile:", err);
    throw err;
  }
};

export const getVisitorDashboard = async () => {
  try {
    const response = await api.get('/visitor/dashboard');
    return response.data;
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    return { totalAppointments: 0, pending: 0, approved: 0, rejected: 0, passGenerated: 0 };
  }
};

export const getVisitorAppointments = async () => {
  try {
    const response = await api.get('/visitor/appointments');
    return response.data;
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return [];
  }
};

export const getVisitorPasses = async () => {
  try {
    const response = await api.get('/visitor/passes');
    return response.data;
  } catch (err) {
    console.error("Error fetching passes:", err);
    return [];
  }
};

export const getVisitorPass = async (appointmentId) => {
  try {
    const response = await api.get(`/visitor/pass/${appointmentId}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching pass:", err);
    throw err;
  }
};


// Visitor submits appointment request
export const requestAppointment = async (requestData) => {
  try {
    const response = await api.post('/visitor/appointments/request', requestData)
    return response.data
  } catch (err) {
    console.error("Error requesting appointment:", err)
    throw err
  }
}


// Visitor gets their appointment requests
export const getMyAppointmentRequests = async () => {
  try {
    const response = await api.get('/visitor/appointments/requests')
    return response.data
  } catch (err) {
    console.error("Error fetching requests:", err)
    return { success: true, data: [] }
  }
}