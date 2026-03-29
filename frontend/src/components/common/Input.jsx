import React from 'react'
// import { FaExclamationCircle } from 'react-icons/fa'

const Input = ({ 
  label, 
  className = '', 
  icon, 
  helperText,
  required,
  ...props 
}) => {
  return (
    <div className="mb-5">
      {label && (
        // <label className="flex text-[#0b1e3c] mb-1">
        <label className="block text-sm font-medium text-[#0b1e3c] mb-1">
          {label}
          {required && <span className="text-[#ec3c3c] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7d8a96]">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full rounded-xl text-sm transition-all duration-200
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
             border border-[#d8dbde] focus:border-[#2463eb] focus:ring-[#2463eb]
            focus:outline-none focus:ring-1 focus:ring-opacity-20
            placeholder:text-[#8b9eb0] text-[#1e293b] 
            ${className}
          `}
          {...props}
        />
        {/* {error && ( */}
          {/* <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <FaExclamationCircle className="text-[#ec3c3c]" size={16} />
          </div> */}
        {/* )} */}
      </div>
      {/* {error && (
        <p className="mt-1.5 text-sm text-[#ec3c3c] flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}  */}
       {/* {helperText && !error && ( 
        <p className="mt-1.5 text-xs text-[#5b6f87]">{helperText}</p>
       )}  */}
    </div>
  );
};

export default Input;