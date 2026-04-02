// frontend/src/pages/visitorFlow/VisitorAppointments.jsx
// Complete working code - Copy paste this entire file

import { useEffect, useState } from 'react'
import { getVisitorAppointments } from '../../services/visitorAuthService'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import { 
  FaPassport, 
  FaCalendarAlt, 
  FaUser, 
  FaBuilding, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaHourglassHalf,
  FaUserCheck,
  FaSpinner,
  FaInfoCircle,
  FaRegClock,
  FaArrowLeft
} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const VisitorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, [])

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVisitorAppointments();
      
      let appointmentsData = [];
      if (Array.isArray(response)) {
        appointmentsData = response;
      } else if (response?.appointments && Array.isArray(response.appointments)) {
        appointmentsData = response.appointments;
      } else if (response?.data && Array.isArray(response.data)) {
        appointmentsData = response.data;
      } else {
        appointmentsData = [];
      }
      
      setAppointments(appointmentsData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (appointment) => {
    if (appointment.requestedByVisitor === true && appointment.status === 'requested') {
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: FaRegClock,
        label: 'Request Sent',
        description: 'Employee will confirm date & time soon'
      }
    }
    
    switch(appointment.status) {
      case 'pending':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: FaHourglassHalf,
          label: 'Pending Approval',
          description: 'Waiting for admin approval'
        }
      case 'approved':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: FaCheckCircle,
          label: 'Approved',
          description: 'Your pass is ready'
        }
      case 'rejected':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          icon: FaTimesCircle,
          label: 'Rejected',
          description: 'Please contact support'
        }
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: FaInfoCircle,
          label: 'Unknown',
          description: 'Contact support'
        }
    }
  }

  const formatDateTime = (date) => {
    try {
      return {
        date: new Date(date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        time: new Date(date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
    } catch {
      return { date: 'Invalid date', time: 'Invalid time' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="xl" text="Loading your appointments..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/visitor/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FaArrowLeft size={18} />
                <span>Back to Dashboard</span>
              </button>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-blue-600">
                  My Appointments
                </h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-500" size={16} />
                  Track and manage all your scheduled appointments
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={fetchAppointments} className="gap-2">
              <FaSpinner className={loading ? 'animate-spin' : ''} /> Refresh
            </Button>
          </div>
        </div>

        {appointments.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
              <p className="text-xs text-gray-500">Total Appointments</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 shadow-sm border border-amber-100">
              <p className="text-2xl font-bold text-amber-600">
                {appointments.filter(a => a.status === 'pending' && !a.requestedByVisitor).length}
              </p>
              <p className="text-xs text-amber-600">Pending Approval</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border border-yellow-100">
              <p className="text-2xl font-bold text-yellow-600">
                {appointments.filter(a => a.requestedByVisitor === true && a.status === 'requested').length}
              </p>
              <p className="text-xs text-yellow-600">Requests Sent</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 shadow-sm border border-emerald-100">
              <p className="text-2xl font-bold text-emerald-600">
                {appointments.filter(a => a.status === 'approved').length}
              </p>
              <p className="text-xs text-emerald-600">Approved</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <FaTimesCircle className="text-rose-500" size={14} />
            </div>
            <p className="text-sm text-rose-700 flex-1">{error}</p>
            <Button variant="secondary" size="sm" onClick={fetchAppointments}>
              Try Again
            </Button>
          </div>
        )}

        {appointments.length === 0 && !error && (
          <Card className="p-12 text-center bg-white">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                <FaCalendarAlt className="text-blue-500 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">No Appointments Yet</h3>
              <p className="text-gray-500 max-w-md text-center">
                Your appointments will appear here once created by admin or when you submit a request.
              </p>
              <Link to="/visitor/dashboard">
                <Button variant="primary" className="mt-2">
                  Request Appointment
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {appointments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((app) => {
              const status = getStatusBadge(app);
              const StatusIcon = status.icon;
              const isRequestPending = app.requestedByVisitor === true && app.status === 'requested';
              const isConfirmedAppointment = app.date && app.status !== 'requested';
              
              return (
                <Card 
                  key={app._id} 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 group bg-white"
                >
                  <div className={`h-1.5 ${status.bg.replace('50', '500')}`}></div>
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <FaUser className="text-blue-600 text-lg" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-base">
                            {app.host?.name || 'Not Assigned'}
                          </h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaBuilding size={10} />
                            {app.host?.email || 'Will be assigned soon'}
                          </p>
                        </div>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${status.bg} ${status.text} ${status.border}`}>
                        <StatusIcon size={11} />
                        {status.label}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {isRequestPending && app.preferredDate && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                            <FaRegClock className="text-yellow-500" size={14} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Preferred Date & Time</p>
                            <p className="text-sm font-medium text-gray-700">
                              {new Date(app.preferredDate).toLocaleDateString()} at {new Date(app.preferredDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )}

                      {isConfirmedAppointment && (
                        <>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                              <FaCalendarAlt className="text-blue-500" size={14} />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Date</p>
                              <p className="text-sm font-medium text-gray-700">
                                {formatDateTime(app.date).date}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                              <FaClock className="text-purple-500" size={14} />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Time</p>
                              <p className="text-sm font-medium text-gray-700">
                                {formatDateTime(app.date).time}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Purpose of Visit</p>
                        <p className="text-sm font-medium text-gray-700">{app.purpose || app.visitor?.purpose || 'General Visit'}</p>
                      </div>

                      {app.message && (
                        <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                          <p className="text-xs text-yellow-600 mb-1">Your Message:</p>
                          <p className="text-sm text-yellow-700">{app.message}</p>
                        </div>
                      )}
                    </div>

                    <div className="mb-4 text-center">
                      <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                        <FaInfoCircle size={10} />
                        {status.description}
                      </p>
                    </div>

                    {app.status === 'approved' && (
                      <Link to={`/visitor/pass-details/${app._id}`}>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
                        >
                          <FaPassport size={14} />
                          View Digital Pass
                          <FaUserCheck size={14} className="ml-auto" />
                        </Button>
                      </Link>
                    )}

                    {app.status === 'pending' && !app.requestedByVisitor && (
                      <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="text-xs text-amber-600 flex items-center justify-center gap-2">
                          <FaHourglassHalf size={12} />
                          Waiting for admin approval
                        </p>
                      </div>
                    )}

                    {app.status === 'requested' && (
                      <div className="text-center p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                        <p className="text-xs text-yellow-600 flex items-center justify-center gap-2">
                          <FaRegClock size={12} />
                          Employee will confirm your appointment soon
                        </p>
                      </div>
                    )}

                    {app.status === 'rejected' && (
                      <div className="text-center p-3 bg-rose-50 rounded-xl border border-rose-100">
                        <p className="text-xs text-rose-600 flex items-center justify-center gap-2">
                          <FaTimesCircle size={12} />
                          Appointment rejected. Please contact support
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorAppointments;