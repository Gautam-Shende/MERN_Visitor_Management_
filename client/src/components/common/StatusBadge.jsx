
import React from 'react'
import {
  FaRegClock,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaSignInAlt,
  FaUserTie,
  FaUserCheck,
  FaShieldAlt,
  FaUser
} from 'react-icons/fa'

const StatusBadge = ({
  status,
  type = 'appointment',
  size = 'md',
  showIcon = true,
  className = ''
}) => {


  const iconMap = {
    approved: <FaCheckCircle size={12} />,
    active: <FaCheckCircle size={12} />,
    pending: <FaHourglassHalf size={12} />,
    requested: <FaRegClock size={12} />,
    rejected: <FaTimesCircle size={12} />,
    expired: <FaTimesCircle size={12} />,
    inside: <FaSignInAlt size={12} />,

    admin: <FaUserTie size={12} />,
    employee: <FaUserCheck size={12} />,
    security: <FaShieldAlt size={12} />,
    visitor: <FaUser size={12} />
  }

  const icon = iconMap[status] || <FaRegClock size={12} />


  const baseStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-gray-50 text-gray-700 border-gray-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',

    admin: 'bg-purple-50 text-purple-700 border-purple-200',
    employee: 'bg-green-50 text-green-700 border-green-200',
    security: 'bg-red-50 text-red-700 border-red-200',
    visitorRole: 'bg-blue-50 text-blue-700 border-blue-200'
  }

  const statusConfig = {
    appointment: {
      approved: { style: 'success', label: 'Approved' },
      pending: { style: 'warning', label: 'Pending' },
      rejected: { style: 'danger', label: 'Rejected' },
      requested: { style: 'yellow', label: 'Request Sent' }
    },
    pass: {
      active: { style: 'success', label: 'Active' },
      inside: { style: 'info', label: 'Inside' },
      expired: { style: 'neutral', label: 'Expired' }
    },
    visitor: {
      approved: { style: 'success', label: 'Approved' },
      pending: { style: 'warning', label: 'Pending' },
      requested: { style: 'yellow', label: 'Requested' },
      rejected: { style: 'danger', label: 'Rejected' }
    },
    role: {
      admin: { style: 'admin', label: 'Admin' },
      employee: { style: 'employee', label: 'Employee' },
      security: { style: 'security', label: 'Security' },
      visitor: { style: 'visitorRole', label: 'Visitor' }
    }
  }

  const current =
    statusConfig[type]?.[status] || {
      style: 'neutral',
      label: status || 'Unknown'
    }

  const sizeMap = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-1.5'
  }

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-lg border
        ${baseStyles[current.style]}
        ${sizeMap[size]}
        ${className}
      `}
    >
      {showIcon && <span>{icon}</span>}
      {current.label}
    </span>
  )
}

export default StatusBadge