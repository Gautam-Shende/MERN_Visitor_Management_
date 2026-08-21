import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Attach Bearer token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl = error.config?.url

    if (status === 401 && requestUrl) {
      if (requestUrl.includes("/login") || requestUrl.includes("/register")) {
        return Promise.reject(error)
      }

      localStorage.removeItem("token")
      localStorage.removeItem("user")
      if (window.location.pathname !== "/login" && window.location.pathname !== "/visitor/login") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

export default api