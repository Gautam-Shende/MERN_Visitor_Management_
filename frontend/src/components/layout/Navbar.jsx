
// import { Link } from "react-router-dom"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
//

import {
  FaSignOutAlt,
  FaUser,
  FaUserTie,
  FaBars,
  FaTimes,
  FaBell,
  FaShieldAlt,
  FaIdBadge,
  FaUserCheck,
} from "react-icons/fa"

const Navbar = ({ onMenuClick, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div
        className="border-b border-[#eef2f6] px-4 sm:px-6 lg:px-8 py-3"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #fafcff 100%)",
          boxShadow: "0 2px 8px rgba(0, 20, 60, 0.04)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">

            {/* <button
              onClick={onMenuClick}
              className="p-4 text-xl"
            > */}
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
                to="/appointments"
                className="relative p-2.5 rounded-xl transition-all duration-200 bg-[#d3d7dc] hover:bg-[#dfe2e6] group"
              >
                <FaBell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ec3c3c]"></span>
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

export default Navbar;