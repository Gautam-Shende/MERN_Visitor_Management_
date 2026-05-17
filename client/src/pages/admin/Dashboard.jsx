
import React, { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../services/dashboardService";

import {
  FaUsers, FaClock,FaCheckCircle,FaTimesCircle,FaCreditCard,
  FaShieldAlt, FaSignInAlt,FaSignOutAlt, FaCalendarAlt,
  FaExclamationTriangle, FaTrashAlt,FaUserTie, FaRegClock,
  FaHourglassHalf,
} from "react-icons/fa";

// import { fetchRecentVisitors } from '../../services/visitorService'
// import { fetchAppointments } from '../../services/appointmentService'
// import { fetchPasses } from '../../services/passService'

import {
  BarChart,Bar,XAxis,YAxis,
  CartesianGrid,Tooltip,ResponsiveContainer, Cell
} from "recharts";

import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";
import DateTimeFormat from "../../components/common/DateTimeFormat";

import toast from "react-hot-toast"

const colorMap = {
  indigo: {
    bg: "bg-indigo-50",
    icon: "bg-indigo-100 text-indigo-600",
    value: "text-indigo-700",
  },
  green: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-600",
    value: "text-emerald-700",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "bg-amber-100 text-amber-600",
    value: "text-amber-700",
  },
  red: {
    bg: "bg-red-50",
    icon: "bg-red-100 text-red-500",
    value: "text-red-600",
  },
  slate: {
    bg: "bg-slate-100",
    icon: "bg-slate-200 text-slate-600",
    value: "text-slate-700",
  },
};

const StatCard = ({ icon, label, value, color = "indigo" }) => {
  const c = colorMap[color];

  return (
    <div className={`${c.bg} rounded-xl p-4 flex items-center justify-between gap-3 border border-white shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.icon}`}>
        {icon}
      </div>
      <div className="text-right">
        <p className={`text-2xl font-bold ${c.value}`}>{value}</p>
        <p className={`text-md font-semibold ${c.value}`}>{label}</p>
      </div>
    </div>
  );
};

const StatsGrid = ({ stats, className = "" }) => (
  <div className={className}>
    {stats.map((stat, idx) => (
      <StatCard key={idx} {...stat} />
    ))}
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState({
    totalVisitors: 0,
    pendingVisitors: 0,
    approvedVisitors: 0,
    rejectedVisitors: 0,
    totalPasses: 0,
    activePasses: 0,
    insidePasses: 0,
    expiredPasses: 0,
    totalCheckIns: 0,
    totalCheckOuts: 0,
    totalAppointments: 0,
    requestedAppointments: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const res = await fetchDashboardStats();
      setData(res);
    } catch (err) {
      // console.log(err);
      toast.error(err.message)
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" text="Loading Dashboard..." />
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : 
    hour < 17 ? "Good Afternoon" : 
    "Good Evening";

  // Visitors Data 
  const visitors = [
    {
      icon: <FaUsers size={20} />,
      label: "Total Visitors",
      value: data.totalVisitors,
      color: "indigo",
    },
    {
      icon: <FaRegClock size={20} />,
      label: "Pending",
      value: data.pendingVisitors,
      color: "amber",
    },
    {
      icon: <FaCheckCircle size={20} />,
      label: "Approved",
      value: data.approvedVisitors,
      color: "green",
    },
    {
      icon: <FaTimesCircle size={20} />,
      label: "Rejected",
      value: data.rejectedVisitors,
      color: "red",
    },
  ];

  // Passes Data 
  const passes = [
    {
      icon: <FaCreditCard size={20} />,
      label: "Total Passes",
      value: data.totalPasses,
      color: "indigo",
    },
    {
      icon: <FaShieldAlt size={20} />,
      label: "Active Passes",
      value: data.activePasses,
      color: "green",
    },
    {
      icon: <FaSignInAlt size={20} />,
      label: "Inside Passes",
      value: data.insidePasses,
      color: "amber",
    },
    {
      icon: <FaTrashAlt size={20} />,
      label: "Expired Passes",
      value: data.expiredPasses,
      color: "red",
    },
  ];

  // Checkins , checkouts Data 
  const checkins = [
    {
      icon: <FaSignInAlt size={20} />,
      label: "Total Check-ins",
      value: data.totalCheckIns,
      color: "indigo",
    },
    {
      icon: <FaSignOutAlt size={20} />,
      label: "Total Check-outs",
      value: data.totalCheckOuts,
      color: "slate",
    },
  ];

  // Appointments Data 
  const appointments = [
    {
      icon: <FaCalendarAlt size={20} />,
      label: "Total",
      value: data.totalAppointments,
      color: "indigo",
    },
    {
      icon: <FaClock size={20} />,
      label: "Requested",
      value: data.requestedAppointments,
      color: "slate",
    },
    {
      icon: <FaHourglassHalf size={20} />,
      label: "Pending",
      value: data.pendingAppointments,
      color: "amber",
    },
    {
      icon: <FaCheckCircle size={20} />,
      label: "Approved",
      value: data.approvedAppointments,
      color: "green",
    },
  ];

  // Chart Data
  // Appointments chart data
  const appointmentChartData = [
  {name: "Total",value: data.totalAppointments, 
    color: "#3b82f6" },
  {name: "Approved",value: data.approvedAppointments, 
    color: "#10b981" },
  { name: "Pending", value: data.pendingAppointments, 
    color: "#f59e0b" },
];

  // Passes chart data
  const passChartData = [
  {name: "Total", value: data.totalPasses, 
    color: "#8b5cf6" },
  {name: "Active",value:data.activePasses, 
    color: "#10b981" },
  {name:"Inside",value: data.insidePasses, 
    color: "#3b82f6" },
  {name:"Expired", value:data.expiredPasses, 
    color: "#6b7280" },
];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <p className="text-sm text-slate-500 mb-1">{greeting}, Admin 👋</p>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaUserTie
              size={28}
              className="text-blue-600 bg-blue-100 rounded-lg p-1.5"
            />
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2 text-sm bg-white px-3 py-1.5 rounded-lg shadow-sm">
          <DateTimeFormat
            iconSize={16}
            date={new Date()}
            type="date"
            showIcon={true}
          />
          <span className="text-slate-300">|</span>
          <DateTimeFormat
            iconSize={16}
            date={new Date()}
            type="time"
            showIcon={true}
          />
        </div>
      </div>

      {/* Stats Sections with Cards */}
      <div className="flex flex-col gap-4">
        <Card>
          <h1 className="text-lg font-semibold text-gray-700 mb-3">
            📊 Visitor's Data
          </h1>
          <StatsGrid className="grid grid-cols-2 lg:grid-cols-4 gap-4" stats={visitors} />
        </Card>

        {/* Appointment  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
          <h1 className="text-lg font-semibold text-gray-700 mb-3">
            📅 Appointments Data
          </h1>
          <StatsGrid className="grid grid-cols-2 gap-4" stats={appointments} />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            📅 Appointments Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentChartData}>
                <CartesianGrid/>
                <XAxis dataKey="name" className="text-xl font-semibold" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {appointmentChartData.map((entry, index) => (
                   <Cell key={index} fill={entry?.color} />
                 ))}
              </Bar>
           </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        </div>

         {/* Passes  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
          <h1 className="text-lg font-semibold text-gray-700 mb-3">
            🎫 Passes Data
          </h1>
          <StatsGrid className="grid grid-cols-2 gap-4" stats={passes} />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            🎫 Passes Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {passChartData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry?.color} />
                   ))}
                   </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        </div>

        <Card>
          <h1 className="text-lg font-semibold text-gray-700 mb-3">
            🚪 Check-in / Check-out Data
          </h1>
          <StatsGrid className="grid grid-cols-2 gap-4" stats={checkins} />
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
