
import React from "react"

import {
  FaRegClock, FaHourglassHalf,
  FaCheckCircle, FaTimesCircle,
  FaSignInAlt,
  FaUserTie,FaUserCheck,
  FaShieldAlt, FaUser
} from 'react-icons/fa'

// const StatusBadge = (status) => {
const StatusBadge = ({ status }) => {

  let bgColor;
  let textColor;
  let icon;
  
  // i added for the default requested status appointments
  if(status === "requested") {
     bgColor = "bg-yellow-50 ";
     textColor = "text-yellow-700";
     icon = <FaRegClock className="mr-1"/>;
  }

  if (status === "approved") {
    bgColor = "bg-green-100";
    textColor = "text-green-700";
    icon = <FaCheckCircle className="mr-1" />;
  }

  if (status === "pending" ) {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-700";
    icon = <FaHourglassHalf className="mr-1" />;
  }

  if (status === "rejected" ) {
    bgColor = "bg-red-100";
    textColor = "text-red-700";
    icon = <FaTimesCircle className="mr-1" />;
  }

  // for active pass STATUS "inside"
  if (status === "active" ) {
    bgColor = "bg-green-100";
    textColor = "text-green-700";
    icon = <FaCheckCircle className="mr-1" />;
  }
  if (status === "inside" ) {
    bgColor = "bg-blue-100";
    textColor = "text-blue-700";
    icon = <FaSignInAlt className="mr-1" />;
  }

  if (status === "expired" ) {
    bgColor = "bg-gray-200";
    textColor = "text-gray-700";
    icon = <FaTimesCircle className="mr-1" />;
  }
 
  // profile badge for users like admin, employee, security, visitor
  if(status === "admin") {
     bgColor = "bg-blue-100 ";
     textColor = "text-blue-700";
     icon = <FaUserTie className="mr-1"/>;
  }

  if (status === "employee") {
    bgColor = "bg-green-100";
    textColor = "text-green-700";
    icon = <FaUserCheck className="mr-1" />;
  }

  if (status === "security" ) {
    bgColor = "bg-orange-100";
    textColor = "text-orange-700";
    icon = <FaShieldAlt className="mr-1" />;
  }

  if (status === "visitor" ) {
    bgColor = "bg-purple-200";
    textColor = "text-purple-700";
    icon = <FaUser className="mr-1" />;
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${bgColor} ${textColor}`}>
     {icon}
      {status}
    </span>
  );
};

export default StatusBadge;