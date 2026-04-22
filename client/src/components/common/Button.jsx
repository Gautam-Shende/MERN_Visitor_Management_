
import React from "react"
// import { useState } from "react"
import { BUTTON_BASE, BUTTON_VARIANTS, BUTTON_SIZES } from "../../utils/constants.js"

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button;
