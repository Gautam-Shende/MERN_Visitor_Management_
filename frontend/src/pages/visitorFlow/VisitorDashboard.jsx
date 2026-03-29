
// import { useMemo } from 'react'
import { useEffect, useState } from 'react'
import { getVisitorDashboard } from '../../services/visitorAuthService'
// import { getVisitorPass } from '../../services/visitorAuthService'

import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'

import { 
  FaCalendarAlt, 
  FaPassport, 
  FaUser, 
  FaArrowRight,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa'

import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useAuth } from '../../context/AuthContext';

const VisitorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // console.log("VisitorDashboard component mounted");
    fetchData();
  }, [])

  const fetchData = async () => {
    // console.log("Fetching visitor dashboard data...")
    setLoading(true)
    try {
      const response = await getVisitorDashboard();
      // console.log("Dashboard API response:", response);
      
      let statsData = response;
      if (response?.stats) {
        // console.log("Using response.stats data");
        statsData = response.stats;
      } else if (response?.data) {
        // console.log("Using response.data");
        statsData = response.data;
      }
      
      // console.log("Processed stats data:", statsData);
      setStats(statsData);
    } catch (err) {
      // console.error('Dashboard error:', err);

      toast.error('Failed to load dashboard');
    } finally {
      // console.log("Setting loading state to false");
      setLoading(false);
    }
  };

  if (loading) {
    // console.log("Loading dashboard, showing spinner");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                Welcome, <span className="text-blue-600">
                  {user?.name?.split(' ')[0] || 'Visitor'}!
                </span>
              </h1>
              <p className="text-gray-500 mt-1">Manage your appointments and passes</p>
            </div>
          </div>
        </div>

        {/* <div className="flex flex-wrap flex-col-reverse gap-5 mb-10"> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">

          <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-blue-50 border-0">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <FaCalendarAlt size={28} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-gray-800">{stats?.totalAppointments || 0}</p>
                <p className="text-sm text-gray-500">Total Appointments</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-amber-600">
                <FaClock size={12} />
                <span>Pending: {stats?.pending || 0}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <FaCheckCircle size={12} />
                <span>Approved: {stats?.approved || 0}</span>
              </div>
            </div>
          </Card>


          <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-purple-50 border-0">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg">
                <FaPassport size={28} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-gray-800">{stats?.passGenerated || 0}</p>
                <p className="text-sm text-gray-500">Passes Generated</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 text-center pt-2">
              {stats?.passGenerated > 0 
                ? "🎫 Your passes are ready" 
                : "📌 No passes yet"}
            </div>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link 
            to="/visitor/appointments" 
            className="group bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center gap-2"
          >
            <FaCalendarAlt size={18} />
            View My Appointments
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
          </Link>
          <Link 
            to="/visitor/passes" 
            className="group bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all duration-300 font-semibold flex items-center gap-2"
          >
            <FaPassport size={18} />
            View My Passes
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
          </Link>
        </div>


        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact your host or admin for assistance.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VisitorDashboard