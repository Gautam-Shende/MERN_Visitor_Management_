import { useEffect, useState } from "react"
// import { NavLink } from "react-router-dom"

import { useNavigate, Link } from "react-router-dom"
//
import {
  getAppointments,
  // approveAppointment,
  // rejectAppointment,
} from "../../services/appointmentService"

// import { generatePass, getPassById } from "../../services/passService";

//
import Table from "../../components/common/Table"
import Button from "../../components/common/Button"
import Card from "../../components/common/Card"
import Spinner from "../../components/common/Spinner"

import { useAuth } from "../../context/AuthContext";

import {
  // FaCheck,
  // FaTimes,
  FaEye,
  FaPlus,
  // FaPassport,
  // FaSpinner,
  // FaExclamationCircle,
  FaCalendarAlt,
  FaFilter,
  FaUserClock,
  FaUserCheck,
  FaUserTimes,
  FaSyncAlt,
} from "react-icons/fa"

import toast from "react-hot-toast"

const Appointments = () => {
  // const [appointments, setAppointments] = useState(null)
  const [appointments, setAppointments] = useState([])

  const [loading, setLoading] = useState(true)
  // const [generatingPassId, setGeneratingPassId] = useState(null)
  const [filter, setFilter] = useState("all")

  const { user } = useAuth();
  // const navigate = useNavigate(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
  }, []);

  // const loadAppointments = async () => {
  //   // setLoading(false)
  //   setLoading(true);
  //   try {
  //     const data = await getAppointments()
  //     setAppointments(data)
      
  //     // console.log(Data)
  //   } catch (error) {

  //     // console.log(error.message)
  //     toast.error("Failed to load appointments");
  //   } finally {
  //     // setTimeout(() => {
  //     //   setLoading(false)
  //     // }, 1000)

  //     setLoading(false)
  //   }
  // }

  // const handleApprove = async (id) => {
  //   try {
  //     await approveAppointment(id)
  //     toast.success("Appointment approved successfully")
  //     // console.log(approveAppointment(id))
  //     loadAppointments()
  //   } catch {

  //     // console.log("This Error")
  //     toast.error("Failed to approve appointment");
  //   }
  // }

  // const handleReject = async (id) => {
  //   try {
  //     await rejectAppointment(id);
  //     toast.success("Appointment rejected")
  //     // console.log(rejectAppointment(id))
  //     loadAppointments()
  //   } catch {
  //     // console.log("failed to reject appointment")
  //     toast.error("Failed to reject appointment");
  //   }
  // }

  // const handleGeneratePass = async (appointmentId) => {
  //   // setGeneratingPassId(appointment._id)
  //   setGeneratingPassId(appointmentId);

  //   try {
  //     await generatePass(appointmentId);
  //     toast.success("Pass generated successfully")

  //     // console.log(generatePass(id))
  //     loadAppointments();
  //     navigate("/passes")

  //   } catch (error) {

  //     // console.log(error.message)
  //     toast.error(error.response?.data?.message || "Failed to generate pass");
  //   } finally {

  //     // setGeneratingPassId("");
  //     setGeneratingPassId(null);
  //   }
  // }

  const loadAppointments = async () => {
  setLoading(true);
  try {
    const response = await getAppointments() 
    
    console.log("Appointments data:", response)
    console.log("Is array?", Array.isArray(response))
    
    let appointmentsData = []
    
    if (Array.isArray(response)) {
      appointmentsData = response
    } 
    else if (response && response.appointments && Array.isArray(response.appointments)) {
      appointmentsData = response.appointments
    }

    else if (response && response.data && Array.isArray(response.data)) {
      appointmentsData = response.data
    }
    else {
      console.error("Unexpected response format:", response)
      appointmentsData = []
    }
    
    console.log("Extracted appointments:", appointmentsData)
    setAppointments(appointmentsData) 
    
  } catch (error) {
    // console.error("Error loading appointments:", error)
    toast.error("Failed to load appointments");
    setAppointments([]) 
  } finally {
    setLoading(false)
  }
}

  const formatDate = (date) => {
    // try {
    //   return new Date(date).toLocaleDateString("en-US", {
    //     day: "nummber",
    //     month: "number",
    //     year: "number",
    //     hour: "number, 2-digit",
    //     minute: "number, 2-digit",
    //   })
    try {
      return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Invalid date";
    }
  };

  const getStatusBadge = (status) => {
    const AppointmentsStatus = {
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
    }
    // const PageStatus = AppointmentsStatus[status]
    const PageStatus = AppointmentsStatus[status] || AppointmentsStatus.pending;
    const Icon = PageStatus.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${PageStatus.bg} ${PageStatus.text} ${PageStatus.border}`}
      >
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

 const columns = [
  {
    header: "Visitor",
    accessor: "visitor",
    cell: (appointment) => (   
      <div className="flex items-center gap-3">
        {appointment.visitor?.photo ? (
          <img
            src={appointment.visitor.photo}
            alt={appointment.visitor.name}
            className="w-8 h-8 rounded-lg object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[#1a4fc4] flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {appointment.visitor?.name?.charAt(0) || "V"}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-[#0b1e3c]">
            {appointment.visitor?.name || "N/A"}
          </p>
          <p className="text-xs text-[#5b6f87]">
            {appointment.visitor?.email || "No email"}
          </p>
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    header: "Host",
    accessor: "host",
    cell: (appointment) => (   
      <div>
        <p className="font-medium text-[#0b1e3c]">
          {appointment.host?.name || "N/A"}
        </p>
        <p className="text-xs text-[#5b6f87]">{appointment.host?.email || ""}</p>
      </div>
    ),
  },
  {
    header: "Date & Time",
    accessor: "date",
    cell: (appointment) => (   
      <div className="flex items-center gap-2">
        <FaCalendarAlt className="text-[#8b9eb0]" size={12} />
        <span className="text-sm text-[#1e293b]">{formatDate(appointment.date)}</span>
      </div>
    ),
    sortable: true,
  },
  {
    header: "Status",
    accessor: "status",
    cell: (appointment) => getStatusBadge(appointment.status),  
    sortable: true,
  },
  {
    header: "Actions",
    accessor: "_id",
    cell: (appointment) => {   
      // const isPassGenerated = appointment.passGenerated;
      return (
        <div className="flex flex-wrap gap-2 items-center">
          <Link to={`/appointments/${appointment._id}`}>
            <Button variant="ghost" size="sm" className="p-2">
              <FaEye className="text-[#2463eb]" size={16} />
            </Button>
          </Link>

          {/* {appointment.status === "approved" &&
            (isPassGenerated ? (
              <span className="px-3 py-1.5 text-xs bg-[#fee9e7] text-[#cc2e2e] rounded-lg border border-[#fccac4] flex items-center gap-1">
                <FaExclamationCircle size={12} />
                Pass Generated
              </span>
            ) : (
              <Button
                variant="success"
                size="sm"
                onClick={() => handleGeneratePass(appointment._id)}
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

          {(user?.role === "admin" || user?.role === "employee") &&
            appointment.status === "pending" && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleApprove(appointment._id)}
                  className="p-2"
                  title="Approve"
                >
                  <FaCheck size={14} />
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleReject(appointment._id)}
                  className="p-2"
                  title="Reject"
                >
                  <FaTimes size={14} />
                </Button>
              </>
            )} */}
        </div>
      );
    },
  },
];

  // const filteredAppointments = filter === appointments._id ? appointments
  //     : appointments.filter.((a) => a.status === filter)
  const filteredAppointments = filter === "all" ? appointments
      : appointments.filter((a) => a.status === filter);

  const statusCounts = {
    // all: appointments.filter((a) => a.status === "all"),
    all: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    approved: appointments.filter((a) => a.status === "approved").length,
    rejected: appointments.filter((a) => a.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" text="Loading Appointments....." />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0b1e3c] mb-1">
            Appointments
          </h1>
          <p className="text-sm text-[#5b6f87]">
            Manage and track all visitor appointments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" onClick={loadAppointments}>
            <FaSyncAlt className="mr-2" size={14} /> Refresh
          </Button>
          {(user?.role === "employee") && (
            <Link to="/appointments/new">
              <Button variant="primary" size="md">
                <FaPlus className="mr-2" size={14} /> New Appointment
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "All Appointments",
            value: "all",
            count: statusCounts.all,
            color: "bg-[#f0f2f5] text-[#4a5f73]",
          },
          {
            label: "Pending",
            value: "pending",
            count: statusCounts.pending,
            color: "bg-[#fef5e6] text-[#b45b0a]",
          },
          {
            label: "Approved",
            value: "approved",
            count: statusCounts.approved,
            color: "bg-[#e6f7ee] text-[#0b8a4f]",
          },
          {
            label: "Rejected",
            value: "rejected",
            count: statusCounts.rejected,
            color: "bg-[#fee9e7] text-[#cc2e2e]",
          },
        ].map((status) => (
          <button
            key={status.value}
            onClick={() => setFilter(status.value)}
            className={`
              p-4 rounded-xl border transition-all duration-200 text-left
              ${
                filter === status.value
                  ? "border-[#2463eb] ring-2 ring-[#2463eb] ring-opacity-20"
                  : "border-[#eef2f6] hover:border-[#2463eb] hover:shadow-md"
              }
              ${status.color}
            `}
          >
            <p className="text-xs mb-1">{status.label}</p>
            <p className="text-2xl font-bold">{status.count}</p>
          </button>
        ))}
      </div>

      {filteredAppointments.length > 0 ? (
       <Card className="overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-[#eef2f6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaFilter className="text-[#8b9eb0]" size={14} />
              <span className="text-sm font-medium text-[#0b1e3c]">
                {filter === "all"
                  ? "All Appointments"
                  : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
              </span>
            </div>
            <span className="text-xs text-[#5b6f87]">
              Showing {filteredAppointments.length} of {appointments.length}{" "}
              entries
            </span>
          </div>

          <Table
            columns={columns}
            data={filteredAppointments}
            searchable={true}
            emptyMessage="No appointments found"
          />

        </Card>
      ) : (
        // Card
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#f5f9ff] flex items-center justify-center">
              <FaCalendarAlt className="text-[#8b9eb0]" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-[#0b1e3c]">
              No Appointments Found
            </h3>
            <p className="text-sm text-[#5b6f87] max-w-sm">
              {filter === "all"
                ? "There are no appointments scheduled yet."
                : `No ${filter} appointments found.`}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Appointments;
