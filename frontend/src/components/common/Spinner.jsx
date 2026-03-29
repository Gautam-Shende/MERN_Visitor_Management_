import React from 'react'
// import { useEffect } from 'react'

const Spinner = ({ size = 'xl', color = 'primary', text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2 border-dotted',
    md: 'w-8 h-8 border-4 border-dotted',
    // lg: 'w-9 h-10 border-4',
    lg: 'w-12 h-12 border-5 border-dotted',
    xl: 'w-16 h-16 border-7 border-dotted',
  }
  // const texts = {
  //   sm: 'w-4 h-4 border-3',
  //   md: 'w-8 h-8 border-5',
  //   // lg: 'w-9 h-10 border-4',
  //   lg: 'w-12 h-12 border-6',
  //   xl: 'w-16 h-16 border-7',
  // }

  const colors = {
    primary: 'border-t-[#2463eb] border-[#e2eaf5]',
    success: 'border-t-[#22b455] border-[#d1f0db]',
    danger: 'border-t-[#ec3c3c] border-[#fcd7d7]',
    warning: 'border-t-[#f59e0b] border-[#fee6cc]',
    light: 'border-t-[#ffffff] border-[#eef2f6]',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`
        ${sizes[size]} 
        ${colors[color]} 
        rounded-full animate-spin
      `}>
        {/* ${text} */}
      </div>
      {text && (
        <p className="text-lg font-bold text-[#5b6f87] animate-pulse">
          {text}
          </p>
      )}
    </div>
  );
};

export default Spinner