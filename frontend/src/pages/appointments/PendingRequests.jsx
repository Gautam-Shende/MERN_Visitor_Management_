// frontend/src/pages/employee/PendingRequests.jsx
// Create this new file

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import { getPendingRequests, convertRequestToAppointment } from '../../services/appointmentService'
import { getUsers } from '../../services/userService'
import toast from 'react-hot-toast'
import { 
  FaUser, 
  FaCalendarAlt, 
  FaClock, 
  FaInfoCircle, 
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
  FaArrowRight,
  FaTimes
} from 'react-icons/fa'

const PendingRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [convertingId, setConvertingId] = useState(null)
  const [showForm, setShowForm] = useState(null)
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({ date: '', time: '', hostId: '' })
  const navigate = useNavigate()

  useEffect(() => {
    fetchRequests()
    fetchUsers()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await getPendingRequests()
      setRequests(response.data)
    } catch (error) {
      toast.error('Failed to load pending requests')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await getUsers()
      setUsers(response)
    } catch (error) {
      console.error('Failed to load users')
    }
  }

  const handleConvert = async (requestId) => {
    if (!formData.date || !formData.time) {
      toast.error('Please select date and time')
      return
    }

    setConvertingId(requestId)
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`)
      const response = await convertRequestToAppointment(requestId, {
        date: dateTime.toISOString(),
        hostId: formData.hostId
      })
      
      if (response.success) {
        toast.success('Appointment confirmed successfully!')
        setShowForm(null)
        setFormData({ date: '', time: '', hostId: '' })
        fetchRequests()
        navigate('/appointments')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm appointment')
    } finally {
      setConvertingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" text="Loading pending requests..." />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
          Pending Appointment Requests
        </h1>
        <p className="text-sm text-gray-500">
          Review visitor requests and confirm appointment date & time
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <p className="text-2xl font-bold text-yellow-700">{requests.length}</p>
          <p className="text-xs text-yellow-600">Pending Requests</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-2xl font-bold text-blue-700">
            {requests.filter(r => r.preferredDate).length}
          </p>
          <p className="text-xs text-blue-600">Awaiting Scheduling</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-2xl font-bold text-green-700">
            {requests.filter(r => new Date(r.preferredDate).toDateString() === new Date().toDateString()).length}
          </p>
          <p className="text-xs text-green-600">Requested Today</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <FaClock className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No Pending Requests</h3>
            <p className="text-sm text-gray-500">All visitor requests have been processed.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <Card key={request._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="bg-yellow-50 px-5 py-3 border-b border-yellow-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                    Request #{request._id.slice(-6)}
                  </span>
                  <span className="text-xs text-yellow-600 flex items-center gap-1">
                    <FaClock size={10} />
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                {/* Visitor Info */}
                <div className="flex items-center gap-3 mb-4">
                  {request.visitor?.photo ? (
                    <img src={request.visitor.photo} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FaUser className="text-blue-600 text-xl" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">{request.visitor?.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <FaEnvelope size={10} /> {request.visitor?.email}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <FaPhone size={10} /> {request.visitor?.phone}
                    </p>
                  </div>
                </div>

                {/* Request Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400 text-xs" />
                    <span className="text-gray-600">Preferred:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(request.preferredDate).toLocaleDateString()}
                    </span>
                    <span className="text-gray-500">
                      {new Date(request.preferredDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Purpose:</span>
                    <span className="ml-2 text-gray-800">{request.purpose}</span>
                  </div>
                  {request.message && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaInfoCircle size={10} /> Message:
                      </p>
                      <p className="text-sm text-gray-700">{request.message}</p>
                    </div>
                  )}
                </div>

                {/* Convert Form - Shown when clicked */}
                {showForm === request._id ? (
                  <div className="space-y-3">
                    <input
                      type="date"
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      placeholder="Select Date"
                    />
                    <input
                      type="time"
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      placeholder="Select Time"
                    />
                    <select
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                      onChange={(e) => setFormData({...formData, hostId: e.target.value})}
                    >
                      <option value="">Assign Host (Optional)</option>
                      {users.filter(u => u.role === 'admin' || u.role === 'employee').map(u => (
                        <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="primary" 
                        className="flex-1"
                        onClick={() => handleConvert(request._id)}
                        disabled={convertingId === request._id}
                      >
                        {convertingId === request._id ? 'Confirming...' : 'Confirm Appointment'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="flex-1"
                        onClick={() => {
                          setShowForm(null)
                          setFormData({ date: '', time: '', hostId: '' })
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => setShowForm(request._id)}
                  >
                    <FaCheckCircle size={14} />
                    Confirm & Schedule Appointment
                    <FaArrowRight size={12} />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default PendingRequests