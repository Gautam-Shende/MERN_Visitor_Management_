
import { useState, useEffect } from 'react'
import { fetchVisitorReport } from '../../services/reportService'

import { exportToCSV, exportToExcel } from '../../services/exportService'

// common component's this
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'
import StatusBadge from '../../components/common/StatusBadge'
import DateTimeFormat from '../../components/common/DateTimeFormat'

import {
  FaFileCsv, FaFileExcel, FaChartBar, FaFilter,
  FaSearch,
} from 'react-icons/fa'  


import toast from 'react-hot-toast'

const Reports = () => {
  const [filters, setFilters] = useState({ name: '', phone: '', status: 'all' })
  const [reportData, setReportData] = useState([])
  
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  
  const [exporting, setExporting] = useState({ csv: false, excel: false })
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() =>
       setPageLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
    setError('')
  }

  const fetchReport = async () => {
    setLoading(true)
    // setError(null)
    setError('')
    try {
      const cleanFilters = {}

      if (filters.name?.trim())  { 
        cleanFilters.name   = filters.name.trim()

      }
      if (filters.phone?.trim()) {
         cleanFilters.phone  = filters.phone.trim()
      }
      if (filters.status !== 'all') {
        cleanFilters.status = filters.status
      }

      const data = await fetchVisitorReport(cleanFilters)

      if (Array.isArray(data)) {
        setReportData(data)
        toast.success(data.length === 0 ? 'No visitors found' : `Found ${data.length} visitors`)
      } else {
        setReportData([])
        // console.log("Data fetching problems....")
        toast.error('Invalid response format')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch report'
      // console.log(msg)
      setError(msg)
      toast.error(msg)
      setReportData([])
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = async (visitorId) => {
    // setExporting(cdv: data)
    setExporting((prev) => ({ ...prev, csv: true }))
    try {
      await exportToCSV(visitorId)
      // console.log(exportToCSV(visitorId))
      toast.success('CSV export started')
    } catch (err) {
      // console.log(err.response?.data?.message)
      toast.error(err.response?.data?.message || 'CSV export failed')
    } finally {
      setExporting((prev) => ({ ...prev, csv: false }))
    }
  }

  const handleExportExcel = async (visitorId) => {
    setExporting((prev) => ({ ...prev, excel: true }))
    try {
      await exportToExcel(visitorId)
      // console.log(exportToExcel(visitorId))
      toast.success('Excel export started')
    } catch (err) {
      // console.log(error.response?.data?.message)
      toast.error(err.response?.data?.message || 'Excel export failed')
    } finally {
      setExporting((prev) => ({ ...prev, excel: false }))
    }
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
    },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Appointment Status',
      accessor: 'appointmentStatus',
      cell: (row) => <StatusBadge status={row.status} type="appointment" size="sm" />,
    },
    {
      header: 'Appointment Date',
      accessor: 'appointmentDate',
      cell: (row) => row.appointmentDate
        ? <DateTimeFormat date={row.appointmentDate} type="date" format="short" showIcon={false} />
        : <span className="text-[#8b9eb0]">—</span>,
    },
    {
      header: 'Host',
      accessor: 'host',
      cell: (row) => row.host?.name || <span className="text-[#8b9eb0]">N/A</span>,
    },
    {
      header: 'Check In',
      accessor: 'checkInTime',
      cell: (row) => row.checkInTime
        ? <DateTimeFormat date={row.checkInTime} type="datetime" format="short" showIcon={false} />
        : <span className="text-[#8b9eb0]">—</span>,
    },
    {
      header: 'Check Out',
      accessor: 'checkOutTime',
      cell: (row) => row.checkOutTime
        ? <DateTimeFormat date={row.checkOutTime} type="datetime" format="short" showIcon={false} />
        : <span className="text-[#8b9eb0]">—</span>,
    },
    {
      header: 'Export',
      accessor: 'export',
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleExportCSV(row._id)}
            disabled={exporting.csv}
            className="text-green-600 hover:text-green-800 flex items-center gap-1 text-xs"
          >
            <FaFileCsv size={20} /> CSV
          </button>
          <button
            onClick={() => handleExportExcel(row._id)}
            disabled={exporting.excel}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
          >
            <FaFileExcel size={20} /> Excel
          </button>
        </div>
      ),
    },
  ]

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" text="Loading Reports..." />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0b1e3c] mb-1">Reports</h1>
        <p className="text-sm text-[#5b6f87]">Generate visitor reports</p>
      </div>

      <Card className="mb-6 overflow-hidden">
        <div className="bg-[#2463eb] px-6 py-4">
          <div className="flex items-center gap-3">
            <FaFilter className="text-white" size={18} />
            <h2 className="text-lg font-semibold text-white">Filter Visitors</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              name="name"
              placeholder="Search by name"
              value={filters.name}
              onChange={handleChange}
              disabled={loading}
              icon={<FaSearch size={14} />}
            />
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl text-sm bg-[#f5f9ff] border border-[#e2eaf5] px-4 py-3 text-[#1e293b] focus:border-[#2463eb] focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="checkin">Check-in</option>
              <option value="checkout">Check-out</option>
            </select>
          </div>

          <div className="mt-4">
            <Button onClick={fetchReport} disabled={loading} variant="primary">
              {loading ? <Spinner size="sm" color="light" text="Generating..." /> : <><FaChartBar size={14} className="mr-2" /> Generate Report</>}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-[#fee9e7] border border-[#fccac4] rounded-xl">
              <p className="text-sm text-[#cc2e2e]">{error}</p>
            </div>
          )}
        </div>
      </Card>

      {reportData.length > 0 ? (
        <Card className="overflow-hidden p-0">
          <div className="px-6 py-4 border-b flex justify-between">
            <span className="font-medium">Report Results</span>
            <span className="text-xs text-gray-500">Found {reportData.length} visitors</span>
          </div>
          <Table columns={columns} data={reportData} />
        </Card>
      ) : (
        !loading && !error && (
          <Card className="text-center py-16">
            <FaChartBar className="text-gray-300 text-5xl mx-auto mb-3" />
            <p className="text-gray-500">No data to display. Generate a report above.</p>
          </Card>
        )
      )}
    </div>
  )
}

export default Reports
