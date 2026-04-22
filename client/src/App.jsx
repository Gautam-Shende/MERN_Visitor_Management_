
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext"
// import Model from "./components/comman/Model.js"
import ProtectedRoute from "./components/layout/ProtectedRoute"

import Navbar from "./components/layout/Navbar"
import Sidebar from "./components/layout/Sidebar"
import Login from "./pages/auth/Login"
import Dashboard from "./pages/admin/Dashboard"

import Visitors from "./pages/visitors/Visitors"
// import VisitorForm from "./pages/visitors/VisitorForm"
import VisitorDetails from "./pages/visitors/VisitorDetails"
//
import PendingRequests from './pages/appointments/PendingRequests'
import ScheduleAppointment from './pages/appointments/ScheduleAppointment'

import Appointments from "./pages/appointments/Appointments"
// import AppointmentForm from "./pages/appointments/AppointmentForm"
import AppointmentDetails from "./pages/appointments/AppointmentDetails"


import Passes from "./pages/passes/Passes"
import PassDetails from "./pages/passes/PassDetails"
import ScanPage from "./pages/admin/ScanPage"
import Reports from "./pages/admin/Reports"
import Profile from "./pages/profile/Profile"

import NotFound from "./components/common/NotFound";
// visitor's
import VisitorLogin from "./pages/visitorFlow/VisitorLogin"
import VisitorRegister from "./pages/visitorFlow/VisitorRegister"
import VisitorDashboard from "./pages/visitorFlow/VisitorDashboard"
import VisitorAppointments from "./pages/visitorFlow/VisitorAppointments"
import VisitorPasses from "./pages/visitorFlow/VisitorPasses"
import VisitorPassDetails from "./pages/visitorFlow/VisitorPassDetails"


function AppContent() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {user && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {user && <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />}
        
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/visitor/login" element={<VisitorLogin />} />
            <Route path="/visitor/register" element={<VisitorRegister />} />
            
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><Dashboard /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={["admin"]}><Reports /></ProtectedRoute>} />
            
            <Route path="/visitors" element={<ProtectedRoute allowedRoles={["admin", "employee"]}><Visitors /></ProtectedRoute>} />
            {/* <Route path="/visitors/new" element={<ProtectedRoute allowedRoles={["admin", "employee"]}><VisitorForm /></ProtectedRoute>} /> */}
            <Route path="/visitors/:id" element={<ProtectedRoute allowedRoles={["admin", "employee"]}><VisitorDetails /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute allowedRoles={["admin", "employee"]}><Appointments /></ProtectedRoute>} />
            <Route path="/appointments/:id" element={<ProtectedRoute allowedRoles={["admin", "employee"]}><AppointmentDetails /></ProtectedRoute>} />
            {/* <Route path="/appointments/new" element={<ProtectedRoute allowedRoles={["employee"]}><AppointmentForm /></ProtectedRoute>} /> */}
            <Route  path="/employee/requests"  element={<ProtectedRoute allowedRoles={["employee", "admin"]}><PendingRequests /></ProtectedRoute> } />
            <Route path="/schedule-appointment/:id" element={ <ProtectedRoute allowedRoles={["employee", "admin"]}> <ScheduleAppointment />    </ProtectedRoute> } />
            <Route path="/passes" element={<ProtectedRoute allowedRoles={["admin", "employee", "security"]}><Passes /></ProtectedRoute>} />
            <Route path="/passes/:id" element={<ProtectedRoute allowedRoles={["admin", "employee", "security"]}><PassDetails /></ProtectedRoute>} />
            
            <Route path="/scan" element={<ProtectedRoute allowedRoles={["security"]}><ScanPage /></ProtectedRoute>} />
            
            <Route path="/visitor/dashboard" element={<ProtectedRoute allowedRoles={["visitor"]}><VisitorDashboard /></ProtectedRoute>} />
            <Route path="/visitor/appointments" element={<ProtectedRoute allowedRoles={["visitor"]}><VisitorAppointments /></ProtectedRoute>} />
            <Route path="/visitor/passes" element={<ProtectedRoute allowedRoles={["visitor"]}><VisitorPasses /></ProtectedRoute>} />
            <Route path="/visitor/pass-details/:id" element={<ProtectedRoute allowedRoles={["visitor"]}><VisitorPassDetails /></ProtectedRoute>} />
            
            <Route path="/profile" element={<ProtectedRoute allowedRoles={["admin", "employee", "security", "visitor"]}><Profile /></ProtectedRoute>} />
            
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}