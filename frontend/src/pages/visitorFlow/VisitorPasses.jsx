
import { useEffect, useState } from 'react'
import { getVisitorPasses } from '../../services/visitorAuthService'

import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'

import { FaEye,
   FaPassport, 
   FaCalendarAlt, 
   FaUser,
    // FaQrcode, 
    FaSyncAlt } from 'react-icons/fa'

import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const VisitorPasses = () => {
  // const [passes, setPasses] = useState(null)
  const [passes, setPasses] = useState([])
  // const [loading, setLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // console.log("VisitorPasses component mounted");
    fetchPasses();
  }, [])

  const fetchPasses = async () => {
    // console.log("Fetching visitor passes...");
    setLoading(true);
    setError(null);
    try {
      const response = await getVisitorPasses();
      // console.log("Passes API response:", response);
      
      let passesData = [];
      if (Array.isArray(response)) {
        // console.log("Response is an array, using directly");
        passesData = response;
      } else if (response?.passes && Array.isArray(response.passes)) {
        // console.log("Response has passes array, extracting");
        passesData = response.passes;
      } else if (response?.data && Array.isArray(response.data)) {
        // console.log("Response has data array, extracting");
        passesData = response.data;
      } else {
        // console.warn("Unexpected response format:", response);
        passesData = [];
      }
      
      setPasses(passesData);
    } catch (err) {
      // console.error('Error fetching passes:', err);
      setError(err.response?.data?.message || 'Failed to load passes');
      toast.error('Failed to load passes');
    } finally {
      // console.log("Setting loading state to false")
      // setTimeout(() => {
      //   setLoading(false)
      // }, 1000)
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    // console.log("Getting status badge for status:", status);
    const statusFilter = {
      active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Active', dot: 'bg-emerald-500' },
      inside: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Inside', dot: 'bg-blue-500' },
      expired: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Expired', dot: 'bg-gray-500' },
      used: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Used', dot: 'bg-purple-500' },
    };
    const Status = statusFilter[status] || statusFilter.expired;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${Status.bg} ${Status.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${Status.dot}`}></span>
        {Status.label}
      </span>
    );
  };

  if (loading) {
    // console.log("Loading state active, showing spinner");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="xl" text="Loading your passes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-blue-600">
              My Passes
            </h1>
            <p className="text-gray-500 mt-1">All your digital visitor passes in one place</p>
          </div>
          <Button variant="secondary" onClick={fetchPasses} className="gap-2">
            <FaSyncAlt className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-rose-700 flex-1">{error}</p>
            <Button variant="secondary" size="sm" onClick={fetchPasses}>Try Again</Button>
          </div>
        )}

        {passes.length === 0 && !error && (
          <Card className="p-12 text-center bg-white">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <FaPassport className="text-blue-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">No Passes Yet</h3>
              <p className="text-gray-500 max-w-md text-center">
                Once your appointment is approved, a digital pass will be generated here.
              </p>
              <Link to="/visitor/appointments">
                <Button variant="primary" className="mt-2">View Appointments</Button>
              </Link>
            </div>
          </Card>
        )}

        {passes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passes.map((pass) => {
              // console.log("Rendering pass:", pass._id, "Status:", pass.status);
              return (
                <Card key={pass._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white">

                  <div className={`p-4 ${
                    pass.status === 'active' ? 'bg-emerald-500' : 
                    pass.status === 'inside' ? 'bg-blue-500' : 
                    'bg-gray-500'
                  } text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaPassport size={20} />
                        <span className="font-semibold">Digital Pass</span>
                      </div>
                      {getStatusBadge(pass.status)}
                    </div>
                  </div>


                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <FaUser className="text-blue-500 text-xl" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{pass.visitor?.name || 'Visitor'}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FaCalendarAlt size={10} />
                          {pass.appointment?.date ? new Date(pass.appointment.date).toLocaleDateString() : 'Date not set'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Host:</span>
                        <span className="font-medium text-gray-700">{pass.appointment?.host?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time:</span>
                        <span className="font-medium text-gray-700">
                          {pass.appointment?.date ? new Date(pass.appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </span>
                      </div>
                    </div>


                    {pass.qrCode && (
                      <div className="flex justify-center mb-4">
                        <img src={pass.qrCode} alt="QR Code" className="w-20 h-20 rounded-lg border border-gray-200" />
                      </div>
                    )}


                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <Link to={`/visitor/pass-details/${pass.appointment?._id || pass._id}`} className="flex-1">
                        <Button variant="primary" size="sm" className="w-full gap-2">
                          <FaEye size={14} /> View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default VisitorPasses