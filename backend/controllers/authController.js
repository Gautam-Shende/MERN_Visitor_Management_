import * as authService from "../services/authService.js"

export const loginUser = async (req, res) => {
  const { email, password } = req.body
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" })
  }
  
  try {
    const result = await authService.loginUser(email, password)
    console.log("User logged in:", email)
    res.status(200).json({
      token: result.token,
      user: result.user
    })
  } catch (error) {
    console.log("Login failed:", error.message)
    res.status(401).json({ error: "Invalid email or password" })
  }
}