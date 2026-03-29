import React from 'react'
// import { useState } from 'react';

const Button = ({
  children,
  // variant = "",
  // size = "",
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const base = "rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center";
  //
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600 shadow-sm hover:shadow",
      secondary:"bg-gray-300 text-gray-700 border border-gray-200 hover:bg-gray-400 hover:text-gray-900 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm hover:shadow",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-600 shadow-sm hover:shadow",
    outline: "border-1 border-blue-600 text-blue-600 ",
    ghost: "text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:ring-gray-500",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  }

  return (
    <button
      className={`
        ${base} 
        ${variants[variant]}
         ${sizes[size]} 
         ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button;
