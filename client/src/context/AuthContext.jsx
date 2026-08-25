
import { createContext, useContext, useEffect, useState } from "react"
import api from "../services/api"

// Authcontext for authentication users. 
const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      // store user data to localstorage 
      const storedUser = localStorage.getItem("user")
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  })

  // add user login token in loclstorage
  const [token, setToken] = useState(() => localStorage.getItem("token") || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common["Authorization"]
    }
    setLoading(false)
  }, [token])

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password })
      const { token: newToken, user: newUser } = res.data

      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(newUser))
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`

      setToken(newToken)
      setUser(newUser)

      return newUser
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    delete api.defaults.headers.common["Authorization"]
  }

  // User data in localstorage
  const setUserData = (userData) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData))
    } else {
      localStorage.removeItem("user")
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    setUser: setUserData
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
