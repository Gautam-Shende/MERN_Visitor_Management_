import { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom'
import { fetchVisitorById } from '../../services/visitorService'
// import { getVisitors } from '../../services/visitorService'

import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import StatusBadge from '../../components/common/StatusBadge'  
import DateTimeFormat from '../../components/common/DateTimeFormat'  

import { 
  FaEnvelope, 
  FaPhone, 
  FaInfoCircle, 
  // FaIdCard,
  FaCalendarAlt,
  FaBuilding,
  FaArrowLeft,
  // FaEdit,
  // FaPrint,
  // FaQrcode
} from 'react-icons/fa'

const VisitorDetails = () => {
  // const { visitorId, SetVisitorID} = useState([null])
  const { id } = useParams()

  const navigate = useNavigate()
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true)


  // const [error, setError] = useState(console.log("Error"))
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVisitor();
  }, [id])

  const fetchVisitor = async () => {
    try {
      const data = await fetchVisitorById(id)
      setVisitor(data)
      console.log(data);
      setError(null)
    } catch (error) {
      // console.error(error);
      toast.error(error.response?.data?.message);
      // setError('Failed to load visitor details');
      setError(error.response?.data?.message)
    } finally {
      // setTimeout(() => {
      //   setLoading(false);
      // }, 1000)

      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" text="Loading visitor details..." />
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="p-8">

        <Card className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#fee9e7] flex items-center justify-center">
              <FaInfoCircle className="text-[#ec3c3c]" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-[#0b1e3c]">Visitor Not Found</h2>
            <p className="text-[#5b6f87] mb-4">{error || 'The requested visitor could not be found.'}</p>
            <Button variant="primary" onClick={() => navigate('/visitors')}>
              <FaArrowLeft className="mr-2" /> Back to Visitors
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
            onClick={() => navigate('/visitors')}
          >
            <FaArrowLeft size={14} className="mr-2" /> Back
          </Button>

          <h1 className="text-2xl lg:text-3xl font-bold text-[#0b1e3c]">Visitor Details</h1>
          {/* <div className="ml-2">
            {getStatusBadge(visitor.status)}
          </div> */}
        </div>
        {/* <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FaPrint className="mr-2" /> Print Pass
          </Button>
          <Button variant="outline" size="sm">
            <FaQrcode className="mr-2" /> Show QR
          </Button>
          <Button variant="primary" size="sm">
            <FaEdit className="mr-2" /> Edit
          </Button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-1">
          <Card className="text-center">
            <div className="flex flex-col items-center">

              <div className="relative mb-4">
                {visitor.photo ? (
                  <img 
                    src={visitor.photo} 
                    alt={visitor.name} 
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-[#1f59d8] flex items-center justify-center shadow-lg">
                    <span className="text-white text-4xl font-bold">
                      {visitor.name?.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="absolute -bottom-2 right-1/2 translate-x-16">
                  {/* <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center border-2 border-white">
                    <FaIdCard className="text-[#2463eb]" size={18} />
                  </div> */}
                </div>
              </div>

              <h2 className="text-xl font-bold text-[#0b1e3c] mb-1">{visitor.name}</h2>
              <p className="text-sm text-[#5b6f87] mb-3">ID: {visitor._id?.slice(-8)}</p>
               {/* <div className="ml-2">
                     {getStatusBadge(visitor.status)}
               </div> */}
                <div className="mb-3">
                <StatusBadge status={visitor.status} type="visitor" size="md" />
                </div>

              {/* Quick Stats */}
              <div className="w-full grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#eef2f6]">
                <div className="text-center">
                  <p className="text-xs text-[#5b6f87] mb-1">Visits</p>
                  <p className="text-lg font-semibold text-[#0b1e3c]">{visitor.visitCount || 1}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#5b6f87] mb-1">Last Visit</p>
                  <p className="text-lg font-semibold text-[#0b1e3c]">
                    {visitor.lastVisit ? new Date(visitor.lastVisit).toLocaleDateString() : 'Today'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-[#0b1e3c] mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#e8f0fe] flex items-center justify-center ">
                  <FaEnvelope className="text-[#2463eb]" size={16} />
                </div>
                <div>
                  <p className="text-xs text-[#5b6f87] mb-1">Email Address</p>
                  <p className="text-sm font-medium text-[#0b1e3c]">{visitor.email || 'N/A'}</p>
                </div>
              </div>


              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#e6f7ee] flex items-center justify-center">
                  <FaPhone className="text-[#22b455]" size={16} />
                </div>
                <div>
                  <p className="text-xs text-[#5b6f87] mb-1">Phone Number</p>
                  <p className="text-sm font-medium text-[#0b1e3c]">{visitor.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#fef5e6] flex items-center justify-center ">
                  <FaInfoCircle className="text-[#b45b0a]" size={16} />
                </div>
                <div>
                  <p className="text-xs text-[#5b6f87] mb-1">Purpose of Visit</p>
                  <p className="text-sm font-medium text-[#0b1e3c]">{visitor.purpose}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f0e7fe] flex items-center justify-center ">
                  <FaCalendarAlt className="text-[#6941c6]" size={16} />
                </div>
                <div>
                  <p className="text-xs text-[#5b6f87] mb-1">Visit Date</p>
                  <p className="text-sm font-medium text-[#0b1e3c]">
                    <DateTimeFormat 
                        date={visitor.createdAt} 
                       type="date" 
                        format="long" 
                        showIcon={false} 
                        emptyText="N/A"
                      />
                  </p>
                </div>
              </div>

              {visitor.host && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <div className="w-10 h-10 rounded-lg bg-[#e8f0fe] flex items-center justify-center ">
                    <FaBuilding className="text-[#2463eb]" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[#5b6f87] mb-1">Host Information</p>
                    <div className="bg-[#f5f9ff] rounded-xl p-3 border border-[#e2eaf5]">
                      <p className="text-sm font-medium text-[#0b1e3c]">{visitor.host.name}</p>
                      <p className="text-xs text-[#5b6f87]">{visitor.host.email}</p>
                      {/* <p className="text-xs text-[#5b6f87] mt-1">Department: {visitor.host.department || 'N/A'}</p> */}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* {(visitor.company || visitor.notes) && (
              <div className="mt-6 pt-6 border-t border-[#eef2f6]">
                <h4 className="text-sm font-semibold text-[#0b1e3c] mb-3">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visitor.company && (
                    <div>
                      <p className="text-xs text-[#5b6f87] mb-1">Company</p>
                      <p className="text-sm text-[#0b1e3c]">{visitor.company}</p>
                    </div>
                  )}
                  {visitor.notes && (
                    <div className="md:col-span-2">
                      <p className="text-xs text-[#5b6f87] mb-1">Notes</p>
                      <p className="text-sm text-[#0b1e3c] bg-[#f5f9ff] p-3 rounded-xl border border-[#e2eaf5]">
                        {visitor.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )} */}
          </Card>
        </div>

      </div>
    </div>
  );
};

export default VisitorDetails;