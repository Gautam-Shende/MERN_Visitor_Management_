
import { useEffect, useState } from "react"

import {
  fetchVisitorDashboard,
  requestforAppointment,
} from "../../services/visitorAuthService"

// import {useAuth} from "../../context/AuthContext.jsx"
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
} from "react-icons/fa";

import { Link } from "react-router-dom"
import toast from "react-hot-toast"

import { useAuth } from "../../context/AuthContext"

const RequestAppointmentModal = ({ isOpen, onClose, onSuccess }) => {
 
  const [formData, setFormData] = useState({
    preferredDate: "",
    preferredTime: "",
    purpose: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dateTime = new Date(
      `${formData.preferredDate}T${formData.preferredTime}`,
    );

    if (dateTime < new Date()) {
      // console.log("Please select a future date and time");
      toast.error("Please select a future date and time");
      setLoading(false);
      return;
    }

    try {
      const response = await requestforAppointment({
        preferredDate: dateTime.toISOString(),
        purpose: formData.purpose,
        message: formData.message,
      });

      if (response.success) {
        toast.success(
          "Appointment request sent successfully! Employee will confirm soon.",
        );
        onSuccess();
        onClose();
        setFormData({
          preferredDate: "",
          preferredTime: "",
          purpose: "",
          message: "",
        });
      }
    } catch (err) {
      // console.log("Appointment Request get Failed....")
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              Request Appointment
            </h2>
            <p className="text-blue-100 text-sm">
              Submit your request to employee
            </p>
          </div>
          <button
            onClick={onClose}
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
            onChange={(e) =>
              setFormData({ ...formData, preferredDate: e.target.value })
            }
            className="rounded-xl"
          />

          <Input
            label="Preferred Time"
            required
            type="time"
            value={formData.preferredTime}
            onChange={(e) =>
              setFormData({ ...formData, preferredTime: e.target.value })
            }
            className="rounded-xl"
          />

          <Input
            label="Purpose of Visit"
            required
            type="text"
            placeholder="e.g., Meeting, Interview, Delivery"
            value={formData.purpose}
            onChange={(e) =>
              setFormData({ ...formData, purpose: e.target.value })
            }
            className="rounded-xl"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Message (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Message for Appointment . . . ."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 ">
            <Button className="w-full" size="md" variant="secondary">
              Cancle
            </Button>

            <Button className="w-full" variant="primary" size="md">
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const VisitorDashboard = () => {
  const [stats, setStats] = useState(null);
  // const [letUsers, setLetUsers] = useState("visitor")

  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchVisitorDashboard();

      let statsData = response;
      if (response?.stats) {
        statsData = response.stats;
      } else if (response?.data) {
        statsData = response.data;
      }

      setStats(statsData);
    } catch (err) {
      // console.log("This is Visitor Dashboard error....")
      toast.error("Failed to load dashboard");
    } finally {
      // setTimeout(() => {
      //   setLoading(false)
      // }, 1000)
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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                Welcome,{" "}
                <span className="text-blue-600">
                  {user?.name?.split(" ")[0] || "Visitor"}!
                </span>
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your appointments and passes
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowRequestModal(true)}
            variant="primary"
            size="lg"
          >
            <FaPlusCircle size={18} />
            Request Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {/* <div className="flex flex-col sm:flex-row gap-4"> */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-blue-50 border-0">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <FaCalendarAlt size={28} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-gray-800">
                  {stats?.totalAppointments || 0}
                </p>
                <p className="text-sm text-gray-500">Total Appointments</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center shadow-sm p-1 rounded-lg gap-2 font-semibold text-amber-800">
                <FaHourglassHalf size={12} />
                <span>Requested: {stats?.requested || 0}</span>
              </div>
              <div className="flex items-center shadow-sm p-1 rounded-lg gap-2 font-semibold text-yellow-600">
                <FaClock size={12} />
                <span>Pending: {stats?.pending || 0}</span>
              </div>
              <div className="flex items-center shadow-sm p-1 rounded-lg gap-2 font-semibold text-red-600">
                <FaTimesCircle size={12} />
                <span>Rejected: {stats?.rejected || 0}</span>
              </div>
              <div className="flex items-center shadow-sm p-1 rounded-lg gap-2 font-semibold text-emerald-600">
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
                <p className="text-4xl font-bold text-gray-800">
                  {stats?.passGenerated || 0}
                </p>
                <p className="text-sm text-gray-500">Passes Generated</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center shadow-sm p-1 rounded-lg gap-2 font-semibold text-yellow-600">
                <FaQrcode size={12} />
                <span>Total: {stats?.totalPasses || 0}</span>
              </div>
              <div className="flex items-center shadow-sm p-1 rounded-lg gap-2 font-semibold text-emerald-600">
                <FaCheckCircle size={12} />
                <span>Active: {stats?.activePasses || 0}</span>
              </div>
              <div className="flex items-center shadow-sm p-1 rounded-lg gap-2 font-semibold text-red-600">
                <FaClock size={12} />
                <span>Expired: {stats?.expiredPasses || 0}</span>
              </div>
              <div className="flex items-center shadow-sm p-1 rounded-lg gap-2 font-semibold text-blue-800">
                <FaPassport size={12} />
                <span>Inside: {stats?.insidePasses || 0}</span>
              </div>
      
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

        <div className="mt-8 p-4 bg-yellow-100 rounded-xl border border-yellow-200">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <FaClock size={14} />
            <strong>Note:</strong> After submitting request, employee will
            confirm your appointment date & time.
          </p>
        </div>
      </div>

      <RequestAppointmentModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={() => {
          fetchData();
        }}
      />
    </div>
  );
};

export default VisitorDashboard;
