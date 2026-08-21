import axios from "axios"

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Attach Bearer token to outgoing requests
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl = error.config?.url

    if (status === 401 && requestUrl) {
      // Don't auto-redirect on login or registration failures
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

export default apiClient
