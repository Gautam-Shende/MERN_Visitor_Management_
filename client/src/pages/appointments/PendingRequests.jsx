import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import Table from '../../components/common/Table'
import StatusBadge from '../../components/common/StatusBadge'
import DateTimeFormat from '../../components/common/DateTimeFormat'

import { fetchPendingRequests } from '../../services/appointmentService'
import toast from 'react-hot-toast'
import { FaSyncAlt, FaCalendarAlt } from 'react-icons/fa'

const PendingRequests = () => {
  const [requests, setRequests] = useState([])
  // const [error, seterror] = useState(null) 
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await fetchPendingRequests()
      
      let data = []
      if (Array.isArray(response)) {
        data = response
      } else if (response?.data && Array.isArray(response.data)) {
        data = response.data
      } else if (response?.requests && Array.isArray(response.requests)) {
        data = response.requests
      }
      
      const requestedOnly = data.filter(req => req.status === 'requested')
      // console.log(requestedOnly)
      setRequests(requestedOnly)
      
    } catch (error) {
      toast.error('Failed to load pending requests')
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleScheduleClick = (request) => {
    navigate(`/schedule-appointment/${request._id}`)
  }

  const columns = [
    {
      header: 'Visitor',
      accessor: 'visitor',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.visitor?.photo ? (
            <img 
              src={row.visitor.photo} 
              alt={row.visitor.name} 
              className="w-8 h-8 rounded-lg object-cover" 
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {row.visitor?.name?.charAt(0) || 'V'}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-800">{row.visitor?.name || 'N/A'}</p>
            <p className="text-xs text-gray-500">{row.visitor?.email || 'No email'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Preferred Date & Time',
      accessor: 'preferredDate',
      sortable: true,
      cell: (row) => (
        <DateTimeFormat 
          date={row.preferredDate} 
          type="datetime" 
          format="short"
          showIcon={true}
          iconSize={12}
        />
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} type="appointment" size="sm" />,
    },
    {
      header: 'Actions',
      accessor: '_id',
      cell: (row) => (
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => handleScheduleClick(row)}
          className="gap-2"
        >
          <FaCalendarAlt size={14} /> Schedule
        </Button>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" text="Loading pending requests..." />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
            Pending Appointment Requests
          </h1>
          <p className="text-sm text-gray-500">
            All visitor requests and confirm appointment date & time
          </p>
        </div>
        
        <Button variant="secondary" size="md" onClick={fetchRequests}>
          <FaSyncAlt className="mr-2" size={14} /> Refresh
        </Button>
      </div>

      {requests.length > 0 ? (
        <Card className="overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Pending Requests ({requests.length})
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Showing {requests.length} entries
            </span>
          </div>
          
          <Table 
            columns={columns} 
            data={requests} 
            searchable={true} 
            emptyMessage="No pending requests found" 
          />
        </Card>
      ) : (
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <FaCalendarAlt className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No Pending Requests</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              All visitor requests have been processed.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default PendingRequests