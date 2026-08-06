import React from "react";

import {
  INPUT_BASE,
  INPUT_LABEL,
  INPUT_REQUIRED_STAR,
  INPUT_ICON_WRAPPER,
  INPUT_WITH_ICON,
  INPUT_WITHOUT_ICON,
  INPUT_PADDING,
} from "../../utils/constants.js";

const Input = ({
  label,
  className = "",
  icon,
  rightIcon,
  helperText,
  error,
  required,
  disabled = false,
  ...props
}) => {
  return (
    <div className="mb-5">
      {label && (
        <label className={`${INPUT_LABEL} ${disabled ? "opacity-60" : ""}`}>
          {label}
          {required && <span className={INPUT_REQUIRED_STAR}>*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div
            className={`${INPUT_ICON_WRAPPER} ${
              disabled ? "opacity-50" : ""
            }`}
          >
            {icon}
          </div>
        )}

        <input
          disabled={disabled}
          className={`
            ${INPUT_BASE}
            ${icon ? INPUT_WITH_ICON : INPUT_WITHOUT_ICON}
            ${INPUT_PADDING}
            ${rightIcon ? "pr-12" : ""}
            ${
              error
                ? "border-red-500 !focus:border-red-500 !focus:ring-red-500"
                : ""
            }
            ${className}
          `}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default Input;