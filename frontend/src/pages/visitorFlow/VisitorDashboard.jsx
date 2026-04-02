// frontend/src/pages/visitorFlow/VisitorDashboard.jsx
// Complete replacement code

import { useEffect, useState } from 'react'
import { getVisitorDashboard, requestAppointment } from '../../services/visitorAuthService'
import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'
import { 
  FaCalendarAlt, 
  FaPassport, 
  FaUser, 
  FaArrowRight,
  FaClock,
  FaCheckCircle,
  FaPlusCircle,
  FaTimes
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext';

// ==================== REQUEST APPOINTMENT MODAL ====================
const RequestAppointmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    preferredDate: '',
    preferredTime: '',
    purpose: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const dateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`)
    
    if (dateTime < new Date()) {
      toast.error('Please select a future date and time')
      setLoading(false)
      return
    }

    try {
      const response = await requestAppointment({
        preferredDate: dateTime.toISOString(),
        purpose: formData.purpose,
        message: formData.message
      })
      
      if (response.success) {
        toast.success('Appointment request sent successfully! Employee will confirm soon.')
        onSuccess()
        onClose()
        setFormData({ preferredDate: '', preferredTime: '', purpose: '', message: '' })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Request Appointment</h2>
            <p className="text-blue-100 text-sm">Submit your request to employee</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.preferredDate}
              onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              required
              value={formData.preferredTime}
              onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose of Visit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Meeting, Interview, Delivery"
              required
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Message (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Any additional information for the employee..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==================== MAIN DASHBOARD COMPONENT ====================
const VisitorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await getVisitorDashboard();
      
      let statsData = response;
      if (response?.stats) {
        statsData = response.stats;
      } else if (response?.data) {
        statsData = response.data;
      }
      
      setStats(statsData);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        
        {/* Header Section with Request Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
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
          
          {/* Request Appointment Button - NEW */}
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaPlusCircle size={18} />
            Request Appointment
          </button>
        </div>

        {/* Stats Cards */}
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
              {stats?.passGenerated > 0 ? "🎫 Your passes are ready" : "📌 No passes yet"}
            </div>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/visitor/appointments" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FaCalendarAlt size={18} />
            View My Appointments
            <FaArrowRight size={14} />
          </Link>
          <Link 
            to="/visitor/passes" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FaPassport size={18} />
            View My Passes
            <FaArrowRight size={14} />
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <p className="text-sm text-yellow-800 flex items-center gap-2">
            <FaClock size={14} />
            <strong>Note:</strong> After submitting request, employee will confirm your appointment date & time.
          </p>
        </div>
      </div>

      {/* Request Appointment Modal */}
      <RequestAppointmentModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={() => {
          fetchData()
        }}
      />
    </div>
  )
}

export default VisitorDashboard