
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'
import DateTimeFormat from '../../components/common/DateTimeFormat'

import { fetchAppointmentById, 
  convertRequestToAppointment } from '../../services/appointmentService'
import { fetchUsers } from '../../services/userService'
import toast from 'react-hot-toast'

import {
  FaArrowLeft,
   FaUser, 
   FaEnvelope,
    FaPhone, 
    FaCalendarAlt,
  FaInfoCircle,
   FaCheckCircle,
    FaSpinner,
     FaClock,
} from 'react-icons/fa'

const ScheduleAppointment = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  
  const [request, setRequest] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    hostId: ''
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Fetch request details
        const requestData = await fetchAppointmentById(id)
        setRequest(requestData)
        
        // Fetch users list
        const usersData = await fetchUsers()
        setUsers(usersData)
        
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load request data')
        navigate('/employee/requests')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      loadData()
    } else {
      navigate('/employee/requests')
    }
  }, [id, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.date || !formData.time) {
      toast.error('Please select date and time')
      return
    }
    
    if (!formData.hostId) {
      toast.error('Please select a host')
      return
    }
    
    setSubmitting(true)
    
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`)
      
      const response = await convertRequestToAppointment(id, {
        date: dateTime.toISOString(),
        hostId: formData.hostId,
      })
      
      if (response.success) {
        toast.success('Appointment confirmed successfully!')
        navigate('/appointments')
      } else {
        toast.error(response.message || 'Failed to confirm appointment')
      }
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to confirm appointment'
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" text="Loading..." />
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-500">Request not found</p>
          <Button variant="primary" onClick={() => navigate('/employee/requests')} className="mt-4">
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  const eligibleHosts = users.filter(u => u.role === 'admin' || u.role === 'employee')

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-6">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/employee/requests')}
            className="gap-2"
          >
            <FaArrowLeft size={14} /> Back to Requests
          </Button>
        </div>

        <Card className="overflow-hidden shadow-xl">
          
          <div className="bg-blue-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <FaCalendarAlt className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Schedule Appointment</h1>
                {/* <p className="text-blue-100 text-sm">
                  Request #{request._id?.slice(-8)}
                </p> */}
              </div>
            </div>
          </div>

          <div className="p-6">
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FaUser className="text-blue-600" size={12} />
                </div>
                Visitor Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaUser className="text-gray-400" size={14} />
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">{request.visitor?.name || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl overflow-hidden">
                  <FaEnvelope className="text-gray-400" size={14} />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{request.visitor?.email || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaPhone className="text-gray-400" size={14} />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{request.visitor?.phone || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaInfoCircle className="text-gray-400" size={14} />
                  <div>
                    <p className="text-xs text-gray-500">Purpose</p>
                    <p className="font-medium text-gray-800">{request.purpose || 'General Visit'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <FaClock className="text-yellow-600" size={12} />
                </div>
                Request Details
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                  <FaCalendarAlt className="text-yellow-500" size={14} />
                  <div>
                    <p className="text-xs text-yellow-600">Preferred Date & Time</p>
                    <p className="font-medium  text-gray-800">
                     <DateTimeFormat 
                          date={request.preferredDate} 
                          type="datetime" 
                          format="short"
                          showIcon={false}
                          emptyText="N/A"
                        />
                      </p>
                  </div>
                </div>
                
                {request.message && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <FaInfoCircle size={10} /> Message from Visitor:
                    </p>
                    <p className="text-sm text-gray-700">{request.message}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                  <FaCheckCircle className="text-green-600" size={12} />
                </div>
                Schedule Appointment
              </h2>

              <div className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      disabled={submitting}
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="time"
                      disabled={submitting}
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign Host <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="hostId"
                    disabled={submitting}
                    value={formData.hostId}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a host...</option>
                    {eligibleHosts.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="secondary" 
                    className="flex-1" 
                    disabled={submitting}
                    onClick={() => navigate('/employee/requests')}
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    className="flex-1" 
                    onClick={handleSubmit} 
                    disabled={submitting}
                  >
                    {submitting ? (
                      <><FaSpinner className="animate-spin mr-2" /> Confirming...</>
                    ) : (
                      <><FaCheckCircle className="mr-2" /> Confirm Appointment</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ScheduleAppointment