
// import { useMemo } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import api from "../services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)

  const [token, setToken] = useState(() => localStorage.getItem("token") || null)

  const [loading, setLoading] = useState(true)


  useEffect(() => {

    if (!token) {
      setLoading(false)
      return
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`

    // console.log("Token found, fetching user")

    loadUser()

  }, [token])


  const loadUser = async () => {

    try {

      const storedUser = localStorage.getItem("user")

      if (!storedUser) {
        // console.log("No user found in localStorage")
        return
      }

      const parsedUser = JSON.parse(storedUser)

      // console.log("User loaded:", parsedUser)

      setUser(parsedUser)

    } catch (error) {

      // console.log("Error loading user:", error)

      localStorage.removeItem("user")

    } finally {

      setLoading(false)
    }
  }


  const login = async (email, password) => {

    try {

      // console.log("Login request:", email)

      const res = await api.post("/auth/login", { email, password })

      const { token: newToken, user: newUser } = res.data

      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(newUser))

      setToken(newToken)
      setUser(newUser)

      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`

      // console.log("Login success:", newUser)

      return newUser

    } catch (error) {

      // console.log("Login error:", error.response?.data || error.message)

      throw error
    }
  }


  const logout = () => {

    // console.log("Logging out user")

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    setToken(null)
    setUser(null)

    delete api.defaults.headers.common["Authorization"]
  }


  const setUserData = (userData) => {

    // console.log("Updating user data:", userData)

    setUser(userData)

    localStorage.setItem("user", JSON.stringify(userData))
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