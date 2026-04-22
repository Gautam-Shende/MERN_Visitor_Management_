import { useEffect, useState } from 'react'
//service
import { fetchVisitorAppointments } from '../../services/visitorAuthService'
import { APPOINTMENT_STATUS_BADGE } from '../../utils/constants.js'
// common compo
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import StatusBadge from '../../components/common/StatusBadge'
import DateTimeFormat from '../../components/common/DateTimeFormat'

// import {useAuth} from "../../context/AuthContext.jsx"
import { 
  FaPassport, FaCalendarAlt, FaUser, FaBuilding, FaClock, 
  FaUserCheck, FaSyncAlt, FaArrowLeft,
  FaRegClock, FaHourglassHalf, FaTimesCircle
} from 'react-icons/fa'

import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const VisitorAppointments = () => {
  // const [user] = useAuth("")
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  const navigate = useNavigate()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    // setError("This is an Visitor Appointment error...")
    setError(null)
    try {
      const response = await fetchVisitorAppointments()
      
      let appointmentsData = []
      if (Array.isArray(response)) {
        appointmentsData = response
      } else if (response?.appointments && Array.isArray(response.appointments)) {
        appointmentsData = response.appointments
      } else if (response?.data && Array.isArray(response.data)) {
        appointmentsData = response.data
      };
      
      // console.log('All appointments:', appointmentsData)
      // console.log('Pending check:', appointmentsData.filter(a => a.status === 'pending'))
      
      setAppointments(appointmentsData)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments')
      // console.log("Failed to load apointmetns...")
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredAppointments = () => {
    if (filter === 'all') {
      return appointments
    }
    return appointments.filter(a => a.status === filter)
  }

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    requested: appointments.filter(a => a.status === 'requested').length,
    rejected: appointments.filter(a => a.status === 'rejected').length,
  }

  const filterButtons = [
  { label: 'All', value: 'all', count: statusCounts.all, color: 'bg-gray-100 text-gray-600' },
  { label: 'Pending', value: 'pending', count: statusCounts.pending, color: 'bg-amber-50 text-amber-600' },
  { label: 'Approved', value: 'approved', count: statusCounts.approved, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Requested', value: 'requested', count: statusCounts.requested, color: 'bg-yellow-50 text-yellow-600' },
  { label: 'Rejected', value: 'rejected', count: statusCounts.rejected, color: 'bg-rose-50 text-rose-600' },
  ]

  const filteredAppointments = getFilteredAppointments();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="xl" text="Loading your appointments..." />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => navigate('/visitor/dashboard')}
            >
              <FaArrowLeft size={14} className="mr-2" />
              Back
            </Button>
            <div>
              <h1 className="flex gap-3 items-center text-2xl font-bold text-blue-600"><FaCalendarAlt/> My Appointments</h1>
              <p className="text-sm text-gray-500">Track and manage your appointments</p>
            </div>
          </div>
          <Button variant="secondary" onClick={fetchAppointments}>
            <FaSyncAlt className={loading ? 'animate-spin mr-2' : 'mr-2'} />
            Refresh
          </Button>
        </div>

         <div className="grid sm:grid-cols-5 lg:grid-cols-5 gap-4 mb-6">
              {filterButtons.map((btn) => (
                <button
                   key={btn.value}
                    onClick={() => setFilter(btn.value)}
                    className={` p-4 rounded-xl border-2 transition-all duration-200 text-left 
                   ${filter === btn.value 
                   ? 'border-blue-500 ring-3 ring-blue-200' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                 }
                 ${btn.color}
                 `}
              >
                   <p className="text-xs mb-1">{btn.label}</p>
                   <p className="text-2xl font-bold">{btn.count}</p>
             </button>
           ))}
         </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <FaTimesCircle className="text-red-500" />
            <p className="text-sm text-red-700 flex-1">{error}</p>
            <Button variant="secondary" size="sm" onClick={fetchAppointments}>
              Try Again
            </Button>
          </div>
        )}

        {filteredAppointments.length === 0 && !error && (
          <Card className="text-center py-12">
            <FaCalendarAlt className="text-blue-500 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {filter === 'all' && 'No Appointments Yet'}
              {filter === 'pending' && 'No Pending Appointments'}
              {filter === 'approved' && 'No Approved Appointments'}
              {filter === 'requested' && 'No Requests Sent'}
              {filter === 'rejected' && 'No Rejected Appointments'}
            </h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' && 'Your appointments will appear here'}
              {filter === 'pending' && 'All appointments are processed'}
              {filter === 'approved' && 'No approved appointments '}
              {filter === 'requested' && 'You did not sent any requests'}
              {filter === 'rejected' && 'No rejected appointments'}
            </p>
            {filter === 'all' && (
              <Link to="/visitor/dashboard">
                <Button variant="primary">Request Appointment</Button>
              </Link>
            )}
          </Card>
        )}

        {filteredAppointments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((app) => {
              let badgeStatus = app.status
              if (app.requestedByVisitor === true && app.status === 'requested') {
                badgeStatus = 'requested'
              }
              
              return (
                <Card key={app._id} padding="none" className="overflow-hidden">
                  <div className="p-4">
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {app.host?.name || 'Not Assigned'}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {app.host?.email || 'Will be assigned soon'}
                          </p>
                        </div>
                      </div>
                      <StatusBadge size='lg' status={badgeStatus} type="appointment" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-1 px-5 py-3 ">
                      {app.requestedByVisitor && app.preferredDate && (
                        <div className="flex items-center gap-3 text-sm bg-yellow-50 rounded-lg p-2 m-2">
                          <FaRegClock className="text-yellow-500" />
                         <div>
                           <p className='text-xs text-gray-500'>Preferred</p>
                          <DateTimeFormat 
                           date={app.preferredDate}
                           type='datetime'
                           format='short'
                           showIcon={false}
                          />
                         </div>
                        </div>
                      )}

                      {app.date && app.status !== 'requested' && (
                        <>
                          <div className="flex items-center gap-3 text-sm bg-blue-50 rounded-lg p-2 m-2">
                            <FaCalendarAlt className="text-blue-500" />
                             <div>
                                <p className="text-xs text-gray-500">Date</p>
                                 <DateTimeFormat 
                                  date={app.date} 
                                  type="date" 
                                  format="short"
                                   showIcon={false}
                                  />
                                </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm bg-purple-50 rounded-lg p-2 m-2">
                            <FaClock className="text-purple-500" />
                             <div>
                                <p className="text-xs text-gray-500">Time</p>
                                 <DateTimeFormat 
                                  date={app.date} 
                                  type="time" 
                                  format="short"
                                   showIcon={false}
                                  />
                              </div>
                          </div>
                        </>
                      )}

                      <div className=" bg-slate-100 rounded-lg p-2 m-2">
                        <p className="text-xs text-gray-500">Purpose</p>
                        <p className="text-sm">{app.purpose || 'General Visit'}</p>
                      </div>

                      {/* {app.message && (
                        <div className="bg-yellow-50 p-2 rounded-lg">
                          <p className="text-xs text-yellow-600">Message</p>
                          <p className="text-sm">{app.message}</p>
                        </div>
                      )} */}
                    </div>

                    
                    {app.message && (
                        <div className="bg-yellow-50 p-2 rounded-lg my-2">
                          <p className="text-xs text-yellow-600">Message</p>
                          <p className="text-sm">{app.message}</p>
                        </div>
                    )}

                    {app.status === 'approved' && (
                      <Link to={`/visitor/pass-details/${app._id}`}>
                        <Button className="text-2xl w-full" variant="primary" >
                          <FaPassport className="mr-2" size={24} />
                          View Pass
                          <FaUserCheck className="ml-auto" size={24} />
                        </Button>
                      </Link>
                    )}

                    {app.status === 'pending' && (
                      <div className="text-center py-2 bg-amber-50 rounded-lg text-sm text-amber-600">
                        <FaHourglassHalf className="inline mr-2" size={12} />
                        Waiting for approval
                      </div>
                    )}

                    {app.status === 'requested' && (
                      <div className="text-center py-2 bg-yellow-50 rounded-lg text-sm text-yellow-600">
                        <FaRegClock className="inline mr-2" size={12} />
                        Employee will confirm soon
                      </div>
                    )}

                    {app.status === 'rejected' && (
                      <div className="text-center py-2 bg-red-50 rounded-lg text-sm text-red-600">
                        <FaTimesCircle className="inline mr-2" size={12} />
                        Appointment rejected
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default VisitorAppointments