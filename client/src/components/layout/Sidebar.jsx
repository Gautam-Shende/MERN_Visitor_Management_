import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

import {
  FaHome,
  FaUser,
  FaUsers,
  FaCalendarAlt,
  FaPassport,
  FaQrcode,
  FaChartBar,
  FaShieldAlt,
  FaUserTie,
  FaCheckDouble,
  FaUserCheck,
} from "react-icons/fa"

const Sidebar = ({ isOpen, onClose }) => {

  const { user } = useAuth();

  if (!user) return null;

  const adminLinks = [
    { to: "/dashboard", icon: FaHome, label: "Dashboard" },
    { to: "/visitors", icon: FaUsers, label: "Visitors" },
    { to: "/appointments", icon: FaCalendarAlt, label: "Appointments" },
    { to: "/passes", icon: FaPassport, label: "Passes" },
    { to: "/reports", icon: FaChartBar, label: "Reports" },
  ]

  const employeeLinks = [
    { to: "/employee/requests", icon: FaCalendarAlt, label: "Pending Requests" },
    { to: "/visitors", icon: FaUsers, label: "Visitors" },
    { to: "/appointments", icon: FaCalendarAlt, label: "Appointments" },
    { to: "/passes", icon: FaPassport, label: "Passes" },
  ]

  const securityLinks = [
    { to: "/passes", icon: FaPassport, label: "Passes" },
    { to: "/scan", icon: FaQrcode, label: "Scan QR" },
  ]

  const visitorLinks = [
    { to: "/visitor/dashboard", icon: FaHome, label: "Dashboard" },
    { to: "/visitor/appointments", icon: FaCalendarAlt, label: "My Appointments" },
    { to: "/visitor/passes", icon: FaPassport, label: "My Passes" },
  ]

  const visitorProfile = () => {
    if(user?.role === "visitor") {
      return <>
       <div className="flex flex-col">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0b1e3c]">{user?.name}</p>
              <p className="text-xs text-[#5b6f87] mb-1.5">{user?.email}</p>
            </div>

            <div className="mr-4">
              <span className={`flex items-center gap-1 text-xs px-1 py-1 rounded-lg font-medium w-fit ${getRoleBadge()}`}>
                {getRoleIcon()}
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
            </div>
       </div>
      </>
    } else {
      return <>
       <div className="flex-1">
              <p className="text-sm font-semibold text-[#0b1e3c]">{user?.name}</p>
              <p className="text-xs text-[#5b6f87] mb-1.5">{user?.email}</p>
            </div>

            <div className="mr-4">
              <span className={`flex items-center gap-1 text-xs px-1 py-1 rounded-lg font-medium ${getRoleBadge()}`}>
                {getRoleIcon()}
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
            </div>
      </>
    }
  }

  let links = []

  if (user.role === "admin") links = adminLinks;
  else if (user.role === "employee") links = employeeLinks;
  else if (user.role === "security") links = securityLinks;
  else if (user.role === "visitor") links = visitorLinks;

  const getRoleBadge = () => {
    const roleColors = {
      admin: "bg-[#e8f0fe] text-[#2463eb] border border-[#b8d1fc]",
      employee: "bg-[#e6f7ee] text-[#0b8a4f] border border-[#b0e3cd]",
      security: "bg-[#fef5e6] text-[#b45b0a] border border-[#fed7a5]",
      visitor: "bg-[#f0e7fe] text-[#6941c6] border border-[#d3bcfc]",
    }
    return roleColors[user?.role] || "bg-[#f0f2f5] text-[#4a5f73] border border-[#d0d9e6]";
  }

  const getRoleIcon = () => {
    switch (user?.role) {
      case "admin": return <FaUserTie className="text-blue-600" size={12} />;
      case "employee": return <FaUserCheck className="text-green-600" size={12} />;
      case "security": return <FaShieldAlt className="text-red-600" size={12} />;
      case "visitor": return <FaUser className="text-purple-600" size={12} />;
      default: return null;
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-16 bottom-0 z-50 w-72 bg-white shadow-xl
          flex flex-col overflow-y-auto
          transform transition-transform duration-300 ease-in-out

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0 lg:static lg:top-0 lg:z-0
          lg:shadow-none lg:border-r lg:border-[#eef2f6]
        `}
      >
        <div className="p-6 border-b border-[#eef2f6]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#2360d9] shadow-lg shadow-[#2463eb]/20">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#0b1e3c]">
                Visitor<span className="text-[#2463eb]">Flow</span>
              </h2>
              <p className="text-xs text-[#5b6f87] mt-0.5">Management System</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-[#eef2f6]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#cbddff] border-2 border-white shadow-sm flex items-center justify-center">
              {user?.role === "admin" ? (
                <FaUserTie size={25} />
              ) : user?.role === "employee" ? (
                <FaUserCheck size={19} />
              ) : user?.role === "security" ? (
                <FaShieldAlt size={19} />
              ) : (
                <FaUser size={19} />
              )}
            </div>
 
            {visitorProfile()}
            
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <p className="text-xs font-semibold text-[#5b6f87] uppercase tracking-wider px-4 mb-3">
            Main Menu
          </p>

          <div className="space-y-1.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-[#e8f0fe] text-[#2463eb]"
                      : "text-[#4a5f73] hover:bg-[#f5f9ff] hover:text-[#2463eb]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon
                      className={`mr-3 ${
                        isActive
                          ? "text-[#2463eb]"
                          : "text-[#5b6f87] group-hover:text-[#2463eb]"
                      }`}
                      size={18}
                    />
                    <span className="text-sm font-medium">{link.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2463eb]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* FOOTER */}
        <div className="p-6 border-t border-[#eef2f6] bg-white/50 backdrop-blur-sm mt-auto">
          <div className="bg-[#f8fafd] rounded-xl p-4 border border-[#e9eef4]">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#2463eb]/10 flex items-center justify-center">
                <FaShieldAlt className="text-[#2463eb]" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-[#0b1e3c]">Secure Access</p>
                <p className="text-[10px] text-[#5b6f87]">Role: {user?.role}</p>
              </div>
              <div className="text-green-500 animate-pulse">
                <FaCheckDouble />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;