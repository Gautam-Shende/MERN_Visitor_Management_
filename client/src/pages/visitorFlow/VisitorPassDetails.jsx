
import { useEffect, useState } from 'react'

import { useParams, Link, useNavigate } from 'react-router-dom'
import { getVisitorPass } from '../../services/visitorAuthService'
// common comp res
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import StatusBadge from '../../components/common/StatusBadge'
import DateTimeFormat from '../../components/common/DateTimeFormat'

// import {useAuth} from "../../context/AuthContext"
import {
  FaArrowLeft, FaDownload, FaExternalLinkAlt, FaQrcode,
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaCheckCircle,
  FaClock, FaTimesCircle, FaPrint,
} from 'react-icons/fa'

import toast from 'react-hot-toast'

const VisitorPassDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  // const { user } = useAuth();
  const [pass, setPass] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchPass()
  }, [id])

  const fetchPass = async () => {
    setLoading(true)
    try {
      const response = await getVisitorPass(id)
      let passData = response
      // if (res.data) passData = response.pass
      if (response?.pass) {
         passData = response.pass
         }
      else if (response?.data) {
         passData = response.data
      }
      setPass(passData)
    } catch {
      toast.error('Pass not found')
      // console.log(err.response?.data?.message)
      navigate('/visitor/passes')
    } finally {
      setLoading(false)
    }
  }

   const handleDownload = async (pdfUrl, fileName) => {

  if (!pdfUrl) {
    toast.error("No PDF available");
    return;
  }
  setDownloading(true);
  const toastId = toast.loading("Downloading pass...");

  try {
    let downloadUrl = pdfUrl;

    // if (downloadUrl.includes(.pdf)) {
    //   const timestamp = Date.now();
    //   downloadUrl = downloadUrl + "?t=" + timestamp;
    // }
    if (!downloadUrl.includes("?")) {
      const timestamp = Date.now();
      downloadUrl = downloadUrl + "?t=" + timestamp;
    }

    const response = await fetch(downloadUrl);

    if (!response.ok) {
      throw new Error("Failed to download file. Status: " + response.status);
    }

    const fileBlob = await response.blob();

    const blobUrl = window.URL.createObjectURL(fileBlob);

    const downloadLink = document.createElement("a");

    downloadLink.href = blobUrl;
    downloadLink.download = fileName + ".pdf";

    document.body.appendChild(downloadLink);

    downloadLink.click();
    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(blobUrl);

    toast.success("Downloaded successfully!", { id: toastId });

  } catch (error) {
    // console.log("Opening in new tab...")
    window.open(pdfUrl, "_blank");
    toast.success("Opening in new tab...", { id: toastId });
  } finally {
    setDownloading(false);
  }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" text="Loading pass details..." />
      </div>
    )
  }

  if (!pass) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-12 text-center max-w-md">
          <FaTimesCircle className="text-rose-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pass Not Found</h2>
          <p className="text-gray-500 mb-6">The pass you're looking for doesn't exist.</p>
          <Link to="/visitor/passes">
            <Button variant="primary"><FaArrowLeft className="mr-2" /> Back to Passes</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className=" flex gap-7 items-center mb-6">
          <Link to="/visitor/passes" className="inline-block mb-4">
            <Button variant="secondary" size="sm" className="gap-2">
              <FaArrowLeft /> Back to Passes
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-blue-600">! Visitor Pass</h1>
            <p className="text-gray-500 mt-1">Your digital visitor pass for entry</p>
          </div>
        </div>

        <Card className="overflow-hidden shadow-xl">
          
          <div className="bg-indigo-600 px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-white text-xl font-bold">Digital Visitor Pass</h2>
                <p className="text-blue-100 text-sm mt-1">Pass ID: {pass._id?.slice(-8)}</p>
              </div>
              <StatusBadge status={pass.status} type="pass" size="lg" />
            </div>
          </div>

          <div className="p-6">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
              
              <div className="flex justify-around sm:flex-row lg:flex-col gap-4">
                 <div>
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaUser className="text-blue-500" /> Visitor Information
                </h3>
                <div className="mt-4 space-y-3">
                  <div className='bg-gray-200 p-2 rounded-lg'>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">{pass.visitor?.name || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-lg">
                    <FaEnvelope className="text-gray-400 text-xs" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-700">{pass.visitor?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-lg">
                    <FaPhone className="text-gray-400 text-xs" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm text-gray-700">{pass.visitor?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                 </div>

               <div>
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2 ">
                    <FaCalendarAlt className="text-blue-500" /> Appointment
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div className='bg-gray-200 p-2 rounded-lg'>
                      <p className="font-medium text-gray-800">{pass.appointment?.host?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{pass.appointment?.host?.email}</p>
                    </div>
                    <div className='bg-gray-200 p-2 rounded-lg'>
                      <p className="text-sm text-gray-700">
                        <DateTimeFormat 
                            date={pass.appointment?.date} 
                            type="datetime" 
                            format="short"
                            showIcon={false}
                            emptyText="Date not set"
                          />                     
                         </p>
                    </div>
                    <div className='bg-gray-200 p-2 rounded-lg'>
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
                      <FaQrcode size={12} /> Scan this QR code at the entrance
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

            {pass.pdfPath && (pass.status === 'active' || pass.status === 'inside') && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => handleDownload(pass.pdfPath, `visitor-pass-${pass.visitor?.name || 'pass'}`)}
                    disabled={downloading}
                    variant="primary"
                    className="gap-2"
                  >
                    <FaDownload /> {downloading ? 'Downloading...' : 'Download PDF'}
                  </Button>
                  <Button variant="secondary" onClick={() => window.open(pass.pdfPath, '_blank')} className="gap-2">
                    <FaExternalLinkAlt /> Open in Browser
                  </Button>
                  <Button variant="outline" onClick={() => window.print()} className="gap-2">
                    <FaPrint /> Print
                  </Button>
                </div>
                {/* <p className="text-xs text-gray-500 mt-4">
                  <strong>Note:</strong> Please carry this pass or have it ready on your mobile device for scanning at the entrance.
                </p> */}
              </div>
            )}

            {pass.status === 'expired' && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500">⚠️ This pass has expired. Download is no longer available.</p>
                </div>
              </div>
            )}

            {!pass.pdfPath && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-yellow-700">⚠️ PDF version is not available. Please use the QR code above for entry.</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Important Instructions:</h4>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Please show this pass at the security desk when you arrive.</li>
           <li>The QR code on the pass will be scanned for verification.</li>
           <li>This pass is valid only for the date and time mentioned on it.</li>
            <li>If you face any issues, please reach out to your host or the security team.</li>
            <li>You can download and keep a copy of this pass for offline use.</li>
          </ul>
        </Card>
        
      </div>
    </div>
  )
}

export default VisitorPassDetails