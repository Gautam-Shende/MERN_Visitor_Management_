
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

import Button from "../../components/common/Button"
import Input from "../../components/common/Input"
// import { registerVisitor } from "../../services/visitorAuthService"
import Card from "../../components/common/Card"
import Spinner from "../../components/common/Spinner"

import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
  // FaShieldAlt,
  FaUser
} from "react-icons/fa"

import toast from "react-hot-toast"
import { loginVisitor } from "../../services/visitorAuthService";
import api from "../../services/api"

const VisitorLogin = () => {
  const [email, setEmail] = useState("")
  // const [password, setPassword] = useState([])
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Visitor login form submitted with email:", email);
    setLoading(true);

    try {
      // console.log("Calling loginVisitor API...");
      const response = await loginVisitor(email, password);
      // console.log("Login API response:", response);
      
      const { token, visitor } = response;
      // console.log("Token received:", token ? "Yes" : "No");

      const visitorData = visitor?.visitor || visitor;
      // console.log("Extracted visitor data:", visitorData);

      const visitorWithRole = {
        ...visitorData,
        role: "visitor",
      };
      // console.log("Visitor with role added:", visitorWithRole);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(visitorWithRole));
      // console.log("Auth data stored in localStorage");

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // console.log("Authorization header set for API calls");

      setUser(visitorWithRole);

      toast.success("Login successful! Welcome back.");
      // console.log("Redirecting to visitor dashboard...");
      navigate("/visitor/dashboard");
    } catch (error) {
     
      // console.log("Error status:", error.response?.status)
      
      const errorMsg =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      // console.log("Error message to display:", errorMsg);
      toast.error(errorMsg);
    } finally {
      // console.log("Setting loading state to false");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4">
      <Card className="w-full max-w-md p-0 overflow-hidden shadow-2xl rounded-2xl">

        <div className="bg-[#1d6ceb] py-4 text-center rounded-2xl">
          {/* <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <FaShieldAlt className="text-white text-xl" />
          </div> */}
          <h2 className="text-3xl font-bold text-white">Visitor Login</h2>
          <p className="text-blue-100 mt-2">
            Welcome back! Please sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
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
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]"
          >
            {loading ? (
              <Spinner size="sm" color="light" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FaSignInAlt /> Sign In
              </span>
            )}
          </Button>
        </form>

        <div className="px-8 pb-8 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/visitor/register"
              // className="text-[#3b82f6] font-semibold hover:text-[#2563eb] transition-colors"
            >
              <Button
              variant="success"
                type="button"
                className="w-full mt-3  text-white py-3 rounded-xl text-lg font-semibold"
              >
                <FaUserPlus /> Create an account
              </Button>
            </Link>
          </p>
           <Link to="/login">
             <Button
             variant="primary"
                type="button"
                className="w-full mt-3 bg-[#16f4b9] hover:bg-[#11eb59] text-white py-3 rounded-xl text-lg font-semibold"
              >
                <FaUser /> staff Login
              </Button>
            </Link>
        </div>
      </Card>
    </div>
  );
};

export default VisitorLogin