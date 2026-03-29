import api from './api';

export const getPasses = () => api.get('/pass').then(res => res.data);


export const getPassById = (id) => api.get(`/pass/${id}`).then(res => res.data);


export const generatePass = (appointmentId) => api.post(`/pass/${appointmentId}`).then(res => res.data);


// export const scanPass = (qrData) => 
//   api.post('/pass/scan', qrData).then(res => res.data);

export const scanPass = (qrData) => {
  console.log("🔵 scanPass service called with:", qrData);
  return api.post('/pass/scan', qrData).then(res => {
    console.log("✅ scanPass response:", res.data);
    return res.data;
  }).catch(err => {
    console.error("❌ scanPass error:", err.response?.data || err.message);
    throw err;
  });
};



export const getCheckLogsByPassId = (passId) => 
  api.get(`/pass/${passId}/checklogs`).then(res => res.data);