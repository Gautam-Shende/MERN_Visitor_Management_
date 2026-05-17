
import React from 'react'
import { FaCalendarAlt, 
  FaClock } from 'react-icons/fa'

const DateTimeFormat = ({
  date,
  type = 'datetime',
  format = 'short',
  showIcon = true,
  iconSize = 12,
  className = '',
  emptyText = 'N/A'
}) => {

  if (!date) { 
    return <span>{emptyText}</span>
  }

  const dateObj = new Date(date)

  if (isNaN(dateObj)){
     return <span>Invalid date</span>
  }

  const StatusDate = dateObj.toLocaleDateString('en-US', {
    // it will show like Thursday, May 5, 2026 , 
    ...(format === 'long' && {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    // just show date format like 5/5/2026
    ...(format === 'short' && {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  })

  const StatusTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  if (type === 'date') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {showIcon && <FaCalendarAlt size={iconSize} className="text-gray-400" />}
        <span className="text-gray-700">{StatusDate}</span>
      </div>
    )
  }

  if (type === 'time') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {showIcon && <FaClock size={iconSize} className="text-gray-400" />}
        <span className="text-gray-700">{StatusTime}</span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-1.5">
        {showIcon && <FaCalendarAlt size={iconSize} className="text-gray-400" />}
        <span className="text-sm font-medium text-gray-800">{StatusDate}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-0.5">
        {showIcon && <FaClock size={iconSize} className="text-gray-400" />}
        <span className="text-xs text-gray-500">{StatusTime}</span>
      </div>
    </div>
  )
}

export default DateTimeFormat