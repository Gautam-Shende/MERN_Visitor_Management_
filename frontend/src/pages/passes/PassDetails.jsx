import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import { getPassById, getCheckLogsByPassId } from '../../services/passService'
// import { NavLink } from 'react-router-dom'

import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'

import { 
  FaArrowLeft, 
  FaDownload, 
  FaQrcode, 
  FaExternalLinkAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaClock,
  FaUser,
  FaPassport,
  FaCalendarAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa'

import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const PassDetails = () => {
  const { id } = useParams()

  const [pass, setPass] = useState(null)
  // const [checkLogs, setCheckLogs] = useState([null])
  const [checkLogs, setCheckLogs] = useState([])

  const [loading, setLoading] = useState(true);
  // const [logsLoading, setLogsLoading] = useState(false)
  const [logsLoading, setLogsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPass();
    fetchCheckLogs();
  }, [id])

  const fetchPass = async () => {
    try {
      setError(null)
      // console.log(error)
    
      const data = await getPassById(id);
      setPass(data)

      // console.log(data)
    } catch (err) {
      // console.log(err)
      setError(err.response?.data?.message || 'Failed to load pass details');
      toast.error(error);
    } finally {

      // setTimeout(() => {
      //   setLoading(false)
      // }, 1000)
      setLoading(false)
    }
  };

  const fetchCheckLogs = async () => {
    try {
      // setLogsLoading(false)
      setLogsLoading(true)

      const data = await getCheckLogsByPassId(id)

      // setCheckLogs(Array.isArray(data))
      setCheckLogs(Array.isArray(data) ? data : [])

    } catch (err) {
      // console.error('Check logs fetch error:', err);
      setCheckLogs([])

    } finally {
      // setTimeout(() => {
      //   setLoading(false)
      // }, 1000)
      setLogsLoading(false)
    }
  }

  const handleDownload = async (pdfUrl, fileName) => {
    const toastId = toast.loading("Downloading...");
    try {

      // const response = await PassPdf(pdfUrl)
      const response = await fetch(pdfUrl)

      if (!response.ok) throw new Error("Network response failed");
      const blob = await response.blob()
      //
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a")
      // link.href = blobUrl;
      // link.download = fileName.endsWith(".pdf");
      link.href = blobUrl;
      link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
      document.body.appendChild(link)
      link.click();
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)

      // console.log({id: toastId})
      toast.success("Downloaded successfully!", { id: toastId });
    } catch (error) {
      // console.error("Download error:", error)

      // toast.error({ id: toastId });
      toast.error("Opening in new tab...", { id: toastId });
      window.open(pdfUrl, "_blank")
    }
  };

  const latestLog = checkLogs.length > 0 ? checkLogs[0] : null;

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return null;
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    // 
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000)
    //
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-[#e6f7ee]', text: 'text-[#0b8a4f]', border: 'border-[#b0e3cd]', icon: FaCheckCircle },
      inside: { bg: 'bg-[#e8f0fe]', text: 'text-[#2463eb]', border: 'border-[#b8d1fc]', icon: FaSignInAlt },
      expired: { bg: 'bg-[#f0f2f5]', text: 'text-[#4a5f73]', border: 'border-[#d0d9e6]', icon: FaTimesCircle },
    };
    const config = statusConfig[status] || statusConfig.expired;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  
  if (loading) {
    return (
       <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" text="Loading passes..." />
      </div>
    );
  }

  if (error || !pass) {
    return (
      <div className="p-8">
        <Card className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#fee9e7] flex items-center justify-center">
              <FaInfoCircle className="text-[#ec3c3c]" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-[#0b1e3c]">Pass Not Found</h2>
            <p className="text-[#5b6f87] mb-4">{error || 'The requested pass could not be found.'}</p>
            <Link to="/passes">
              <Button variant="primary">
                <FaArrowLeft className="mr-2" /> Back to Passes
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">

      {/* <div className="grid grid-cols-2 lg:grid-template-col-4 justify-between gap-4 mb-6"> */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link to="/passes">
            <Button variant="secondary" size="sm">
              <FaArrowLeft size={14} className="mr-2" /><span className=''>Back to Passes</span>
            </Button>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0b1e3c]">Pass Details</h1>
          {getStatusBadge(pass.status)}
        </div>
      </div>

<Card className="p-6 shadow-lg rounded-2xl border border-gray-100 bg-white">

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <FaUser className="mr-2 text-blue-600" size={18} />
        Visitor
      </h2>
      <div className="space-y-2 text-sm">
        <p><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-800">{pass.visitor?.name || 'N/A'}</span></p>
        <p><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-800 break-all">{pass.visitor?.email || 'N/A'}</span></p>
        <p><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-800">{pass.visitor?.phone || 'N/A'}</span></p>
      </div>
    </div>

    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <FaCalendarAlt className="mr-2 text-purple-600" size={16} />
        Appointment
      </h2>
      <div className="space-y-2 text-sm">
        <p><span className="text-gray-500">Date:</span> <span className="font-medium text-gray-800">{pass.appointment?.date ? formatDate(pass.appointment.date) : 'N/A'}</span></p>
        <p><span className="text-gray-500">Host:</span> <span className="font-medium text-gray-800">{pass.appointment?.host?.name || 'N/A'}</span></p>
        <p><span className="text-gray-500">Host Email:</span> <span className="font-medium text-gray-800 break-all">{pass.appointment?.host?.email || 'N/A'}</span></p>
      </div>
    </div>

    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <FaPassport className="mr-2 text-green-600" size={16} />
        Pass Details
      </h2>
      <div className="space-y-2 text-sm">
        <p>
          <span className="text-gray-500">Status:</span>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
            pass.status === 'active' ? 'bg-green-100 text-green-800' :
            pass.status === 'inside' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {pass.status?.toUpperCase()}
          </span>
        </p>
        <p><span className="text-gray-500">Generated:</span> <span className="font-medium text-gray-800">{formatDate(pass.createdAt)}</span></p>
        <p><span className="text-gray-500">Pass ID:</span> <span className="font-mono text-xs text-gray-700 break-all bg-gray-100 p-1 rounded">{pass._id}</span></p>
      </div>
    </div>

    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <FaQrcode className="mr-2 text-indigo-600" size={18} />
        QR Code
      </h2>
      {pass.qrCode ? (
        <div className="space-y-2">
          <div className="flex justify-center">
            <a href={pass.qrCode} target="_blank" rel="noopener noreferrer">
              <img 
                src={pass.qrCode} 
                alt="QR Code" 
                className="w-32 h-32 border-2 border-white shadow-md rounded-lg hover:scale-105 transition-transform"
              />
            </a>
          </div>
          <a 
            href={pass.qrCode} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline block text-center"
          >
            View Full Size
          </a>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No QR code available</p>
      )}
    </div>
  </div>

  {!logsLoading && (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaClock className="mr-2 text-gray-600" size={20} />
        Check-in / Check-out History
      </h2>

      {latestLog ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Check-in */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center text-blue-700 mb-2">
              <FaSignInAlt className="mr-2" size={16} />
              <span className="font-semibold">Check-in</span>
            </div>
            <p className="text-base text-gray-800">
              {latestLog.checkInTime ? formatDate(latestLog.checkInTime) : 'Not checked in'}
            </p>
          </div>

          {/* Check-out */}
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center text-orange-700 mb-2">
              <FaSignOutAlt className="mr-2" size={16} />
              <span className="font-semibold">Check-out</span>
            </div>
            <p className="text-base text-gray-800">
              {latestLog.checkOutTime ? formatDate(latestLog.checkOutTime) : 'Not checked out'}
            </p>
          </div>

          {/* Duration (if both exist) */}
          {latestLog.checkInTime && latestLog.checkOutTime && (
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center text-green-700 mb-2">
                <FaClock className="mr-2" size={16} />
                <span className="font-semibold">Duration</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">
                {calculateDuration(latestLog.checkInTime, latestLog.checkOutTime)}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
          No check-in/out records found for this pass.
        </p>
      )}

      {/* Multiple visits count */}
      {checkLogs.length > 1 && (
        <p className="text-sm text-gray-500 mt-3 flex items-center">
          <FaInfoCircle className="mr-1" size={12} />
          Total {checkLogs.length} visits. Showing the latest one.
        </p>
      )}
    </div>
  )}

  {pass.pdfPath && (
    <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
      <Button
        variant="primary"
        onClick={() => handleDownload(pass.pdfPath, `pass-${pass._id}`)}
        className="flex-1"
      >
        <FaDownload className="mr-2" size={16} /> Download PDF
      </Button>
      <Button
        variant="secondary"
        onClick={() => window.open(pass.pdfPath, '_blank')}
        className="flex-1"
      >
        <FaExternalLinkAlt className="mr-2" size={16} /> Open in Browser
      </Button>
    </div>
  )}
</Card>

    </div>
  )
}

export default PassDetails;