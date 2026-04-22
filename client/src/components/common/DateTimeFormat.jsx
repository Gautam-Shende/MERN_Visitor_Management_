
import React from 'react'
import { FaCalendarAlt, FaClock } from 'react-icons/fa'

const DateTimeFormat = ({
  date,
  type = 'datetime',  
  format = 'short',  
  showIcon = true,
  iconSize = 12,
  className = '',
  emptyText = 'N/A'
}) => {
  
  const formatDate = (inputDate) => {
    if (!inputDate) return emptyText
    
    try {
      const dateObj = new Date(inputDate);
      
      if (format === 'short') {
        return dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }
      
      if (format === 'long') {
        return dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      }
      
      if (format === 'full') {
        return dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      }
      
      return dateObj.toLocaleDateString('en-US')
      
    } catch {
      return 'Invalid date'
    }
  }

  const formatTime = (inputDate) => {
    if (!inputDate) return emptyText
    
    try {
      const dateObj = new Date(inputDate)
      
      return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
    } catch {
      return "Invalid Date Time Format..."
    }
  }

  const formatDateTime = (inputDate) => {
    if (!inputDate) return { date: emptyText, time: emptyText }
    
    try {
      const dateObj = new Date(inputDate)
      
      return {
        date: dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        time: dateObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      
    } catch {
      return { date: 'Invalid date', time: 'Invalid time' }
    }
  }


  if (type === 'date') {
    const formattedDate = formatDate(date)
    
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {showIcon && <FaCalendarAlt size={iconSize} className="text-gray-400" />}
        <span className="text-sm text-gray-700">{formattedDate}</span>
      </div>
    )
  }

  if (type === 'time') {
    const formattedTime = formatTime(date)
    
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {showIcon && <FaClock size={iconSize} className="text-gray-400" />}
        <span className="text-sm text-gray-700">{formattedTime}</span>
      </div>
    )
  }

  const { date: formattedDate, time: formattedTime } = formatDateTime(date)
  
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-1.5">
        {showIcon && <FaCalendarAlt size={iconSize} className="text-gray-400" />}
        <span className="text-sm font-medium text-gray-800">{formattedDate}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-0.5">
        {showIcon && <FaClock size={iconSize} className="text-gray-400" />}
        <span className="text-xs text-gray-500">{formattedTime}</span>
      </div>
    </div>
  )
}

export default DateTimeFormat