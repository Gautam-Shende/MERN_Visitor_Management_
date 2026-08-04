import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";

import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
  FaUser,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { loginVisitor } from "../../services/visitorAuthService";
import api from "../../services/api";

const VisitorLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await loginVisitor(form.email, form.password);

      const token = res.token;
      const visitorData = res.visitor?.visitor || res.visitor;

      const userData = { ...visitorData, role: "visitor" };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);

      toast.success("Login successful! Welcome back.");
      navigate("/visitor/dashboard", { replace: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4">
      <Card className="w-full max-w-md p-0 overflow-hidden shadow-2xl rounded-2xl">
        <div className="bg-[#1d6ceb] py-4 text-center rounded-2xl">
          <h2 className="text-3xl font-bold text-white">Visitor Login</h2>
          <p className="text-blue-100 mt-2">
            Welcome back! Please sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-3 space-y-4">
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            icon={<FaEnvelope className="text-gray-400" />}
            required
            disabled={loading}
            label="Email Address"
          />

          <Input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            icon={<FaLock className="text-gray-400" />}
            required
            disabled={loading}
            label="Password"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-3 rounded-xl text-lg font-semibold transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" /> Sign In...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FaSignInAlt /> Sign In
              </span>
            )}
          </Button>
        </form>

        <div className="p-8 pt-0 flex justify-center flex-col gap-2">
          <Button
            variant="success"
            type="button"
            disabled={loading}
            className="w-full mt-3 text-white py-3 rounded-xl text-lg font-semibold"
          >
            <Link
              to="/visitor/register"
              className="flex items-center w-full justify-center "
            >
              <FaUserPlus className="mr-2" /> Create an account
            </Link>
          </Button>

          <Button
            variant="primary"
            type="button"
            disabled={loading}
            className="w-full text-white py-3 rounded-xl text-lg font-semibold"
          >
            {" "}
            <Link
              to="/login"
              className="flex items-center w-full justify-center"
            >
              <FaUser className="mr-2" /> Staff Login
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VisitorLogin;
