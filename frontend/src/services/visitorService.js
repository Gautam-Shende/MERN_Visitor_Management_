import api from "./api";


export const createVisitor = (formData) =>
  api.post("/visitors", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);


export const getRecentVisitors = async (limit = 5) => {
  try {
    const response = await api.get(`/visitors?limit=${limit}&sort=-createdAt`);
    return response.data;
  } catch (error) {
    // Fallback: fetch all and sort manually if backend doesn't support query params
    const allVisitors = await getVisitors();
    return allVisitors
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }
};

export const getVisitors = () => 
  api.get("/visitors").then((res) => res.data);


export const getVisitorById = (id) =>
  api.get(`/visitors/${id}`).then((res) => res.data);