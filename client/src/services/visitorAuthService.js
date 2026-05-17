import api from './api';

export const registerVisitor = async (formData) => {
  const response = await api.post('/visitor/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const loginVisitor = async (email, password) => {
  try {

    const response = await api.post('/visitor/login', { email, password });
    return response.data;

  } catch (err) {
    // console.log("login problem..", err)
    const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
    throw new Error(msg);
  }
};

export const getVisitorProfile = async () => {
  const response = await api.get('/visitor/profile');
  return response.data;
};

export const fetchVisitorDashboard = async () => {
  try {
    // const res = await api.get("/dashboard")
    const response = await api.get('/visitor/dashboard');
    return response.data;
  } catch (err) {
    // console.log("Problem in Visitor Dashbaord..", err.message)
    return {
      totalAppointments: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      passGenerated: 0,
    };
  }
};

export const fetchVisitorAppointments = async () => {
  try {
    const res = await api.get('/visitor/appointments');
    return res.data;
  } catch (err) {
    // console.log("There is problem to fetch Visitor Appointment", err.message)
    // return null;
    return [];
  }
};

export const fetchVisitorPasses = async () => {
  const response = await api.get('/visitor/passes');
  return response.data;
};

export const getVisitorPass = async (appointmentId) => {
  try {
    const response = await api.get(`/visitor/pass/${appointmentId}`);
    return response.data;
  } catch (err) {
    // console.log("problem to fetch visitor pass..", err.message)
    throw err;
  }
};

export const requestforAppointment = async (requestData) => {
  const response = await api.post('/visitor/appointments/request', requestData);
  return response.data;
};

export const getMyAppointmentRequests = async () => {
  try {
    const response = await api.get('/visitor/appointments/requests');
    return response.data;
  } catch (err) {
    // console.warn('failed to fetch appointment requests:', err.message);
    return { success: true, data: [] };
  }
};