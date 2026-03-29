
// import { useMemo } from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
// import { NavLink } from "react-router-dom"
import { Link, useNavigate } from "react-router-dom"

import Button from "../../components/common/Button"
import Input from "../../components/common/Input"
import Card from "../../components/common/Card"

import { FaLock, FaEnvelope, 
  FaSignInAlt, FaSpinner, FaUserPlus } from "react-icons/fa"

import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("")
  
  // const [password, setPassword] = useState([])
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
 
  const { login, logout, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // console.log("Login component mounted, checking user status:", user);
    if (user) {
      // console.log("User already logged in, logging out first");
      logout();
    }
  }, []); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Login form submitted with email:", email);
    setLoading(true);

    try {
      const user = await login(email, password);
      // console.log("Login successful for user:", user.email, "Role:", user.role);
      toast.success("Login successful! Welcome back.");

      // console.log("Navigate on user role:", user.role);
      if (user.role === "visitor") {
        // console.log("Redirecting to visitor dashboard");
        navigate("/visitor/dashboard");
      } else if (user.role === "admin") {
        // console.log("Redirecting to admin dashboard");
        navigate("/dashboard");
      } else if (user.role === "security") {
        // console.log("Redirecting to security scan page");
        navigate("/scan");
      } else if (user.role === "employee") {
        // console.log("Redirecting to visitors page");
        navigate("/visitors");
      } else {
        // console.log("Default redirect to visitors page");
        navigate("/visitors");
      }
    } catch (error) {
      // console.error("Login error:", error);
      // console.log("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      // console.log("Setting loading state to false");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-200 p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500">Sign in to VisitorFlow</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              // console.log("Email input changed:", e.target.value);
              setEmail(e.target.value);
            }}
            icon={<FaEnvelope className="text-gray-400" />}
            required
            label="Email Address"
          />

          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              // console.log("Password input changed");
              setPassword(e.target.value);
            }}
            icon={<FaLock className="text-gray-400" />}
            required
            label="Password"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:from-blue-700 text-white py-3 rounded-xl text-lg font-semibold"
          >
            {loading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FaSignInAlt /> Sign In
              </span>
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/visitor/login" className="block w-full">
            <Button
              variant="success"
              type="button"
              className="w-full text-white py-3 rounded-xl text-lg font-semibold"
            >
              <FaUserPlus /> Login as Visitor
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;