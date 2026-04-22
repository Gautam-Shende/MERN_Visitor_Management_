
import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
      // console.log("Beare : ", token)
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // console.log("error", error.response)
    const requestUrl = error.config?.url;

    if (status === 401 && requestUrl) {
      // if (requestUrl.findOne("/login") {
      //   return Promise.reject(error);
          // console.log("error", error)
      // }

      if (requestUrl.includes("/login") || requestUrl.includes("/register")) {
        return Promise.reject(error);
        // console.log("error : ", error)
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
)

export default api;