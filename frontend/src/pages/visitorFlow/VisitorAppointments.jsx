
import { useEffect, useState } from 'react'
// import { getVisitorPass } from '../../services/visitorAuthService';
import { getVisitorAppointments } from '../../services/visitorAuthService';

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
  // FaMapMarkerAlt,
  FaUserCheck,
  FaCheck
} from 'react-icons/fa'

import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const VisitorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [])

  const fetchAppointments = async () => {
    setLoading(true);
    // setError()
    setError(null);
    try {
      const response = await getVisitorAppointments();
      
      let appointmentsData = [];
      if (Array.isArray(response)) {
        appointmentsData = response;
        // console.log(appointmentsData)
      } else if (response?.appointments && Array.isArray(response.appointments)) {
        appointmentsData = response.appointments;
        // console.log(appointmentsData)
      } else if (response?.data && Array.isArray(response.data)) {
        appointmentsData = response.data;
      } else {
        // console.warn("Unexpected response format:", response)
        toast.error("Unexpected respose format: ", response)
        appointmentsData = [];
      }
      //
      setAppointments(appointmentsData);
    } catch (err) {
      // console.error('Error fetching appointments:', err);
      setError(err.response?.data?.message || 'Failed to load appointments');
      toast.error('Failed to load appointments');
    } finally {
      // setTimeout(() => {
      //   setLoading(false);
      // }, 1000)
      setLoading(false);
    }
  }

  const getStatusBadge = (status) => {
    const statusFilter = {
      pending: { 
        bg: 'bg-amber-50', 
        text: 'text-amber-700', 
        border: 'border-amber-200', 
        icon: FaHourglassHalf, 
        label: 'Pending',
        gradient: 'from-amber-400 to-amber-500'
      },
      approved: { 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700', 
        border: 'border-emerald-200', 
        icon: FaCheckCircle, 
        label: 'Approved',
        gradient: 'from-emerald-400 to-emerald-500'
      },
      rejected: { 
        bg: 'bg-rose-50', 
        text: 'text-rose-700', 
        border: 'border-rose-200', 
        icon: FaTimesCircle, 
        label: 'Rejected',
        gradient: 'from-rose-400 to-rose-500'
      },
    };
    const Status = statusFilter[status] || statusFilter.pending;
    const Icon = Status.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${Status.bg} ${Status.text} ${Status.border}`}>
        <Icon size={12} />
        {Status.label}
      </div>
    );
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <Spinner size="xl" text="Loading your appointments..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 text-center lg:text-left">
          <div className="inline-flex items-center justify-center lg:justify-start w-full">
            <div className="relative">
              <h1 className="relative text-3xl lg:text-4xl font-bold text-blue-600">
                My Appointments
              </h1>
            </div>
          </div>
          <p className="text-gray-500 mt-2 flex items-center justify-center lg:justify-start gap-2">
            <FaCalendarAlt className="text-blue-500" size={16} />
            Track and manage all your scheduled appointments
          </p>
        </div>

        {appointments.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
              <p className="text-xs text-gray-500">Total Appointments</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 shadow-sm border border-amber-100">
              <p className="text-2xl font-bold text-amber-600">
                {appointments.filter(a => a.status === 'pending').length}
              </p>
              <p className="text-xs text-amber-600">Pending</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 shadow-sm border border-emerald-100">
              <p className="text-2xl font-bold text-emerald-600">
                {appointments.filter(a => a.status === 'approved').length}
              </p>
              <p className="text-xs text-emerald-600">Approved</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 shadow-sm border border-purple-100">
              <p className="text-2xl font-bold text-purple-600">
                {appointments.filter(a => a.passGenerated).length}
              </p>
              <p className="text-xs text-purple-600">Passes Generated</p>
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
                Your appointments will appear here once created by the admin or host.
                Please check back later.
              </p>
              <Button variant="primary" onClick={fetchAppointments} className="mt-2">
                Refresh
              </Button>
            </div>
          </Card>
        )}

        {appointments.length > 0 && (
          // <div className="flex flex-col md:flex-col-2 lg:flex-col-3 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((app) => {
              const { date, time } = formatDateTime(app.date);
              return (
                <Card 
                  key={app._id} 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 group bg-white"
                >
                  <div className={`relative h-2 ${
                    app.status === 'approved' ? 'bg-emerald-500' :
                    app.status === 'pending' ? 'bg-amber-500' :
                    'bg-rose-500'
                  }`}></div>
                  
                  <div className="p-5">

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                          <FaUser className="text-white text-xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {app.host?.name || 'N/A'}
                          </h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaBuilding size={10} />
                            {app.host?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <FaCalendarAlt className="text-blue-500" size={14} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="text-sm font-medium text-gray-700">{date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                          <FaClock className="text-purple-500" size={14} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="text-sm font-medium text-gray-700">{time}</p>
                        </div>
                      </div>
                    </div>

                    {app.visitor?.purpose && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Purpose of Visit</p>
                        <p className="text-sm font-medium text-gray-700">{app.visitor.purpose}</p>
                      </div>
                    )}

                    {app.passGenerated && (
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

                    {!app.passGenerated && app.status === 'approved' && (
                      <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="text-xs text-amber-600 flex items-center justify-center gap-2">
                          <FaHourglassHalf size={12} />
                          Pass will be generated soon
                        </p>
                      </div>
                    )}

                    {app.status === 'pending' && (
                      <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                          <FaClock size={12} />
                          Waiting for approval
                        </p>
                      </div>
                    )}
                    {app.status === "approved" && (
                      <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                          <FaCheck size={12} />
                          Appointment approved
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