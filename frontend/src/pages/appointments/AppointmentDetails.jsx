import { useEffect, useState } from "react";

// import { FaVaadin } from "react-icons/fa"
// import { NavLink } from "react-router-dom"
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getAppointmentById,
  approveAppointment,
  rejectAppointment,
} from "../../services/appointmentService";

// import { generatePassById } from "../../services/passService"; // Import getPasses
import { generatePass, getPasses } from "../../services/passService"; // Import getPasses
// import { useAuth } from "../../context/AuthContext"

import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";

import {
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaInfoCircle,
  FaClock,
  FaBuilding,
  FaPassport,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaExclamationCircle,
  FaUserClock,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";

import toast from "react-hot-toast";

const formatDate = (date) => {
  // try {
  //   return new Date(date).toLocaleDateString("en-US", {
  //     day: "number",
  //     month: "number",
  //     year: "number",
  //     hour: "number, 2-digit",
  //     minute: "number,2-digit",
  //   })
  try {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid date";
  }
};

const AppointmentDetails = () => {
  // const { id } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  // const [appointment, setAppointment] = useState([""])
  // const [loading, setLoading] = useState([""])
  // const [error, setError] = useState([""])
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [generatingPassId, setGeneratingPassId] = useState(null);
  const [passGenerated, setPassGenerated] = useState(false);
  const [checkingPass, setCheckingPass] = useState(true);

  const checkPassStatus = async (appointmentId) => {
    try {
      setCheckingPass(true);
      const response = await getPasses(); // ✅ Response variable

      console.log("Raw passes response:", response); // Debug ke liye

      // 🔥 Safe data extraction - passes array extract karo
      let passesArray = [];
      if (Array.isArray(response)) {
        passesArray = response;
      } else if (response?.passes && Array.isArray(response.passes)) {
        passesArray = response.passes;
      } else if (response?.data && Array.isArray(response.data)) {
        passesArray = response.data;
      } else {
        console.warn("Unexpected passes response format:", response);
        passesArray = [];
      }

      console.log("Extracted passes array:", passesArray); // Debug

      // ✅ Ab safe tarike se .some() use karo
      const hasPass = passesArray.some(
        (pass) =>
          pass.appointmentId === appointmentId ||
          pass.appointment?._id === appointmentId ||
          pass.appointment === appointmentId,
      );

      console.log("Pass exists:", hasPass); // Debug
      setPassGenerated(hasPass);
    } catch (error) {
      console.error("Error checking pass:", error);
      setPassGenerated(false);
    } finally {
      setCheckingPass(false);
    }
  };

  // Fetch appointment and check pass status
  const fetchAppointment = async () => {
    // setLoading(false)
    setLoading(true);
    try {
      // First get appointment details
      const data = await getAppointmentById(id);
      setAppointment(data);
      // console.log(data)
      setError(null);

      await checkPassStatus(id);
    } catch (err) {
      // console.log(err)
      setError("Failed to load appointment details");
      // toast.error(err.message)
      toast.error("Failed to load appointment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const handleApprove = async () => {
    setApproving(true);
    try {
      await approveAppointment(id);
      // console.log(approveAppointment(id))
      toast.success("Appointment approved successfully");
      fetchAppointment();
    } catch {
      // console.log("Failed to approve appointment")
      toast.error("Failed to approve appointment");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    try {
      await rejectAppointment(id);
      // console.log(rejectAppointment(id))
      toast.success("Appointment rejected");
      fetchAppointment();
    } catch {
      // console.log("failed to reject appointment")
      toast.error("Failed to reject appointment");
    } finally {
      setRejecting(true);
    }
  };

  const handleGeneratePass = async () => {
    // setGeneratingPassId(appointment._id);
    setGeneratingPassId(id);

    try {
      await generatePass(id);
      toast.success("Pass generated successfully");

      // setPassGenerated(false)
      setPassGenerated(true);
      await fetchAppointment();
      navigate("/passes");
    } catch (error) {
      // console.log(err.message)
      toast.error(error.response?.data?.message || "Failed to generate pass");
    } finally {
      // setTimeout(() => {
      //   setGeneratingPassId(null)
      // }, 1000)

      setGeneratingPassId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        bg: "bg-[#e6f7ee]",
        text: "text-[#0b8a4f]",
        border: "border-[#b0e3cd]",
        icon: FaUserCheck,
      },
      pending: {
        bg: "bg-[#fef5e6]",
        text: "text-[#b45b0a]",
        border: "border-[#fed7a5]",
        icon: FaUserClock,
      },
      rejected: {
        bg: "bg-[#fee9e7]",
        text: "text-[#cc2e2e]",
        border: "border-[#fccac4]",
        icon: FaUserTimes,
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading || checkingPass) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" text="Loading Appointment Detailes....." />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="p-6 lg:p-8">
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#fee9e7] flex items-center justify-center">
              <FaInfoCircle className="text-[#ec3c3c]" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-[#0b1e3c]">
              Appointment Not Found
            </h2>
            {/* <p className=" mb-4">
              {"The requested appointment could not be found."}
            </p> */}
            <p className="text-[#5b6f87] max-w-md mb-4">
              {error || "The requested appointment could not be found."}
            </p>
            <Button variant="primary" onClick={() => navigate("/appointments")}>
              <FaArrowLeft className="mr-2" size={14} /> Back to Appointments
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/appointments")}
            className="p-2 lg:px-4 lg:py-2"
          >
            <FaArrowLeft size={14} className="lg:mr-2" />
            <span className="hidden lg:inline">Back</span>
          </Button>
          <h1 className="text-xl lg:text-3xl font-bold text-[#0b1e3c]">
            Appointment Details
          </h1>
        </div>

        {/* 
        <div className="text-xs text-gray-500 mr-4">
          Pass: {passGenerated ? "Generated" : "Not Generated"}
        </div> */}

        <div className="flex items-center gap-2">
          {user?.role === "admin" && appointment.status === "pending" && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={handleApprove}
                className="p-2"
              >
                {/* <FaCheck size={14} /> Approve */}
                {approving ? (
                  <>
                    <FaSpinner className="animate-spin mr-1" size={12} />
                    Approving...
                  </>
                ) : (
                  <>
                    <FaCheck size={14} /> Approve
                  </>
                )}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleReject}
                className="p-2"
              >
                {/* <FaTimes size={14} /> Reject */}
                {rejecting ? (
                  <>
                    <FaSpinner className="animate-spin mr-1" size={12} />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <FaTimes size={14} /> Reject
                  </>
                )}
              </Button>
            </>
          )}

          {appointment.status === "approved" &&
            (passGenerated ? (
              <span className="px-3 py-1.5 text-xs bg-[#fee9e7] text-[#cc2e2e] rounded-lg border border-[#fccac4] flex items-center gap-1">
                <FaExclamationCircle size={12} />
                Pass Generated
              </span>
            ) : (
              <Button
                variant="success"
                size="sm"
                onClick={handleGeneratePass}
                disabled={generatingPassId === appointment._id}
                className="whitespace-nowrap"
              >
                {generatingPassId === appointment._id ? (
                  <>
                    <FaSpinner className="animate-spin mr-1" size={12} />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaPassport className="mr-1" size={12} />
                    Generate Pass
                  </>
                )}
              </Button>
            ))}
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
                {/* {appointment.visitor?.photo ? (
                  <img
                    src={appointment.visitor.photo}
                    alt={appointment.visitor.name}
                    className="w-16 h-16 "
                  /> */}
                {appointment.visitor?.photo ? (
                  <img
                    src={appointment.visitor.photo}
                    alt={appointment.visitor.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#2463eb] flex items-center justify-center shadow-md">
                    <span className="text-white text-xl font-bold">
                      {appointment.visitor?.name?.charAt(0) || "V"}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[#0b1e3c]">
                    {appointment.visitor?.name}
                  </p>
                  <p className="text-xs text-[#5b6f87]">
                    ID: {appointment.visitor?._id?.slice(-8)}
                  </p>
                  {/* <div className="mt-1 realative top-0">
                    {getStatusBadge(appointment.status)}
                  </div> */}
                  <div className="mt-1">
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>
              </div>

              <div className="space-y-3 w-full md:w-auto lg:w-full">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f5f9ff] flex items-center justify-center">
                    <FaEnvelope className="text-[#5b6f87]" size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-[#5b6f87] mb-0.5">Email</p>
                    <p className="text-sm font-medium text-[#0b1e3c]">
                      {appointment.visitor?.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f5f9ff] flex items-center justify-center ">
                    <FaPhone className="text-[#5b6f87]" size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-[#5b6f87] mb-0.5">Phone</p>
                    <p className="text-sm font-medium text-[#0b1e3c]">
                      {appointment.visitor?.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f5f9ff] flex items-center justify-center ">
                    <FaInfoCircle className="text-[#5b6f87]" size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-[#5b6f87] mb-0.5">Purpose</p>
                    <p className="text-sm font-medium text-[#0b1e3c]">
                      {appointment.visitor?.purpose || "N/A"}
                    </p>
                  </div>
                </div>
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
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f5f9ff] flex items-center justify-center ">
                  <FaUser className="text-[#2463eb]" size={16} />
                </div>
                <div>
                  <p className="text-xs text-[#5b6f87] mb-0.5">Name</p>
                  <p className="text-sm font-medium text-[#0b1e3c]">
                    {appointment.host?.name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f5f9ff] flex items-center justify-center ">
                  <FaEnvelope className="text-[#5b6f87]" size={16} />
                </div>
                <div>
                  <p className="text-xs text-[#5b6f87] mb-0.5">Email</p>
                  <p className="text-sm font-medium text-[#0b1e3c]">
                    {appointment.host?.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* {appointment.host?.department && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f5f9ff] flex items-center justify-center flex-shrink-0">
                    <FaBuilding className="text-[#5b6f87]" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-[#5b6f87] mb-0.5">Department</p>
                    <p className="text-sm font-medium text-[#0b1e3c]">
                      {appointment.host.department}
                    </p>
                  </div>
                </div>
              )} */}
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
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#5b6f87] mb-1 flex items-center gap-1">
                    <FaCalendarAlt size={10} /> Scheduled Date & Time
                  </p>
                  <p className="text-base font-semibold text-[#0b1e3c] bg-[#f5f9ff] p-3 rounded-xl border border-[#e2eaf5]">
                    {formatDate(appointment.date)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs text-[#5b6f87] mb-1">Last Updated</p>
                  <p className="text-sm text-[#0b1e3c]">
                    {formatDate(appointment.updatedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#5b6f87] mb-1 flex items-center gap-1">
                    <FaClock size={10} /> Created On
                  </p>
                  <p className="text-sm text-[#0b1e3c]">
                    {formatDate(appointment.createdAt)}
                  </p>
                </div>

                {/* {appointment.notes && (
                  <div>
                    <p className="text-xs text-[#5b6f87] mb-1">
                      Additional Notes
                    </p>
                    <p className="text-sm text-[#0b1e3c] bg-[#f5f9ff] p-3 rounded-xl border border-[#e2eaf5]">
                      {appointment.notes}
                    </p>
                  </div>
                )} */}
              </div>
            </div>

            {/* Timeline */}
            {/* <div className="mt-6 pt-6 border-t border-[#eef2f6]">
              <h4 className="text-sm font-semibold text-[#0b1e3c] mb-4">
                Timeline
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#22b455]"></div>
                  <p className="text-xs text-[#5b6f87]">
                    Appointment created on {formatDate(appointment.createdAt)}
                  </p>
                </div>
                {appointment.status !== "pending" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#2463eb]"></div>
                    <p className="text-xs text-[#5b6f87]">
                      Status changed to {appointment.status} on{" "}
                      {formatDate(appointment.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div> */}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
