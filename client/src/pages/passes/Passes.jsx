
import { useEffect, useState } from 'react'

import { fetchPasses } from '../../services/passService'

import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'
import StatusBadge from '../../components/common/StatusBadge'

// import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'

import {
  FaPassport, FaEye, FaSyncAlt, FaCheckCircle,
  FaSignInAlt, FaTimesCircle, FaFilter,
} from 'react-icons/fa'

import toast from 'react-hot-toast'

const Passes = () => {
  const [passes, setPasses] = useState([])
  const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadPasses()
  }, [])

  const loadPasses = async () => {
    setLoading(true)
    // setPasses(null)
    setError(null)
    try {
      const response = await fetchPasses()
      let data = [];
      if (Array.isArray(response)) {
        data = response
      } else if (response?.passes && Array.isArray(response.passes)) {
        data = response.passes
      } else if (response?.data && Array.isArray(response.data)) {
        data = response.data
      }
      setPasses(data)

    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load passes'
      // console.log(msg)
      setError(msg)
      toast.error(msg)
      setPasses([]);
    } finally {
      setLoading(false)
    }
  }

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
            <div className="w-8 h-8 rounded-lg bg-[#2463eb] flex items-center justify-center">
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
      header: 'Appointment Date',
      accessor: 'appointment',
      sortable: true,
      cell: (row) => {
        if (!row.appointment?.date) return 'N/A'
        const date = new Date(row.appointment.date)
        return (
          <div className="text-sm">
            <p className="font-medium text-[#0b1e3c]">
              {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-xs text-[#5b6f87]">
              {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        )
      },
    },
    {
      header: 'Host',
      accessor: 'appointment',
      cell: (row) => (
        <div>
          <p className="font-medium text-[#0b1e3c]">{row.appointment?.host?.name || 'N/A'}</p>
          <p className="text-xs text-[#5b6f87]">{row.appointment?.host?.email || ''}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} type="pass" size="sm" />,
    },
    {
      header: 'QR Code',
      accessor: 'qrCode',
      cell: (row) => row.qrCode ? (
        <a href={row.qrCode} target="_blank" rel="noopener noreferrer" className="block">
          <img src={row.qrCode} alt="QR" className="w-10 h-10 rounded-lg border-2 border-white shadow-sm hover:shadow-md transition-all hover:scale-110" />
        </a>
      ) : (
        <span className="text-xs text-[#8b9eb0]">—</span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      cell: (row) => (
        <Link to={`/passes/${row._id}`}>
          <Button variant="ghost" size="sm" className="p-2">
            <FaEye className="text-[#2463eb]" size={16} />
          </Button>
        </Link>
      ),
    },
  ]

  const filteredPasses = filter === 'all' ? passes : passes.filter((p) => p.status === filter)

  const statusCounts = {
    all:     passes.length,
    active:  passes.filter((p) => p.status === 'active').length,
    inside:  passes.filter((p) => p.status === 'inside').length,
    expired: passes.filter((p) => p.status === 'expired').length,
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" text="Loading passes..." />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0b1e3c] mb-1">Visitor Passes</h1>
          <p className="text-sm text-[#5b6f87]">Manage and track all generated passes</p>
        </div>
        <Button variant="secondary" size="md" onClick={loadPasses}>
          <FaSyncAlt className="mr-2" size={14} /> Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#fee9e7] border border-[#fccac4] rounded-xl flex items-center gap-3">
          <FaTimesCircle className="text-[#cc2e2e]" size={20} />
          <p className="text-sm text-[#cc2e2e]">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'All Passes', value: 'all',     count: statusCounts.all,     color: 'bg-[#f0f2f5] text-[#4a5f73]' },
          { label: 'Active',     value: 'active',  count: statusCounts.active,  color: 'bg-[#e6f7ee] text-[#0b8a4f]' },
          { label: 'Inside',     value: 'inside',  count: statusCounts.inside,  color: 'bg-[#e8f0fe] text-[#2463eb]' },
          { label: 'Expired',    value: 'expired', count: statusCounts.expired, color: 'bg-[#f0f2f5] text-[#4a5f73]' },
        ].map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`p-4 rounded-xl border shadow-sm shadow-gray-400 transition-all duration-200 text-left ${
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

      {filteredPasses.length > 0 ? (
        <Card className="overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-[#eef2f6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaFilter className="text-[#8b9eb0]" size={14} />
              <span className="text-sm font-medium text-[#0b1e3c]">
                {filter === 'all' ? 'All Passes' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Passes`}
              </span>
            </div>
            <span className="text-xs text-[#5b6f87]">
              Showing {filteredPasses.length} of {passes.length} entries
            </span>
          </div>
          <Table columns={columns} data={filteredPasses} searchable={true} emptyMessage="No passes found" />
        </Card>
      ) : (
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#f5f9ff] flex items-center justify-center">
              <FaPassport className="text-[#8b9eb0]" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-[#0b1e3c]">No Passes Found</h3>
            <p className="text-sm text-[#5b6f87] max-w-sm">
              {filter === 'all' ? 'No passes have been generated yet.' : `No ${filter} passes found.`}
            </p>
            {filter === 'all' && (
              <Link to="/appointments">
                <Button variant="primary" className="mt-2">Go to Appointments to Generate Passes</Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

export default Passes
