import React from "react"
import {
  CARD_BASE,
  CARD_BORDER,
  CARD_PADDINGS,
  CARD_SHADOWS,
  CARD_GRADIENT,
} from "../../utils/constants.js"

const Card = ({
  children,
  className = "",
  padding = "md",
  border = true,
  shadow = "md",
}) => {
  return (
    <div
      className={`${CARD_BASE} ${border ? CARD_BORDER : ""} ${CARD_SHADOWS[shadow]} ${CARD_PADDINGS[padding]} ${className}`}
      style={{ background: CARD_GRADIENT }}
    >
      {children}
    </div>
  )
}

export default Card;
