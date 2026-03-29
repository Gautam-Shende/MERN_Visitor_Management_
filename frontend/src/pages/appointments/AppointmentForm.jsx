

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import { getAppointmentById } from '../../services/appointmentService'
import { createAppointment } from '../../services/appointmentService'
import { getVisitors } from '../../services/visitorService'
//
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'

import { FaCalendarAlt, 
  FaUser, FaArrowLeft, FaUserPlus,
   FaInfoCircle } from 'react-icons/fa'

import toast from 'react-hot-toast'

const AppointmentForm = () => {

  // const [form, setForm] = useState([])
  const [form, setForm] = useState({ 
    visitorId: '', 
    date: '',
  })
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(false)
  // const [submitting, setSubmitting] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    // console.log("loading visitors")
    loadVisitors()
  }, [])

  const loadVisitors = async () => {
    // console.log("loadVisitors function called")
    setLoading(true)
    try {
      const data = await getVisitors()
      // console.log("Visitors loaded successfully:", data.length)
      // console.log("Visitor data:", data)

      setVisitors(data);
    } catch (error) {
      // console.error("Error loading visitors:", error)
      // console.error("Error message:", error.message)
      toast.error('Failed to load visitors')
    } finally {
      setLoading(false);
      // console.log("Loading state set to false")
    }
  }

  const handleChange = (e) => {
    // console.log("Form field changed:", e.target.name, "=", e.target.value)
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log("Form submission started")
    
    if (!form.visitorId) {
      // console.warn("Validation failed: No visitor selected")
      toast.error('Please select a visitor')
      return
    }
    
    if (!form.date) {
      // console.warn("Validation failed: No date selected")
      toast.error('Please select appointment date and time')
      return
    }

    // console.log("Form validation passed")
    // console.log("Submitting appointment data:", form)
    
    setSubmitting(true)
    try {
      await createAppointment({ 
        visitorId: form.visitorId, 
        date: form.date 
      })
      // console.log("Appointment created successfully")
      toast.success('Appointment created successfully')
      navigate('/appointments');
    } catch (error) {
      // console.error("Error creating appointment:", error)
      // console.error("Error response:", error.response?.data)
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to create appointment')
    } finally {
      setSubmitting(false)
      // console.log("Submitting state reset")
    }
  }

  if (loading) {
    // console.log("Rendering loading state")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" text="Loading Appointment Form...." />
      </div>
    )
  }


  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="secondary" size="sm" onClick={() => navigate('/appointments')}>
          <FaArrowLeft size={14} className="mr-2" /> Back
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0b1e3c]">Schedule New Appointment</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#0b1e3c] mb-1.5">
              Select Visitor <span className="text-[#ec3c3c]">*</span>
            </label>
            <div className="relative">
              <select
                name="visitorId"
                value={form.visitorId}
                onChange={handleChange}
                required
                className="w-full rounded-xl text-sm bg-[#f5f9ff] border border-[#e2eaf5] pl-10 pr-4 py-3 text-[#1e293b] focus:border-[#2463eb] focus:outline-none focus:ring-1 focus:ring-[#2463eb] focus:ring-opacity-20 transition-all duration-200 appearance-none"
              >
                <option value="" className="text-[#8b9eb0]">Choose a visitor...</option>
                {visitors.map((visitor) => (
                  <option key={visitor._id} value={visitor._id} className="text-[#1e293b]">
                    {visitor.name} ({visitor.email}) - {visitor.purpose || 'No purpose'}
                  </option>
                ))}
              </select>
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b9eb0]" size={14} />
            </div>
            
            {visitors.length === 0 && (
              <div className="mt-3 p-4 bg-[#fef5e6] rounded-xl border border-[#fed7a5]">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="text-[#b45b0a] mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-[#b45b0a]">No visitors found</p>
                    <p className="text-xs text-[#b45b0a] mt-1">
                      Please create a visitor first before scheduling an appointment.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate('/visitors/new')}
                    >
                      <FaUserPlus className="mr-2" /> Add New Visitor
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Input
            type="datetime-local"
            name="date"
            label="Appointment Date & Time"
            value={form.date}
            onChange={handleChange}
            icon={<FaCalendarAlt size={14} />}
            required
            // min={new Date().toISOString()}
            min={new Date().toISOString().slice(0, 16)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[#eef2f6]">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/appointments')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              // disabled={submitting}
              disabled={submitting || visitors.length === 0}
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" color="light" />
                  <span>Creating...</span>
                </div>
              ) : (
                'Schedule Appointment'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AppointmentForm;