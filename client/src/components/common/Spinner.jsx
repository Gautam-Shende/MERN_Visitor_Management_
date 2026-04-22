
import React from "react"
import {
  SPINNER_WRAPPER,
  SPINNER_TEXT,
  SPINNER_SIZES,
  SPINNER_COLORS,
} from "../../utils/constants.js"

const Spinner = ({ 
  size = "xl", 
  color = "primary", text = "" }) => {

  return (
    <div className={SPINNER_WRAPPER}>
      <div
        className={`${SPINNER_SIZES[size]} ${SPINNER_COLORS[color]} rounded-full animate-spin`}
      />
      {text && <p className={SPINNER_TEXT}>{text}</p>}
    </div>
  )
}

export default Spinner;
