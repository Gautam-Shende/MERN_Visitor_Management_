import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";

import {
  FaLock,
  FaEnvelope,
  FaSignInAlt,
  FaSpinner,
  FaUserPlus,
} from "react-icons/fa";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      toast.success("Login successful! Welcome back.");

      // Navigation target based on role
      let targetPath = "/visitors";
      if (loggedInUser.role === "visitor") {
        targetPath = "/visitor/dashboard";
      } else if (loggedInUser.role === "admin") {
        targetPath = "/dashboard";
      } else if (loggedInUser.role === "security") {
        targetPath = "/scan";
      } else if (loggedInUser.role === "employee") {
        targetPath = "/employee/requests";
      }

      navigate(targetPath, { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid email or password";
      toast.error(errorMessage);
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
            onChange={(e) => setEmail(e.target.value)}
            icon={<FaEnvelope className="text-gray-400" />}
            required
            disabled={loading}
            label="Email Address"
          />

          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<FaLock className="text-gray-400" />}
            required
            disabled={loading}
            label="Password"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-lg font-semibold"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" /> Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FaSignInAlt /> Sign In
              </span>
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          {/* <Link to="/visitor/login" className="block w-full"> */}
            <Button
              disabled={loading}
              variant="success"
              type="button"
              className="w-full text-white py-3 rounded-xl text-lg font-semibold"
            >
              <Link to="/visitor/login" className="flex w-full items-center justify-center gap-3"><FaUserPlus /> Login as Visitor</Link>
            </Button>
          {/* </Link> */}
        </div>
      </Card>
    </div>
  );
};

export default Login;
