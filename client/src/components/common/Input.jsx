
import React from "react"
// import {FaUser} from "react-icons/fa"

import {
  INPUT_BASE,
  INPUT_LABEL,
  INPUT_REQUIRED_STAR,
  INPUT_ICON_WRAPPER,
  INPUT_WITH_ICON,
  INPUT_WITHOUT_ICON,
  INPUT_PADDING,
} from "../../utils/constants.js"

const Input = ({
  label,
  className = "",
  icon,
  helperText,
  required,
  ...props
}) => {
  return (
    <div className="mb-5">
      {label && (
        <label className={INPUT_LABEL}>
          {label}
          {required && <span className={INPUT_REQUIRED_STAR}>*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <div className={INPUT_ICON_WRAPPER}>{icon}</div>}
        <input
          className={`${INPUT_BASE} ${icon ? INPUT_WITH_ICON : INPUT_WITHOUT_ICON} ${INPUT_PADDING} ${className}`}
          {...props}
        />
      </div>
    </div>
  )
}

export default Input;
