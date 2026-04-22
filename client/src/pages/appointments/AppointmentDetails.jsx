
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// import { useMemo } from 'react'
import {
  fetchAppointmentById,
  approveAppointment,
  rejectAppointment,
} from '../../services/appointmentService'

import { createPass, 
  fetchPasses } from '../../services/passService'
// common component
import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge' 
import DateTimeFormat from '../../components/common/DateTimeFormat' 

import {
  FaArrowLeft, FaUser, FaCalendarAlt, FaEnvelope, FaPhone,
  FaInfoCircle, FaClock, FaBuilding, FaPassport, FaCheck,
    FaTimes, FaSpinner, FaExclamationCircle, FaUserClock,
  FaUserCheck, FaUserTimes,
} from 'react-icons/fa'

import toast from 'react-hot-toast'

const AppointmentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
    const { user } = useAuth()

  
  const [appointment, setAppointment] = useState(null)
  
  // error loader
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Action buttons , loading states
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  
  const [generatingPassId, setGeneratingPassId] = useState(null)
  const [passGenerated, setPassGenerated] = useState(false)
  const [checkingPass, setCheckingPass] = useState(true)

  const checkPassStatus = async (appointmentId) => {
    try {
      setCheckingPass(true)
      const response = await fetchPasses()

      let passesArray = []
      if (Array.isArray(response)) {
        passesArray = response
      } else if (response?.passes && Array.isArray(response.passes)) {
        passesArray = response.passes
      } else if (response?.data && Array.isArray(response.data)) {
        passesArray = response.data
      }

      const hasPass = passesArray.some(
        (pass) =>
          pass.appointmentId === appointmentId ||
          pass.appointment?._id === appointmentId ||
          pass.appointment === appointmentId
      )
      setPassGenerated(hasPass)
    } catch (err) {
      // toast.error("Something went wrong, pass status is not showing...")
      setPassGenerated(false)
    } finally {
      setCheckingPass(false)
    }
  }

  const fetchAppointment = async () => {
    setLoading(true)
    
    try {
      const data = await fetchAppointmentById(id)
      setAppointment(data)
      setError(null) 
      
      await checkPassStatus(id)  // pass is already genrated checking
    } catch (err) {
      setError('Failed to load appointment details')
      toast.error('Failed to load appointment details')
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointment()
  }, [id])

  const handleApprove = async () => {
    setApproving(true)
    
    try {
      await approveAppointment(id)
      toast.success('Appointment approved successfully')
      
      // Refresh the data
      fetchAppointment()
      
    } catch (err) {
      toast.error('Failed to approve appointment')
      
    } finally {
      setApproving(false)
    }
  }

  const handleReject = async () => {
    setRejecting(true)
    
    try {
      await rejectAppointment(id)
      toast.success('Appointment rejected')
  
      // Refresh the data
      fetchAppointment()
      
    } catch (err) {
      // console.log("Pass Not Rejectign , some error ocured...")
      toast.error('Failed to reject appointment')
      
    } finally {
      setRejecting(false)
    }
  }

  const handleGeneratePass = async () => {
    setGeneratingPassId(id)
    
    try {
      await createPass(id)
      toast.success('Pass generated successfully')
      
      // Update states
      setPassGenerated(true)
      
      // Refresh and redirect
      await fetchAppointment()
      navigate('/passes')
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate pass')
      
    } finally {
      setGeneratingPassId(null)
    }
  }
  
  if (loading || checkingPass ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" text="Loading Appointment Details..." />
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="p-6 lg:p-8">
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#fee9e7] flex items-center justify-center">
              <FaInfoCircle className="text-[#ec3c3c]" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-[#0b1e3c]">Appointment Not Found</h2>
            <p className="text-[#5b6f87] max-w-md mb-4">
              {error || 'The requested appointment could not be found.'}
            </p>
            <Button variant="primary" onClick={() => navigate('/appointments')}>
              <FaArrowLeft className="mr-2" size={14} /> Back to Appointments
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/appointments')}
            className="p-2 lg:px-4 lg:py-2"
          >
            <FaArrowLeft size={14} className="lg:mr-2" />
            <span className="lg:inline">Back to Appointments</span>
          </Button>
          <h1 className="text-xl lg:text-3xl font-bold text-[#0b1e3c]">Appointment Details</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3">
          <Card>
            <h3 className="text-lg font-semibold text-[#0b1e3c] mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center">
                <FaUser className="text-[#2463eb]" size={16} />
              </div>
              Visitor Information
            </h3>

            <div className="flex flex-col md:flex-row lg:flex-col items-start justify-between px-4 gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto lg:w-full">
                {appointment.visitor?.photo ? (
                  <img
                    src={appointment.visitor.photo}
                    alt={appointment.visitor.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#2463eb] flex items-center justify-center shadow-md">
                    <span className="text-white text-xl font-bold">
                      {appointment.visitor?.name?.charAt(0) || 'V'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[#0b1e3c]">{appointment.visitor?.name}</p>
                  <p className="text-xs text-[#5b6f87]">ID: {appointment.visitor?._id?.slice(-8)}</p>
                    <div className="mt-1">
                    <StatusBadge status={appointment.status} type="appointment" size="sm" />
                  </div>
                </div>
              </div>

              <div className="space-y-3 w-full md:w-auto lg:w-full">
                {[
                  { icon: FaEnvelope, label: 'Email', value: appointment.visitor?.email },
                  { icon: FaPhone,label: 'Phone', value: appointment.visitor?.phone },
                  { icon: FaInfoCircle, label: 'Purpose', value: appointment.visitor?.purpose },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f5f9ff] flex items-center justify-center">
                      <Icon className="text-[#5b6f87]" size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-[#5b6f87] mb-0.5">{label}</p>
                      <p className="text-sm font-medium text-[#0b1e3c]">{value || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="w-full lg:w-2/3 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-[#0b1e3c] mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#e6f7ee] flex items-center justify-center">
                <FaBuilding className="text-[#22b455]" size={16} />
              </div>
              Host Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: FaUser,label: 'Name',  value: appointment.host?.name,  color: 'text-[#2463eb]' },
                { icon: FaEnvelope,label: 'Email', value: appointment.host?.email, color: 'text-[#5b6f87]' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f5f9ff] flex items-center justify-center">
                    <Icon className={color} size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-[#5b6f87] mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-[#0b1e3c]">{value || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-[#0b1e3c] mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f0e7fe] flex items-center justify-center">
                <FaCalendarAlt className="text-[#6941c6]" size={16} />
              </div>
              Appointment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#5b6f87] mb-1 flex items-center gap-1">
                  <FaCalendarAlt size={10} /> Scheduled Date & Time
                </p>
                <p className="text-base font-semibold text-[#0b1e3c] bg-[#f5f9ff] p-3 rounded-xl border border-[#e2eaf5]">
                  <DateTimeFormat 
                      date={appointment.date} 
                     type="datetime" 
                     format="short" 
                     showIcon={false} 
                     emptyText="N/A"
                   />
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs text-[#5b6f87] mb-1">Last Updated</p>
                  <p className="text-sm text-[#0b1e3c]">
                    <DateTimeFormat 
                        date={appointment.updatedAt} 
                        type="datetime" 
                        format="short" 
                        showIcon={false} 
                        emptyText="N/A"
                      />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#5b6f87] mb-1 flex items-center gap-1">
                    <FaClock size={10} /> Created On
                  </p>
                  <p className="text-sm text-[#0b1e3c]">
                     <DateTimeFormat 
                        date={appointment.createdAt} 
                        type="datetime" 
                        format="short" 
                        showIcon={false} 
                        emptyText="N/A"
                      />
                    </p>
                </div>
              </div>
            </div>
          </Card>

          {((user?.role === 'admin' && appointment.status === 'pending') || appointment.status === 'approved') && (
            <Card>
              <h3 className="text-lg font-semibold text-[#0b1e3c] mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#fef5e6] flex items-center justify-center">
                  <FaClock className="text-[#b45b0a]" size={16} />
                </div>
                Actions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user?.role === 'admin' && appointment.status === 'pending' && (
                  <>
                    <Button variant="success" onClick={handleApprove} disabled={approving} size='lg' className="w-full ">
                      {approving ? (
                        <><FaSpinner className="animate-spin mr-1" size={18} /> Approving...</>
                      ) : (
                        <><FaCheck className="mr-1" size={18} /> Approve Appointment</>
                      )}
                    </Button>

                    <Button variant="danger" onClick={handleReject} disabled={rejecting} size='lg' className="w-full">
                      {rejecting ? (
                        <><FaSpinner className="animate-spin mr-1" size={18} /> Rejecting...</>
                      ) : (
                        <><FaTimes className="mr-1" size={18} /> Reject Appointment</>
                      )}
                    </Button>
                  </>
                )}

                {appointment.status === 'approved' && (
                  passGenerated ? (
                    <div className="col-span-full sm:col-span-1">
                      <div className="w-full py-4 px-4 bg-[#fee9e7] text-[#cc2e2e] rounded-lg border border-[#fccac4] flex items-center justify-center gap-2 text-base font-semibold">
                        <FaExclamationCircle size={18} /> Pass Already Generated
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="success"
                      size='lg'
                      onClick={handleGeneratePass}
                      disabled={generatingPassId === id}
                      className="w-full "
                    >
                      {generatingPassId === id ? (
                        <><FaSpinner className="animate-spin mr-1" size={18} /> Generating...</>
                      ) : (
                        <><FaPassport className="mr-1" size={18} /> Generate Entry Pass</>
                      )}
                    </Button>
                  )
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
