
import { useEffect, useState } from 'react'
import { getVisitors } from '../../services/visitorService'

import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'
// import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { 
  FaEye, 
  FaUser,
  FaPlus, 
  FaUserCheck, 
  FaUserClock, 
  FaUserTimes,
  FaFilter,
  FaSyncAlt
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast'

const Visitors = () => {
  const [visitors, setVisitors] = useState([])

  // const [loading, setLoading] = useState(fase)
  const [loading, setLoading] = useState(true)
  
  const [filter, setFilter] = useState('all')

  // const [User, setUser] = useState(null)
  const { user } = useAuth();

  useEffect(() => {
    loadVisitors();
  }, [])

  const loadVisitors = async () => {
    setLoading(true)
    try {
      const data = await getVisitors();
      setVisitors(data)
      
    } catch (error) {
      // console.error(error);
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusValue = {
      approved: { bg: 'bg-[#e6f7ee]', text: 'text-[#0b8a4f]', border: 'border-[#b0e3cd]', icon: FaUserCheck },
      pending: { bg: 'bg-[#fef5e6]', text: 'text-[#b45b0a]', border: 'border-[#fed7a5]', icon: FaUserClock },
      rejected: { bg: 'bg-[#fee9e7]', text: 'text-[#cc2e2e]', border: 'border-[#fccac4]', icon: FaUserTimes },
      // checked_in: { bg: 'bg-[#e8f0fe]', text: 'text-[#2463eb]', border: 'border-[#b8d1fc]', icon: FaUserCheck },
      // checked_out: { bg: 'bg-[#f0f2f5]', text: 'text-[#4a5f73]', border: 'border-[#d0d9e6]', icon: FaUser },
    };
    const pagestatus = statusValue[status] || statusValue.pending;
    const Icon = pagestatus.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${pagestatus.bg} ${pagestatus.text} ${pagestatus.border}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const columns = [
    { 
      header: 'Visitor', 
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.photo ? (
            <img src={row.photo} alt={row.name} className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#2463eb] flex items-center justify-center">
              <span className="text-white text-xs font-bold">{row.name?.charAt(0)}</span>
            </div>
          )}
          <div>
            <p className="font-medium text-[#0b1e3c]">{row.name}</p>
            <p className="text-xs text-[#5b6f87]">{row.email}</p>
          </div>
        </div>
      ),
      sortable: true
    },
    { 
      header: 'Phone', 
      accessor: 'phone',
      cell: (row) => <span className="text-sm text-[#1e293b]">{row.phone}</span>
    },
    { 
      header: 'Purpose', 
      accessor: 'purpose',
      cell: (row) => (
        <span className="text-sm bg-[#f5f9ff] px-3 py-1.5 rounded-lg text-[#1e293b] border border-[#e2eaf5]">
          {row.purpose}
        </span>
      )
    },
    {
      header: 'Host',
      accessor: 'host',
      cell: (row) => row.host ? (
        <div className="text-sm">
          <p className="font-medium text-[#0b1e3c]">{row.host.name}</p>
          <p className="text-xs text-[#5b6f87]">{row.host.email}</p>
        </div>
      ) : <span className="text-sm text-[#8b9eb0]">Not assigned</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => getStatusBadge(row.status),
      sortable: true
    },
    {
      header: 'Visit Date',
      accessor: 'createdAt',
      cell: (row) => (
        <span className="text-sm text-[#1e293b]">
          {new Date(row.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      ),
      sortable: true
    },
    {
      header: 'Actions',
      accessor: '_id',
      cell: (row) => (
        <Link to={`/visitors/${row._id}`}>
          <Button variant="ghost" size="sm" className="p-2">
            <FaEye className="text-[#2463eb]" size={16} />
          </Button>
        </Link>
      ),
    },
  ]

  // const filteredVisitors = map === 'all' ? visitors 
  //   : visitors.map((v) => v.status === filter)
  const filteredVisitors = filter === 'all' ? visitors 
    : visitors.filter((v) => v.status === filter)

  const statusCounts = {
    all: visitors.length,
    pending: visitors.filter(v => v.status === 'pending').length,
    approved: visitors.filter(v => v.status === 'approved').length,
    rejected: visitors.filter(v => v.status === 'rejected').length,
    // checked_in: visitors.filter(v => v.status === 'check_in').length,
    // checked_out: visitors.filter(v => v.status === 'check_out').length,
  }

  const status = 
    [
          { label: 'All', value: 'all', count: statusCounts.all, color: 'bg-[#f0f2f5] text-[#4a5f73]' },
          { label: 'Pending', value: 'pending', count: statusCounts.pending, color: 'bg-[#fef5e6] text-[#b45b0a]' },
          { label: 'Approved', value: 'approved', count: statusCounts.approved, color: 'bg-[#e6f7ee] text-[#0b8a4f]' },
          { label: 'Rejected', value: 'rejected', count: statusCounts.rejected, color: 'bg-[#fee9e7] text-[#cc2e2e]' },
          // { label: 'Checked In', value: 'checked_in', count: statusCounts.checked_in, color: 'bg-[#e8f0fe] text-[#2463eb]' },
          // { label: 'Checked Out', value: 'checked_out', count: statusCounts.checked_out, color: 'bg-[#f0f2f5] text-[#4a5f73]' },
        ]
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" text="Loading visitors..." />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0b1e3c] mb-1">Visitors</h1>
          <p className="text-sm text-[#5b6f87]">Manage and track all visitor entries</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" onClick={loadVisitors}>
            <FaSyncAlt className="mr-2" size={14} /> Refresh
          </Button>
          {/* <Button variant="secondary" size="md">
            <FaDownload className="mr-2" size={14} /> Export
          </Button> */}
          {/* {(user.role === "admin" || user.role === "employee") && (
            <Link to="/visitors/new">
              <Button variant="primary" size="md">
                <FaPlus className="mr-2" size={14} /> Add Visitor
              </Button>
            </Link>
          )} */}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        {/* {[
          { label: 'All', value: 'all', count: statusCounts.all, color: 'bg-[#f0f2f5] text-[#4a5f73]' },
          { label: 'Pending', value: 'pending', count: statusCounts.pending, color: 'bg-[#fef5e6] text-[#b45b0a]' },
          { label: 'Approved', value: 'approved', count: statusCounts.approved, color: 'bg-[#e6f7ee] text-[#0b8a4f]' },
          { label: 'Rejected', value: 'rejected', count: statusCounts.rejected, color: 'bg-[#fee9e7] text-[#cc2e2e]' },
          { label: 'Checked In', value: 'checked_in', count: statusCounts.checked_in, color: 'bg-[#e8f0fe] text-[#2463eb]' },
          { label: 'Checked Out', value: 'checked_out', count: statusCounts.checked_out, color: 'bg-[#f0f2f5] text-[#4a5f73]' },
        ]  */}
          {[status.map((status) => (
          <button
            key={status.value}
            onClick={() => setFilter(status.value)}
            className={`
              p-4 rounded-xl border transition-all duration-200 text-left
              ${filter === status.value 
                ? 'border-[#2463eb] ring-2 ring-[#2463eb] ring-opacity-20' 
                : 'border-[#eef2f6] hover:border-[#2463eb] hover:shadow-md'
              }
              ${status.color}
            `}
          >
            <p className="text-xs mb-1">{status.label}</p>
            <p className="text-2xl font-bold">{status.count}</p>
          </button>
        ))]}
      </div>

      <Card shadow='xl' className="p-0">
        <div className="px-6 py-4 border-b border-[#eef2f6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaFilter className="text-[#8b9eb0]" size={14} />
            <span className="text-sm font-medium text-[#0b1e3c]">
              {filter === 'all' ? 'All Visitors' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Visitors`}
            </span>
          </div>
          <span className="text-xs text-[#5b6f87]">
            Showing {filteredVisitors.length} of {visitors.length} entries
          </span>
        </div>
        {/* <div className='table'>
          <Table 
          columns={columns} 
          data={filteredVisitors}
          searchable={true}
          emptyMessage="No visitors found"
        />
        </div> */}
        <Table 
          columns={columns} 
          data={filteredVisitors}
          searchable={true}
          emptyMessage="No visitors found"
        />
      </Card>
    </div>
  )
}

export default Visitors