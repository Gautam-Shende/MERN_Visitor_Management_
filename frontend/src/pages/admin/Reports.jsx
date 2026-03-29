import { useState, useEffect } from "react"
// import { Navlink } from 'react-dom'

import { getVisitorReport } from "../../services/reportService"

import Table from "../../components/common/Table"
import Button from "../../components/common/Button"
import Input from "../../components/common/Input"
import Card from "../../components/common/Card"
import Spinner from "../../components/common/Spinner"

import { exportToCSV, exportToExcel } from "../../services/exportService"
// import {exportVisitorReportToCsv } from "../../services/exportService"

import {
  FaFileCsv,
  FaFileExcel,
  FaChartBar,
  FaFilter,
  FaDownload,
  FaSearch,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa"

import toast from "react-hot-toast"

const Reports = () => {
  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    status: "",
    type: "",
  });
  // const [reportData, setReportData] = useState([null])
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)
  
  // const [pageLoading, setPageLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  // const [exporting, setExporting] = useState([csv: false, excel: false])
  const [exporting, setExporting] = useState({ csv: false, excel: false })
  
  const [error, setError] = useState("");

  useEffect(() => {

    const timer = setTimeout(() => {
      // setPageLoading(true)
      setPageLoading(false);
    }, 500)

    // return clearTimeout(timer)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setError("");
  };

  const fetchReport = async () => {
    setLoading(true);
    // setError(false)
    setError("")

    try {
      // const data = getVisitorReport(filters);
      const data = await getVisitorReport(filters)

      if (Array.isArray(data)) {
        setReportData(data)

        // console.log(data)
        if (data.length === 0) {

          console.log("enter Your")
          toast.success("No visitors found matching criteria");
        } else {
          toast.success(`Found ${data.length} visitors`);
        }
      } else {
        setReportData([]);
        toast.error("Invalid response format");
      }
    } catch (error) {
      // console.error("Report fetch error:", error)
      toast.error(error.message)
      //
      const errorMsg =
        error.response?.data?.message || "Failed to fetch report";
      setError(errorMsg)

      // console.log(Error)
      toast.error(errorMsg)

      setReportData([])
    } finally {
      // setTimeout(() => {
      //   setLoading(false)
      // }, 1000)

      setLoading(false)
    }
  }

  const handleExportCSV = async (visitorId) => {
    setExporting((prev) => ({ ...prev, csv: true }));
    try {
      await exportToCSV(visitorId);

      // console.log(exportToCSV(visitorId))
      toast.success("CSV export started")

    } catch (error) {
      // console.error("CSV export error:", error)
      toast.error(error.response?.data?.message || "CSV export failed");
    } finally {
      // setTimeout(() => {
      //  setExporting((prev) => ({ ...prev, csv: false }));
      // }, 1000)

      setExporting((prev) => ({ ...prev, csv: false }));
    }
  }

  const handleExportExcel = async (visitorId) => {
    // setExporting((prev) => ({ ...prev, excel: false }))
    setExporting((prev) => ({ ...prev, excel: true }));
   
    try {
      await exportToExcel(visitorId)

      // console.log(exportToExcel(visitorId))
      toast.success("Excel export started")

    } catch (error) {
      // console.error("Excel export error:", error)

      toast.error(error.response?.data?.message || "Excel export failed");
    } finally {
      // setTimeout(() => {
      //   setExporting((prev) => ({ ...prev, excel: false }));
      // }, 1000)

      setExporting((prev) => ({ ...prev, excel: false }));
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        bg: "bg-[#e6f7ee]",
        text: "text-[#0b8a4f]",
        border: "border-[#b0e3cd]",
        icon: FaCheckCircle,
      },
      pending: {
        bg: "bg-[#fef5e6]",
        text: "text-[#b45b0a]",
        border: "border-[#fed7a5]",
        icon: FaHourglassHalf,
      },
      rejected: {
        bg: "bg-[#fee9e7]",
        text: "text-[#cc2e2e]",
        border: "border-[#fccac4]",
        icon: FaTimesCircle,
      },
      checked_in: {
        bg: "bg-[#e8f0fe]",
        text: "text-[#2463eb]",
        border: "border-[#b8d1fc]",
        icon: FaCheckCircle,
      },
      checked_out: {
        bg: "bg-[#f0f2f5]",
        text: "text-[#4a5f73]",
        border: "border-[#d0d9e6]",
        icon: FaTimesCircle,
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  const columns = [
    {
      header: "Visitor",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.photo ? (
            <img
              src={row.photo}
              alt={row.name}
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#2463eb] flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {row.name?.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-[#0b1e3c]">{row.name}</p>
            <p className="text-xs text-[#5b6f87]">{row.email}</p>
          </div>
        </div>
      ),
    },
    { header: "Phone", accessor: "phone" },
    {
      header: "Check In",
      accessor: "checkInTime",
      cell: (row) => {
        if (!row.checkInTime) return <span className="text-[#8b9eb0]">—</span>;
        return (
          <div className="text-sm">
            <p className="text-[#0b1e3c]">
              {new Date(row.checkInTime).toLocaleDateString()}
            </p>
            <p className="text-xs text-[#5b6f87]">
              {new Date(row.checkInTime).toLocaleTimeString()}
            </p>
          </div>
        );
      },
    },
    {
      header: "Check Out",
      accessor: "checkOutTime",
      cell: (row) => {
        if (!row.checkOutTime) return <span className="text-[#8b9eb0]">—</span>;
        return (
          <div className="text-sm">
            <p className="text-[#0b1e3c]">
              {new Date(row.checkOutTime).toLocaleDateString()}
            </p>
            <p className="text-xs text-[#5b6f87]">
              {new Date(row.checkOutTime).toLocaleTimeString()}
            </p>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: "Host",
      accessor: "host",
      cell: (row) =>
        row.host?.name || <span className="text-[#8b9eb0]">N/A</span>,
    },
    {
      header: "Export",
      accessor: "export",
      cell: (row) => (
        <div className="flex gap-2">
          {/* CSV Export */}
          <button
            onClick={() => handleExportCSV(row._id)} 
            className="text-green-600 hover:text-green-800"
            disabled={exporting.csv}
          >
            <FaFileCsv size={24} /> <span>CSV</span>
          </button>

          {/* Excel Export */}
          <button
            onClick={() => handleExportExcel(row._id)}
            className="text-blue-600 hover:text-blue-800"
            disabled={exporting.excel}
          >
            <FaFileExcel size={24} /> <span className="">Excel</span>
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
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">

      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0b1e3c] mb-1">
          Reports
        </h1>
        <p className="text-sm text-[#5b6f87]">
          Generate and export visitor reports
        </p>
      </div>

      <Card className="mb-6 overflow-hidden">
        <div className="bg-[#2463eb] px-6 py-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <FaFilter className="text-white" size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Filter Visitors
              </h2>
              {/* <p className="text-sm text-white/80">
                Apply filters to generate 
              </p> */}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              name="name"
              placeholder="Search by name"
              value={filters.name}
              onChange={handleChange}
              icon={<FaSearch size={14} />}
            />
            {/* <Input
              name="phone"
              placeholder="Search by phone"
              value={filters.phone}
              onChange={handleChange}
              icon={<FaSearch size={14} />}
            /> */}
            <div>
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="w-full rounded-xl text-sm bg-[#f5f9ff] border border-[#e2eaf5] px-4 py-3 text-[#1e293b] focus:border-[#2463eb] focus:outline-none focus:ring-2 focus:ring-[#2463eb] focus:ring-opacity-20 transition-all duration-200"
              >
                {/* <option value="">All Status</option> */}
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                {/* <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option> */}
              </select>
            </div>
            <div>
              <select
                name="type"
                value={filters.type}
                onChange={handleChange}
                className="w-full rounded-xl text-sm bg-[#f5f9ff] border border-[#e2eaf5] px-4 py-3 text-[#1e293b] focus:border-[#2463eb] focus:outline-none focus:ring-2 focus:ring-[#2463eb] focus:ring-opacity-20 transition-all duration-200"
              >
                {/* <option value="">All Types</option> */}
                <option value="checkin">Checked In</option>
                <option value="checkout">Checked Out</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <Button
              onClick={fetchReport}
              disabled={loading}
              variant="primary"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" color="light" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FaChartBar size={14} />
                  <span>Generate Report</span>
                </div>
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-[#fee9e7] border border-[#fccac4] rounded-xl flex items-center gap-3">
              <FaTimesCircle className="text-[#cc2e2e]" size={20} />
              <p className="text-sm text-[#cc2e2e]">{error}</p>
            </div>
          )}
        </div>
      </Card>

      {reportData.length > 0 ? (
        <Card className="overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-[#eef2f6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaDownload className="text-[#8b9eb0]" size={14} />
              <span className="text-sm font-medium text-[#0b1e3c]">
                Report Results
              </span>
            </div>
            <span className="text-xs text-[#5b6f87]">
              Found <span className="font-semibold">{reportData.length}</span>{" "}
              visitors
            </span>
          </div>
          <Table columns={columns} data={reportData} />
        </Card>
      ) : (
        !loading &&
        !error && (
          <Card className="text-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#f5f9ff] flex items-center justify-center">
                <FaChartBar className="text-[#8b9eb0]" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-[#0b1e3c]">
                No Data to Display
              </h3>
              <p className="text-sm text-[#5b6f87] max-w-sm">
                Use the filters above to generate a report. The results will
                appear here.
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#8b9eb0]">
                <FaInfoCircle size={12} />
                <span>Try adjusting your search criteria</span>
              </div>
            </div>
          </Card>
        )
      )}
    </div>
  )
};

export default Reports;