
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// import { useMemo } from 'react'

import {
  fetchAppointmentById,
  approveAppointment, rejectAppointment,
} from '../../services/appointmentService'

import { createPass, 
  fetchPasses } from '../../services/passService'
// common components
import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge'
import DateTimeFormat from '../../components/common/DateTimeFormat'

import {
  FaArrowLeft, FaUser, FaCalendarAlt, 
  FaEnvelope, FaPhone,
  FaInfoCircle, FaBuilding, FaPassport, FaCheck,
  FaTimes, FaSpinner
} from 'react-icons/fa'

import toast from 'react-hot-toast'

const AppointmentDetails = () => {
  // Appointent or pass id
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // main states for fetching data
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // approve, reject , or generatePass state
  const [actionLoading, setActionLoading] = useState(null) // 'approve', 'reject', 'generate'

  // states for pass generated or not , if yes then show message for that
  const [passAlreadyGenerated, setPassAlreadyGenerated] = useState(false)
  const [checkingPass, setCheckingPass] = useState(true)

  const loadAppointment = async () => {
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await fetchAppointmentById(id)
      setAppointment(data)
      // console.log(appointment)

      await checkIfPassExists(id) // check the pass
      
    } catch (error) {
      // console.log(error)
      setError('Appointment not found')
      toast.error('Failed to load appointment', error)
    } finally {
      setLoading(false)
    }
  }

  // check is pass is exist or not
  const checkIfPassExists = async (appointmentId) => {
    
    setCheckingPass(true)
    try {
      const response = await fetchPasses()
      
      let passes = []
      // check is data response is in Array format or not
      if (Array.isArray(response)) {
        passes = response
      } else if (response?.data && Array.isArray(response.data)) {
        passes = response.data
      }
      
      const found = passes.some(pass => {
        // return pass.status === "active"
        return pass.appointmentId === appointmentId || 
          pass.appointment?._id === appointmentId ||
          pass.appointment === appointmentId
      })
      
      setPassAlreadyGenerated(found)
      // console.log(passAlreadyGenerated)
      
    } catch (error) {
      // console.log('Failed to check pass status', error)
      toast.error('failed to check pass status')
      setPassAlreadyGenerated(false)

    } finally {
      setCheckingPass(false)
    }
  }

  const handleApprove = async () => {
    setActionLoading('approve')

    try {
      await approveAppointment(id)
      // console.log("appointnent approved")
      toast.success('Appointment approved')
      loadAppointment() 
    } catch (error) {
      // console.log(error)
      toast.error('Failed to approve')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    setActionLoading('reject')
    try {
      await rejectAppointment(id)
      toast.success('Appointment rejected')
      loadAppointment()
    } catch (error) {
      console.log(error)
      toast.error('Failed to reject')
    } finally {
      setActionLoading(null)
    }
  }

  const handleGeneratePass = async () => {
    setActionLoading('generate')
    try {
      await createPass(id)
      toast.success('Pass generated successfully')

      setPassAlreadyGenerated(true)
      navigate('/passes');

    } catch (error) {
      // console.log(error)
      toast.error('Failed to generate pass')
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    loadAppointment()
  }, [id])

  if (loading || checkingPass) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" text="Loading..." />
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="p-6">
        <Card className="text-center py-12">
          <p className="text-red-500 mb-4">{error || 'Appointment not found'}</p>
          <Button onClick={() => navigate('/appointments')}>
            <FaArrowLeft className="mr-2" /> Back
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => navigate('/appointments')}
        >
          <FaArrowLeft className="mr-2" size={14} /> Back to Appointments
        </Button>
        <h1 className="text-2xl font-bold mt-3">Appointment Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Visitor Information</h2>
            
            <div className="flex items-center gap-3 mb-4">
              {appointment.visitor?.photo ? (
                <img 
                  src={appointment.visitor.photo} 
                  alt="Visitor"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {appointment.visitor?.name?.charAt(0) || 'V'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-lg">{appointment.visitor?.name}</p>
                <StatusBadge status={appointment.status} type="appointment" size="sm" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-gray-400" />
                <span>{appointment.visitor?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-gray-400" />
                <span>{appointment.visitor?.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-gray-400" />
                <span>{appointment.visitor?.purpose || 'N/A'}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          
          <Card>
            <h2 className="text-lg font-semibold mb-4">Host Information</h2>
            <div className="flex items-center gap-2 mb-2">
              <FaBuilding className="text-gray-400" />
              <span className="font-medium">{appointment.host?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gray-400" />
              <span>{appointment.host?.email || 'N/A'}</span>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">Schedule</h2>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" />
              <span>
                <DateTimeFormat 
                  date={appointment.date} 
                  type="datetime" 
                  showIcon={false}
                />
              </span>
            </div>
          </Card>

          {(user?.role === 'admin' && 
            (appointment.status === 'pending' || appointment.status === 'approved')) && (
            <Card>
              <h2 className="text-lg font-semibold mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                
                {appointment.status === 'pending' && (
                  <Button
                    variant="success"
                    onClick={handleApprove}
                    disabled={actionLoading !== null}
                  >
                    {actionLoading === 'approve' ? (
                      <><FaSpinner className="animate-spin mr-2" /> Approving...</>
                    ) : (
                      <><FaCheck className="mr-2" /> Approve</>
                    )}
                  </Button>
                )}

                {appointment.status === 'pending' && (
                  <Button
                    variant="danger"
                    onClick={handleReject}
                    disabled={actionLoading !== null}
                  >
                    {actionLoading === 'reject' ? (
                      <><FaSpinner className="animate-spin mr-2" /> Rejecting...</>
                    ) : (
                      <><FaTimes className="mr-2" /> Reject</>
                    )}
                  </Button>
                )}

                {appointment.status === 'approved' && !passAlreadyGenerated && (
                  <Button
                    variant="primary"
                    onClick={handleGeneratePass}
                    disabled={actionLoading !== null}
                  >
                    {actionLoading === 'generate' ? (
                      <><FaSpinner className="animate-spin mr-2" /> Generating...</>
                    ) : (
                      <><FaPassport className="mr-2" /> Generate Pass</>
                    )}
                  </Button>
                )}

                {appointment.status === 'approved' && passAlreadyGenerated && (
                  <div className="p-3 flex items-center gap-1 bg-red-50 text-red-700 rounded-lg">
                    <FaCheck /> Pass already generated for this appointment
                  </div>
                )}

              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}

export default AppointmentDetails