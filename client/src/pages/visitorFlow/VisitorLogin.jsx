import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

import Button from "../../components/common/Button"
import Input from "../../components/common/Input"
// import Table from "../../components/common/Table"
import Card from "../../components/common/Card"
import Spinner from "../../components/common/Spinner"

import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
  FaUser,
} from "react-icons/fa"

import toast from "react-hot-toast"
// import {fetchvisitorAppointment} from "../../services/appointmentService"
import { loginVisitor } from "../../services/visitorAuthService";
import api from "../../services/api"

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
    setLoading(true);

    try {
      const res = await loginVisitor(form.email, form.password)

      const token = res.token;
      // const visitorData = res.visitor?.visitor ;
      const visitorData = res.visitor?.visitor || res.visitor;

      const userData = { ...visitorData, role: "visitor" }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);

      toast.success("Login successful! Welcome back.");
      navigate("/visitor/dashboard");

    } catch (err) {
       const errorMessage = 
        err.response?.data?.message ||  "Login failed. Please check your credentials."
      toast.error(errorMessage)
      // console.log(err.response?.data?.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4">
      <Card className="w-full max-w-md p-0 overflow-hidden shadow-2xl rounded-2xl">

        <div className="bg-[#1d6ceb] py-4 text-center rounded-2xl">
          <h2 className="text-3xl font-bold text-white">Visitor Login</h2>
          <p className="text-blue-100 mt-2">
            Welcome back! Please sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-3">
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            icon={<FaEnvelope className="text-gray-400" />}
            required
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
            label="Password"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-3 rounded-xl text-lg font-semibold transition-all duration-300"
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

        <div className="flex justify-center flex-col gap-2">
          <Link to="/visitor/register">
            <Button
              variant="success"
              type="button"
              className="w-full mt-3 text-white py-3 rounded-xl text-lg font-semibold"
            >
              <FaUserPlus className="mr-2" /> Create an account
            </Button>
          </Link>

          <Link to="/login">
            <Button
              variant="primary"
              type="button"
              className="w-full text-white py-3 rounded-xl text-lg font-semibold"
            >
              <FaUser className="mr-2" /> Staff Login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default VisitorLogin;