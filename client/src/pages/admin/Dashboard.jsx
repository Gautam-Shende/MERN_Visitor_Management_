import { useEffect, useState } from 'react'

// import { fetchVisitorById } from '../../services/visitorService'
import { fetchDashboardStats } from '../../services/dashboardService'
import { fetchRecentVisitors } from '../../services/visitorService'
import { fetchAppointments } from '../../services/appointmentService'
import { fetchPasses } from '../../services/passService'

import Spinner from '../../components/common/Spinner'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import StatusBadge from '../../components/common/StatusBadge'
import DateTimeFormat from '../../components/common/DateTimeFormat'

import toast from 'react-hot-toast'

// import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  FaUserCheck, FaSignInAlt, FaSignOutAlt, FaCalendarCheck,
  FaArrowRight, FaClock, FaHourglassHalf, FaEye, FaCalendarAlt,
  FaUsers, FaPassport, FaCheckCircle, FaTimesCircle,
} from 'react-icons/fa'  

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  
  const [recentVisitors, setRecentVisitors] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
  const [recentPasses, setRecentPasses] = useState([])
  
  // error , & loading stat
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsData, visitorsData, appointmentsData, passesData] = await Promise.all([
        // this is fetch all data
        fetchDashboardStats(),
        fetchRecentVisitors(10),
        fetchAppointments(),
        fetchPasses(),
      ])
      setStats(statsData)
      setRecentVisitors(visitorsData)
      setRecentAppointments(Array.isArray(appointmentsData) ? appointmentsData.slice(0, 5) : [])
      setRecentPasses(Array.isArray(passesData) ? passesData.slice(0, 5) : [])
      
      // console.log(setRecentAppointments(visitorsData))
    } catch (error) {
      // console.error('Dashboard fetch error:', error)
      toast.error(error)
    } finally {
      setLoading(false)
    }
  }

  const weeklyData = [
    { day: 'Mon', checkIns: 24, appointments: 10 },
    { day: 'Tue', checkIns: 19, appointments: 18 },
      { day: 'Wed', checkIns: 15, appointments: 14 },
      { day: 'Thu', checkIns: 22, appointments: 20 },
      { day: 'Fri', checkIns: 27, appointments: 25 },
    { day: 'Sat', checkIns: 8,  appointments: 8 },
    { day: 'Sun', checkIns: 3,  appointments: 4 },
  ]

  const todayAnalytics = stats ? [
    { name:'Visitors', value: stats.visitors?.today || 0, color: '#3b82f6' },
    { name:'Appointments',value: stats.appointments?.today || 0,color: '#10b981' },
    { name:'Check-ins', value: stats.checkLogs?.todayCheckIns || 0,color: '#f59e0b' },
    { name:'Check-outs', value: stats.checkLogs?.todayCheckOuts || 0,color: '#ef4444' },
  ] : []

  const appointmentStatusData = stats ? [
    { name:'Pending', value: stats.appointments?.pending || 0,color: '#F59E0B' },
    { name:'Approved',value: stats.appointments?.approved || 0, color: '#10B981' },
    { name:'Rejected', value: stats.appointments?.rejected || 0, color: '#EF4444' },
  ] : []

  const passStatusData = stats ? [
    { name: 'Active',  value: stats.passes?.active || 0,  color: '#10B981' },
    { name: 'Inside',  value: stats.passes?.inside || 0,  color: '#3B82F6' },
    { name: 'Expired', value: stats.passes?.expired || 0, color: '#6B7280' },
  ] : []

  const visitorStatusData = stats ? [
    { name: 'Pending',  value: stats.visitors?.pending || 0,  color: '#F59E0B' },
    { name: 'Approved', value: stats.visitors?.approved || 0, color: '#10B981' },
    { name: 'Rejected', value: stats.visitors?.rejected || 0, color: '#EF4444' },
  ] : []


  const appointmentColumns = [
    {
      header: 'Visitor',
      accessor: 'visitor',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.visitor?.photo ? (
            <img src={row.visitor.photo} alt={row.visitor.name} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs">{row.visitor?.name?.charAt(0)}</span>
            </div>
          )}
          <span className="text-sm font-medium">{row.visitor?.name}</span>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: 'date',
      cell: (row) => <DateTimeFormat date={row.date} type="date" format="short" showIcon={false} />,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status} type="appointment" size="sm" />,
    },
    {
      header: 'Actions',
      accessor: '_id',
      cell: (row) => (
        <Link to={`/appointments/${row._id}`} className="text-blue-600 hover:text-blue-800">
          <FaEye />
        </Link>
      ),
    },
  ]

  const passColumns = [
    {
      header: 'Visitor',
      accessor: 'visitor',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.visitor?.photo ? (
            <img src={row.visitor.photo} alt={row.visitor.name} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-white text-xs">{row.visitor?.name?.charAt(0)}</span>
            </div>
          )}
          <span className="text-sm font-medium">{row.visitor?.name}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status} type="pass" size="sm" />,
    },
    {
      header: 'QR',
      accessor: 'qrCode',
      cell: (row) => row.qrCode
        ? <img src={row.qrCode} alt="QR" className="w-8 h-8" />
        : <span className="text-gray-400">—</span>,
    },
    {
      header: 'Actions',
      accessor: '_id',
      cell: (row) => (
        <Link to={`/passes/${row._id}`} className="text-blue-600 hover:text-blue-800">
          <FaEye />
        </Link>
      ),
    },
  ]

  const visitorColumns = [
    {
      header: 'Visitor',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.photo ? (
            <img src={row.photo} alt={row.name} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <span className="text-white text-xs">{row.name?.charAt(0)}</span>
            </div>
          )}
          <span className="text-sm font-medium">{row.name}</span>
        </div>
      ),
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status} type="visitor" size="sm" />,
    },
    {
      header: 'Actions',
      accessor: '_id',
      cell: (row) => (
        <Link to={`/visitors/${row._id}`} className="text-blue-600 hover:text-blue-800">
          <FaEye />
        </Link>
      ),
    },
  ]

  const summaryCards = [
    { title: 'Total Visitors',          value: stats?.visitors?.total || 0,           icon: FaUsers,        color: 'bg-blue-500' },
    { title: 'Total Appointments',      value: stats?.appointments?.total || 0,       icon: FaCalendarAlt,  color: 'bg-indigo-500' },
    { title: 'Total Passes',            value: stats?.passes?.total || 0,             icon: FaPassport,     color: 'bg-purple-500' },
    { title: 'Total Check-ins',         value: stats?.checkLogs?.totalCheckIns || 0,  icon: FaSignInAlt,    color: 'bg-green-500' },
    { title: 'Total Check-outs',        value: stats?.checkLogs?.totalCheckOuts || 0, icon: FaSignOutAlt,   color: 'bg-orange-600' },
    { title: 'Currently Inside',        value: stats?.checkLogs?.currentlyInside || 0,icon: FaUserCheck,    color: 'bg-emerald-500' },
    { title: 'Pending Approvals',       value: stats?.visitors?.pending || 0,         icon: FaHourglassHalf,color: 'bg-yellow-500' },
    { title: 'Approved Appointments',   value: stats?.visitors?.approved || 0,        icon: FaCheckCircle,  color: 'bg-green-600' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" text="Loading Dashboard..." />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Complete overview of your visitor management system</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Current Date</p>
            <p className="font-semibold text-gray-800">
              <DateTimeFormat date={new Date()} type="date" format="long" showIcon={false} />
            </p>
          </div>
          {/* <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Current Time</p>
            <p className="font-semibold text-gray-800">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div> */}
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Current Time</p>
            <p className="font-semibold text-gray-800">
              <DateTimeFormat date={new Date()} type="time" format="long" showIcon={false} />
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className={`${card.color} p-2 rounded-lg`}>
                <card.icon size={20} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Activity</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <FaUserCheck className="text-blue-600 text-2xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats?.visitors?.today || 0}</p>
            <p className="text-xs text-gray-500">New Visitors</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <FaSignInAlt className="text-green-600 text-2xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats?.checkLogs?.todayCheckIns || 0}</p>
            <p className="text-xs text-gray-500">Check-ins Today</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <FaCalendarCheck className="text-purple-600 text-2xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats?.appointments?.today || 0}</p>
            <p className="text-xs text-gray-500">Appointments Today</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <FaClock className="text-yellow-600 text-2xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats?.checkLogs?.currentlyInside || 0}</p>
            <p className="text-xs text-gray-500">Currently Inside</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Weekly Overview</h2>
              <p className="text-sm text-gray-500">Check-ins vs Appointments</p>
            </div>
            <select
              className="text-sm border rounded-lg px-3 py-2 bg-gray-50"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="checkIns" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Check-ins" />
                <Bar dataKey="appointments" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Today's Analytics</h2>
            <p className="text-sm text-gray-500">Live activity breakdown</p>
          </div>
          <div className="h-72">
            {stats && todayAnalytics.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={todayAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {todayAnalytics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading analytics data...</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title:'Visitor Status', data: visitorStatusData },
          { title:'Appointment Status', data: appointmentStatusData },
          { title:'Pass Status', data: passStatusData },
        ].map((chart) => (
          <Card key={chart.title} className="p-6 text-center">
            <h3 className="text-md font-semibold text-gray-800 mb-4">{chart.title}</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chart.data} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {chart.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-1">
              {chart.data.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Recent Visitors</h2>
              <p className="text-sm text-gray-500">Latest registered visitors</p>
            </div>
            <Link to="/visitors" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
              View All <FaArrowRight size={12} />
            </Link>
          </div>
          <Table columns={visitorColumns} data={recentVisitors} emptyMessage="No visitors found" />
        </Card>

        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Recent Appointments</h2>
              <p className="text-sm text-gray-500">Latest appointment requests</p>
            </div>
            <Link to="/appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
              View All <FaArrowRight size={12} />
            </Link>
          </div>
          <Table columns={appointmentColumns} data={recentAppointments} emptyMessage="No appointments found" />
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Recent Passes</h2>
            <p className="text-sm text-gray-500">Latest generated passes</p>
          </div>
          <Link to="/passes" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
            View All <FaArrowRight size={12} />
          </Link>
        </div>
        <Table columns={passColumns} data={recentPasses} emptyMessage="No passes found" />
      </Card>

    </div>
  )
}

export default Dashboard