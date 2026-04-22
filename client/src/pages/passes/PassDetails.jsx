
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import { fetchPassById, fetchCheckLogsByPassId } from '../../services/passService'

import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge'
import DateTimeFormat from '../../components/common/DateTimeFormat'

import {
  FaArrowLeft, FaDownload, FaQrcode, FaExternalLinkAlt,
  FaSignInAlt, FaSignOutAlt, FaClock, FaUser, FaPassport,
  FaCalendarAlt, FaInfoCircle, FaCheckCircle, FaTimesCircle,
} from 'react-icons/fa'

import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const PassDetails = () => {
  // const { id } = useAuth()
  const { id } = useParams()
  const [pass, setPass] = useState(null)
  //checklogs
  const [checkLogs, setCheckLogs] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [logsLoading, setLogsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPass()
    fetchCheckLogs()
  }, [id])

  const fetchPass = async () => {
    try {
      setError(null)
      const data = await fetchPassById(id);
      // console.log(data)
      setPass(data)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load pass details'
      // console.log(msg)
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const fetchCheckLogs = async () => {
    try {
      setLogsLoading(true)

      // const data = await fetchPassbyID(id)
      const data = await fetchCheckLogsByPassId(id)
      // console.log(data)
      // setCheckLogs(Array.isArray(data) ? data : []);
      setCheckLogs(data);
    } catch {
      setCheckLogs([])
    } finally {
      setLogsLoading(false)
    }
  }

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) {
      // console.log("Check IN, Check Out not Found")
      return null
    }
    const diffMs = new Date(checkOut) - new Date(checkIn)
    // const diffMins = Data.map(date / 60000)
    const diffMins = Math.floor(diffMs / 60000)

    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hours}h ${mins}m`
  }

  const latestLog = checkLogs.length > 0 ? checkLogs[0] : null

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" text="Loading pass details..." />
      </div>
    )
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
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link to="/passes">
            <Button variant="secondary" size="sm">
              <FaArrowLeft size={14} className="mr-2" /> Back to Passes
            </Button>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0b1e3c]">Pass Details</h1>
            <StatusBadge status={pass?.status} type="pass" size="lg" />  
        </div>
      </div>

      <Card className="p-6 shadow-lg rounded-2xl border border-gray-100 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <FaUser className="mr-2 text-blue-600" size={18} /> Visitor
            </h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-800">{pass.visitor?.name || 'N/A'}</span></p>
              <p><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-800 break-all">{pass.visitor?.email || 'N/A'}</span></p>
              <p><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-800">{pass.visitor?.phone || 'N/A'}</span></p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <FaCalendarAlt className="mr-2 text-purple-600" size={16} /> Appointment
            </h2>
            <div className="space-y-2 text-sm">
              <p className='flex gap-2'><span className="text-gray-500">Date:</span> <span className="font-medium text-gray-800">
                <DateTimeFormat 
                    date={pass.appointment?.date} 
                    type="date" 
                    format="short" 
                    showIcon={false} 
                    emptyText="N/A"
                  /></span>
                  </p>
              <p><span className="text-gray-500">Host:</span> <span className="font-medium text-gray-800">{pass.appointment?.host?.name || 'N/A'}</span></p>
              <p><span className="text-gray-500">Host Email:</span> <span className="font-medium text-gray-800 break-all">{pass.appointment?.host?.email || 'N/A'}</span></p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <FaPassport className="mr-2 text-green-600" size={16} /> Pass Info
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  pass.status === 'active' ? 'bg-green-100 text-green-800' :
                  pass.status === 'inside' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                    <StatusBadge status={pass?.status} type="pass" size="sm" />
                </span>
              </p>
              <p className='flex gap-2'><span className="text-gray-500">Generated:</span> <span className="font-medium text-gray-800">
                <DateTimeFormat 
                   date={pass.createdAt} 
                   type="datetime" 
                   format="short" 
                   showIcon={false} 
                   emptyText="N/A"
                 />
                 </span></p>
              <p>
                <span className="text-gray-500">Pass ID:</span>{' '}
                <span className="font-mono text-xs text-gray-700 break-all bg-gray-100 p-1 rounded">{pass._id}</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <FaQrcode className="mr-2 text-indigo-600" size={18} /> QR Code
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
                <a href={pass.qrCode} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 hover:underline block text-center">
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
              <FaClock className="mr-2 text-gray-600" size={20} /> Check-in / Check-out History
            </h2>

            {latestLog ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center text-blue-700 mb-2">
                    <FaSignInAlt className="mr-2" size={16} />
                    <span className="font-semibold">Check-in</span>
                  </div>
                  <p className="text-base text-gray-800">
                    {latestLog.checkInTime ? formatDate(latestLog.checkInTime) : 'Not checked in'}
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center text-orange-700 mb-2">
                    <FaSignOutAlt className="mr-2" size={16} />
                    <span className="font-semibold">Check-out</span>
                  </div>
                  <p className="text-base text-gray-800">
                    {latestLog.checkOutTime ? formatDate(latestLog.checkOutTime) : 'Not checked out'}
                  </p>
                </div>

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

            {checkLogs.length > 1 && (
              <p className="text-sm text-gray-500 mt-3 flex items-center">
                <FaInfoCircle className="mr-1" size={12} />
                Total {checkLogs.length} visits. Showing the latest one.
              </p>
            )}
          </div>
        )}

        {/* {pass.pdfPath && pass.status === 'active' && (
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <Button variant="primary" onClick={() => handleDownload(pass.pdfPath, `pass-${pass._id}`)} className="flex-1">
              <FaDownload className="mr-2" size={16} /> Download PDF
            </Button>
            <Button variant="secondary" onClick={() => window.open(pass.pdfPath, '_blank')} className="flex-1">
              <FaExternalLinkAlt className="mr-2" size={16} /> Open in Browser
            </Button>
          </div>
        )} */}

        {/* {pass.status === 'expired' && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500">This pass has expired. Download is no longer available.</p>
            </div>
          </div>
        )} */}
      </Card>
    </div>
  )
}

export default PassDetails
