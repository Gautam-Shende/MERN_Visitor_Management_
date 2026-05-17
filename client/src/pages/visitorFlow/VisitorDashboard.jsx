
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

// import { fetchVisitorAppointments } from "../../services/visitorAuthService"
import {
  fetchVisitorDashboard,
  requestforAppointment,
} from "../../services/visitorAuthService"

import { useAuth } from "../../context/AuthContext"

import Input from "../../components/common/Input"
import Button from "../../components/common/Button"
import Card from "../../components/common/Card"
import Spinner from "../../components/common/Spinner"

import {
  FaCalendarAlt,
  FaPassport,
  FaUser,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
  FaPlusCircle,
  FaTimes,
  FaHourglassHalf,
  FaTimesCircle,
  FaQrcode,
  FaSignInAlt,
} from "react-icons/fa"

// required for form 
const EMPTY_FORM = {
  preferredDate: "",
  preferredTime: "",
  purpose: "",
  message: "",
}

const RequestAppointmentModal = ({ isOpen, onClose, onSuccess }) => {
  // handling states for form submission
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) =>
    setFormData((prev) => 
      ({ ...prev, [field]: e.target.value }))

  const handleClose = () => {
    setFormData(EMPTY_FORM)
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // date and time for the appointment form
    const dateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`)

    if (dateTime < new Date()) {
      toast.error("Please select a future date and time")
      return
    }

    setLoading(true)

    try {
      // for the visitor appointment request form
      const response = await requestforAppointment({
        preferredDate: dateTime.toISOString(),
        purpose: formData.purpose,
        message: formData.message,
      })

      if (response.success) {
        toast.success("Request sent! Employee will confirm soon.")
        onSuccess()
        handleClose()
      }
    } catch (err) {
      // console.log("This is an error to request for appointment...")
      toast.error("Failed to send request", error)
    } finally {
      // setTimeout(() => {
      //   setLoading(false)
      // }, 1000);
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
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Preferred Date"
            required
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={formData.preferredDate}
            onChange={handleChange("preferredDate")}
          />

          <Input
            label="Preferred Time"
            required
            type="time"
            value={formData.preferredTime}
            onChange={handleChange("preferredTime")}
          />

          <Input
            label="Purpose of Visit"
            required
            type="text"
            placeholder="e.g., Meeting, Interview, Delivery"
            value={formData.purpose}
            onChange={handleChange("purpose")}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Message (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Any message for the employee..."
              value={formData.message}
              onChange={handleChange("message")}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              className="w-full"
              size="md"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full"
              variant="primary"
              size="md"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>

      </div>
    </div>
  )
}

const StatItem = ({ icon: Icon, label, value, color }) => (
  <div className={`flex items-center shadow-sm p-1 rounded-lg gap-2 font-semibold ${color}`}>
    <Icon size={12} />
    <span>{label}: {value ?? 0}</span>
  </div>
)


const VisitorDashboard = () => {
  const { user } = useAuth()

  const [stats, setStats] = useState(null)
  // const [appointment, setAppointment] = usestate([]);
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchData = async () => {
    setLoading(true)
     try {
      // response fethced from backend
      const response = await fetchVisitorDashboard()
      const statsData = response?.stats ?? response?.data ?? response
      
      setStats(statsData)
      // console.log("This is Visitor Stats Data",statsData)
    } catch {
      // console.log("failed to load dashboard", error)
      toast.error("Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" text="Loading your dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                Welcome, <span className="text-blue-600">{user?.name?.split(" ")[0] || "Visitor"}!</span>
              </h1>
              <p className="text-gray-500 mt-1">Manage your appointments and passes</p>
            </div>
          </div>

          {/* <Button onClick={ useNavigate("/requeste/appointments")}>
            <FaPlusCircle size={18} />
            Request Appointment
          </Button> */}
          <Button onClick={() => setShowModal(true)} variant="primary" size="lg">
            <FaPlusCircle size={18} />
            Request Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">

          <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-blue-50 border-0">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <FaCalendarAlt size={28} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-gray-800">{stats?.totalAppointments ?? 0}</p>
                <p className="text-sm text-gray-500">Total Appointments</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <StatItem icon={FaHourglassHalf} label="Requested"value={stats?.requested} color="text-amber-800" />
              <StatItem icon={FaClock} label="Pending" value={stats?.pending} color="text-yellow-600" />
              <StatItem icon={FaTimesCircle} label="Rejected" value={stats?.rejected}  color="text-red-600" />
              <StatItem icon={FaCheckCircle} label="Approved" value={stats?.approved} color="text-emerald-600" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-purple-50 border-0">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg">
                <FaPassport size={28} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-gray-800">{stats?.passGenerated ?? 0}</p>
                <p className="text-sm text-gray-500">Passes Generated</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <StatItem icon={FaQrcode} label="Total" value={stats?.totalPasses} color="text-yellow-600" />
              <StatItem icon={FaCheckCircle} label="Active" value={stats?.activePasses} color="text-emerald-600" />
              <StatItem icon={FaTimes} label="Expired" value={stats?.expiredPasses} color="text-red-600" />
              <StatItem icon={FaSignInAlt} label="Inside" value={stats?.insidePasses} color="text-blue-800" />
            </div>
          </Card>

          <Link to="/visitor/appointments">
            <Button variant="primary" className="w-full">
              <FaCalendarAlt size={18} />
              View My Appointments
              <FaArrowRight size={14} />
            </Button>
          </Link>

          <Link to="/visitor/passes">
            <Button className="bg-purple-600 w-full">
              <FaPassport size={18} />
              View My Passes
              <FaArrowRight size={14} />
            </Button>
          </Link>

        </div>

        <div className="p-4 bg-yellow-100 rounded-xl border border-yellow-200">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <FaClock size={14} />
            <strong>Note:</strong> After submitting a request, the employee will confirm your appointment date and time.
          </p>
        </div>

      </div>

      <RequestAppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchData}
      />
    </div>
  )
}

export default VisitorDashboard
