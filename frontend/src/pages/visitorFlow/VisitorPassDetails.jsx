
import { useEffect, useState } from 'react'
// import { NavLink } from 'react-router-dom'
import { useParams, Link, useNavigate } from 'react-router-dom'

import { getVisitorPass } from '../../services/visitorAuthService'

import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'

import { 
  FaArrowLeft, FaDownload, FaExternalLinkAlt, FaQrcode, 
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, 
  FaCheckCircle, FaClock, FaTimesCircle, FaPrint 
} from 'react-icons/fa'

import toast from 'react-hot-toast';
// import { useAuth } from '../../context/AuthContext';

const VisitorPassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [pass, setPass] = useState(null);
  // const [loading, setLoading] = useState(false)
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchPass();
  }, [id])

  const fetchPass = async () => {
    setLoading(true);
    try {
      const response = await getVisitorPass(id);
      
      let passData = response;
      if (response?.pass) {
        passData = response.pass;
      } else if (response?.data) {
        passData = response.data;
        // console.log(passData)
      }
      
      setPass(passData);
    } catch (err) {
      // console.error('Error fetching pass:', err);
      toast.error('Pass not found');
      navigate('/visitor/passes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pdfUrl) => {
    if (!pdfUrl) {
      toast.error('No PDF available');
      return;
    }
    
    setDownloading(true);
    try {
      const response = await fetch(pdfUrl)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl;
      // link.download = `visitor-pass-${pass?.visitor?.name;
      link.download = `visitor-pass-${pass?.visitor?.name || 'pass'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      // console.log("DonloadStarted...")
      toast.success('Download started');
    } catch (err) {
      window.open(pdfUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusFilter = {
      active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: FaCheckCircle, label: 'Active' },
      inside: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: FaClock, label: 'Inside' },
      expired: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: FaTimesCircle, label: 'Expired' },
      used: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: FaCheckCircle, label: 'Used' },
    };
    const Status = statusFilter[status] || statusFilter.expired;
    const Icon = Status.icon;
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${Status.bg} ${Status.text} ${Status.border}`}>
        <Icon size={14} />
        {Status.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" text="Loading pass details..." />
      </div>
    );
  }

  if (!pass) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-12 text-center max-w-md">
          <FaTimesCircle className="text-rose-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pass Not Found</h2>
          <p className="text-gray-500 mb-6">The pass you're looking for doesn't exist.</p>
          <Link to="/visitor/passes">
            <Button variant="primary">
              <FaArrowLeft className="mr-2" /> Back to Passes
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/visitor/passes" className="inline-block mb-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <FaArrowLeft /> Back to Passes
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Visitor Pass</h1>
          <p className="text-gray-500 mt-1">Your digital visitor pass for entry</p>
        </div>

        <Card className="overflow-hidden shadow-xl">

          <div className="bg-indigo-600 px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-white text-xl font-bold">Digital Visitor Pass</h2>
                <p className="text-blue-100 text-sm mt-1">Pass ID: {pass._id?.slice(-8)}</p>
              </div>
              <div>{getStatusBadge(pass.status)}</div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaUser className="text-blue-500" /> Visitor Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">{pass.visitor?.name || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-400 text-xs" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-700">{pass.visitor?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-400 text-xs" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm text-gray-700">{pass.visitor?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                    <FaCalendarAlt className="text-blue-500" /> Appointment Details
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Host</p>
                      <p className="font-medium text-gray-800">{pass.appointment?.host?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{pass.appointment?.host?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date & Time</p>
                      <p className="text-sm text-gray-700">
                        {pass.appointment?.date ? new Date(pass.appointment.date).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Purpose</p>
                      <p className="text-sm text-gray-700">{pass.appointment?.purpose || pass.purpose || 'Visit'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                {pass.qrCode ? (
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 mb-3">
                      <img src={pass.qrCode} alt="QR Code" className="w-40 h-40 object-contain" />
                    </div>
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <FaQrcode size={12} />
                      Scan this QR code at the entrance
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-2xl">
                    <FaQrcode className="text-gray-400 text-5xl mx-auto mb-2" />
                    <p className="text-sm text-gray-500">QR Code not available</p>
                  </div>
                )}
              </div>
            </div>

            {pass.pdfPath && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={() => handleDownload(pass.pdfPath)}
                    disabled={downloading}
                    variant="primary"
                    className="gap-2"
                  >
                    <FaDownload /> {downloading ? 'Downloading...' : 'Download PDF'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => window.open(pass.pdfPath, '_blank')}
                    className="gap-2"
                  >
                    <FaExternalLinkAlt /> Open in Browser
                  </Button>
                  <Button variant="outline" onClick={() => window.print()} className="gap-2">
                    <FaPrint /> Print
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  <strong>Note:</strong> Please carry this pass or have it ready on your mobile device for scanning at the entrance.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Important Instructions:</h4>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Please present this pass at the security desk upon arrival</li>
            <li>The QR code will be scanned for verification</li>
            <li>This pass is valid only for the date and time specified</li>
            <li>For any issues, please contact the host or security</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default VisitorPassDetails;