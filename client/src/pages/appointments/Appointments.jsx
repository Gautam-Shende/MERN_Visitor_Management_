
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
// import { NavLink } from 'react-router-dom'

import { fetchAppointments } from '../../services/appointmentService'

import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'
import StatusBadge from '../../components/common/StatusBadge'   
import DateTimeFormat from '../../components/common/DateTimeFormat'

import {
   FaEye, FaCalendarAlt, FaFilter, FaSyncAlt,
} from 'react-icons/fa'

import toast from 'react-hot-toast'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
    // const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all')
    const navigate = useNavigate()

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    setLoading(true)
    try {
      const response = await fetchAppointments()
      let data = [];
      if (Array.isArray(response)) {
        data = response
      } else if (response?.appointments && Array.isArray(response.appointments)) {
        data = response.appointments
      } else if (response?.data && Array.isArray(response.data)) {
        data = response.data
      }
      setAppointments(data)
      // console.log(data)
    } catch {
      toast.error('Failed to load appointments')
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  // const formatDate = (date) => {
  //   try {
  //     return new Date(date).toLocaleDateString('en-US', {
  //       day: 'numeric', month: 'short', year: 'numeric',
  //       hour: '2-digit', minute: '2-digit',
  //     })
  //   } catch {
  //     return 'Invalid date'
  //   }
  // }

  const columns = [
    {
      header: 'Visitor',
      accessor: 'visitor',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.visitor?.photo ? (
            <img src={row.visitor.photo} alt={row.visitor.name} className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#1a4fc4] flex items-center justify-center">
              <span className="text-white text-xs font-bold">{row.visitor?.name?.charAt(0) || 'V'}</span>
            </div>
          )}
          <div>
            <p className="font-medium text-[#0b1e3c]">{row.visitor?.name || 'N/A'}</p>
            <p className="text-xs text-[#5b6f87]">{row.visitor?.email || 'No email'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Host',
      accessor: 'host',
      cell: (row) => (
        <div>
          <p className="font-medium text-[#0b1e3c]">{row.host?.name || 'N/A'}</p>
          <p className="text-xs text-[#5b6f87]">{row.host?.email || ''}</p>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      accessor: 'date',
      sortable: true,
      cell: (row) => (
        <DateTimeFormat 
          date={row.date} 
          type="datetime" 
          format="short"
          showIcon={true}
          emptyText="N/A"
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
        <Link to={`/appointments/${row._id}`}>
          <Button variant="ghost" size="sm" className="p-2">
            <FaEye className="text-[#2463eb]" size={16} />
          </Button>
        </Link>
      ),
    },
  ]

  const filteredAppointments = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)

  const statusCounts = {
    all:appointments.length,
    pending:appointments.filter((a) => a.status === 'pending').length,
    approved:appointments.filter((a) => a.status === 'approved').length,
    rejected:appointments.filter((a) => a.status === 'rejected').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" text="Loading Appointments..." />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0b1e3c] mb-1">Appointments</h1>
          <p className="text-sm text-[#5b6f87]">Manage and track all visitor appointments</p>
        </div>
        <Button variant="secondary" size="md" onClick={loadAppointments}>
          <FaSyncAlt className="mr-2" size={14} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {label:'All Appointments',value:'all', count: statusCounts.all,color: 'bg-[#f0f2f5] text-[#4a5f73]' },
          {label:'Pending',value:'pending', count: statusCounts.pending,color: 'bg-[#fef5e6] text-[#b45b0a]' },
          {label:'Approved',value:'approved',count: statusCounts.approved, color: 'bg-[#e6f7ee] text-[#0b8a4f]' },
          { label:'Rejected',value:'rejected',count: statusCounts.rejected, color: 'bg-[#fee9e7] text-[#cc2e2e]' },
        ].map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`p-4 rounded-xl border shadow-lg shadow-gray-400 transition-all duration-200 text-left ${
              filter === s.value
                ? 'border-[#2463eb] ring-2 ring-[#2463eb] ring-opacity-20'
                : 'border-[#eef2f6] hover:border-[#2463eb] hover:shadow-md'
            } ${s.color}`}
          >
            <p className="text-xs mb-1">{s.label}</p>
            <p className="text-2xl font-bold">{s.count}</p>
          </button>
        ))}
      </div>

      {filteredAppointments.length > 0 ? (
        <Card className="overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-[#eef2f6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaFilter className="text-[#8b9eb0]" size={14} />
              <span className="text-sm font-medium text-[#0b1e3c]">
                {filter === 'all' ? 'All Appointments' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
              </span>
            </div>
            <span className="text-xs text-[#5b6f87]">
              Showing {filteredAppointments.length} of {appointments.length} entries
            </span>
          </div>
          <Table columns={columns} data={filteredAppointments} searchable={true} emptyMessage="No appointments found" />
        </Card>
      ) : (
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#f5f9ff] flex items-center justify-center">
              <FaCalendarAlt className="text-[#8b9eb0]" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-[#0b1e3c]">No Appointments Found</h3>
            <p className="text-sm text-[#5b6f87] max-w-sm">
              {filter === 'all' ? 'There are no appointments scheduled yet.' : `No ${filter} appointments found.`}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Appointments
