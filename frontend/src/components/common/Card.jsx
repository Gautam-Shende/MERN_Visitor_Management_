import React from 'react'
// import { useState } from 'react'

const Card = ({
   children, 
   className = '',
  padding = 'md',
   border = true,
    shadow = 'md'
   }) => {
    //
  const paddings = {
    none: 'p-0',
    // sm: 'p-2',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return (
    <div 
      className={`
        bg-white rounded-xl 
        ${border ? 'border border-[#eef2f6]' : ''} 
        ${shadows[shadow]} 
        ${paddings[padding]} 
        ${className}
      `}
      style={{ 
        background: 'linear-gradient(180deg, #ffffff 0%, #fafcff 100%)',
      }}
    >
      {children}
    </div>
  );
};

export default Card;