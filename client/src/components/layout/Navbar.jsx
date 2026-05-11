import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { fetchPendingRequests } from '../../services/appointmentService'
import { fetchAppointments } from '../../services/appointmentService'

import {
  FaSignOutAlt,
  FaUser,
  FaUserTie,
  FaBars,
  FaTimes,
  FaBell,
  FaShieldAlt,
  FaUserCheck,
} from "react-icons/fa"
import toast from "react-hot-toast"

const Navbar = ({ onMenuClick, isSidebarOpen }) => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [pendingAppointments, setPendingAppointments] = useState(0)
  const [pendingRequests, setPendingRequests] = useState(0)

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchRequests = async () => {
    try {
      const response = await fetchPendingRequests()
      
      let data = []
      // use to fetch requested appointment proper Array type
      if (Array.isArray(response)) {
        data = response
      } else if (response?.data && Array.isArray(response.data)) {
        data = response.data
      } else if (response?.requests && Array.isArray(response.requests)) {
        data = response.requests
      }
      
      const requestedOnly = data.filter((req) => req.status === 'requested')
      setPendingRequests(requestedOnly.length)
      // console.log("This is the requested requests..",pendingRequests)

    } catch (error) {
      // console.error("Error fetching requests:", error)
      toast.error("Error fetching requests:", error)
      setPendingRequests(0)
    }
  }

  const fetchAppointmentsData = async () => {
    try {
      const response = await fetchAppointments()
      
      let data = []
      // first convert response data to Array format
      if (Array.isArray(response)) {
        data = response
      } else if (response?.appointments && Array.isArray(response.appointments)) {
        data = response.appointments
      } 
      else if (response?.data && Array.isArray(response.data)) {
        data = response.data
      }
      
      const pendingOnly = data.filter((appo) => appo.status === 'pending')
      setPendingAppointments(pendingOnly.length)
      // console.log("This is the Pending Appointments",pendingAppointments)
      
    } catch (error) {
      // console.error("Error fetching appointments:", error)
      toast.error("Error fetching appointments:", error)
      setPendingAppointments(0)
    }
  }

  useEffect(() => {
    if (user?.role === "employee") {
      fetchRequests()
    } else if (user?.role === "admin") {
      fetchAppointmentsData()
    }
  }, [user])

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="border-b border-[#eef2f6] px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2.5 lg:hidden rounded-xl transition-all duration-200 bg-[#f8fafd] text-[#1e293b] border border-[#e9eef4] hover:bg-[#eef2f6]"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>

            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #2463eb 0%, #1a4fc4 100%)",
                  boxShadow: "0 4px 10px rgba(36, 99, 235, 0.2)",
                }}
              >
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0b1e3c]">
                Visitor<span className="text-[#2463eb] font-bold">Flow</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {(user?.role === "admin" || user?.role === "employee") && (
              <NavLink
                to={user?.role === "employee" ? "/employee/requests" : "/appointments"}
                className="relative p-2.5 rounded-xl transition-all duration-200 bg-[#d3d7dc] hover:bg-[#dfe2e6] group"
              >
                <FaBell size={16} />
                <span className="absolute -top-1 -right-1  bg-red-500 text-white text-sm font-bold rounded-full flex items-center justify-center px-1">
                  {user?.role === "employee" ? pendingRequests : pendingAppointments}
                </span>
              </NavLink>
            )}

            <Link
              to="/profile"
              className="p-2 rounded-xl transition-all duration-200 bg-[#cad0fd] border-none hover:bg-[#69bcf3] relative group"
            >
              {user?.role === "admin" ? (
                <FaUserTie size={20} />
              ) : user?.role === "employee" ? (
                <FaUserCheck size={20} />
              ) : user?.role === "security" ? (
                <FaShieldAlt size={20} />
              ) : (
                <FaUser size={20} />
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl transition-all duration-200 bg-[#efdbdb] border-none hover:bg-[#fee9e7] relative group"
              aria-label="Logout"
            >
              <FaSignOutAlt size={16} className="text-[#e6584a]" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar