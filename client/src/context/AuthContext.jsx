
// import { useMemo } from "react"
import { createContext, useContext } from "react"
import {  useEffect, useState} from "react"

import api from "../services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  // const [logout, setLogout] = useState(false)

  const [token, setToken] = useState(() => localStorage.getItem("token") || null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (!token) {
      // setTimeout(() => {
      //   setLoading(false)
      // }, 3000)
      setLoading(false)
      return
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    loadUser()
  }, [token])


  const loadUser = async () => {
    try {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        // console.log("There is No any User in Localstorage")
        return ;
      }
      const parsedUser = JSON.parse(storedUser)
      // console.log("User loaded:", parsedUser)
      setUser(parsedUser)

    } catch (error) {
      // console.log("Error loading user:", error)
      localStorage.removeItem("user")
    } finally {
      // setTimeout(() => {
      //   setLoading(false)
      // }, 2000)
      setLoading(false)
    }
  }


  const login = async (email, password) => {
    try {
      // console.log("Login request:", email)
      const res = await api.post("/auth/login", { email, password })
      const { token: newToken, user: newUser } = res.data
      // localStorage.setItem("user", "token")
      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)

      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
      // console.log("Login success:", newUser)
      return newUser
    } catch (error) {
      // console.log("Login error:", error.response?.data || error.message || "This is Authcontext Login error")
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


  const setUserData = (userData) => {
    setUser(userData);
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