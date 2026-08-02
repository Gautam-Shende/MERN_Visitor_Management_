
import { 
  FaRegClock, 
  FaHourglassHalf, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaInfoCircle 
} from 'react-icons/fa'


export const ROLES = {
  ADMIN: 'admin',
  SECURITY: 'security',
  EMPLOYEE: 'employee',
  VISITOR: 'visitor',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REQUESTED: "requested"
};

export const APPOINTMENT_STATUS_BADGE = {
  requested: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    icon: "FaRegClock",
    label: "Request Sent",
    description: "Employee will confirm date & time soon",
  },
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: "FaHourglassHalf",
    label: "Pending Approval",
    description: "Waiting for admin approval",
  },
  approved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: "FaCheckCircle",
    label: "Approved",
    description: "Your pass is ready",
  },
  rejected: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: "FaTimesCircle",
    label: "Rejected",
    description: "Please contact support",
  },
  default: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    icon: "FaInfoCircle",
    label: "Unknown",
    description: "Contact support",
  },
}

export const DATE_FORMAT = {
  fullDate: {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  },
  
  fullTime: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  },

  shortDate: {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  },

  dateOnly: {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  },

  timeOnly: {
    hour: '2-digit',
    minute: '2-digit'
  }
}

export const DEFAULT_MESSAGES = {
  invalidDate: 'Invalid date',
  invalidTime: 'Invalid time'
}

export const PASS_STATUS = {
  ACTIVE: 'active',
  INSIDE: 'inside',
  EXPIRED: 'expired',
};


export const BUTTON_BASE = "rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"

export const BUTTON_VARIANTS = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600 shadow-sm hover:shadow",
  secondary: "bg-gray-300 text-gray-700 border border-gray-200 hover:bg-gray-400 hover:text-gray-900 focus:ring-gray-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm hover:shadow",
  success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-600 shadow-sm hover:shadow",
  outline: "border-1 border-blue-600 text-blue-600 hover:bg-blue-50",
  ghost: "text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:ring-gray-500",
}

export const BUTTON_SIZES = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2.5",
}

export const CARD_BASE = "bg-white rounded-xl"
export const CARD_BORDER = "border border-[#eef2f6]"
export const CARD_GRADIENT = "linear-gradient(180deg, #ffffff 0%, #fafcff 100%)"

export const CARD_PADDINGS = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
}

export const CARD_SHADOWS = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
}

export const INPUT_BASE = "w-full rounded-xl text-sm transition-all duration-200 border border-[#d8dbde] focus:border-[#2463eb] focus:ring-[#2463eb] focus:outline-none focus:ring-1 focus:ring-opacity-20 placeholder:text-[#8b9eb0] text-[#1e293b] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200"
export const INPUT_LABEL = "block text-sm font-medium text-[#0b1e3c] mb-1"
export const INPUT_REQUIRED_STAR = "text-[#ec3c3c] ml-1"
export const INPUT_ICON_WRAPPER = "absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7d8a96]"
export const INPUT_WITH_ICON = "pl-10"
export const INPUT_WITHOUT_ICON = "pl-4"
export const INPUT_PADDING = "pr-4 py-3"

export const SPINNER_WRAPPER = "flex flex-col items-center justify-center gap-3"
export const SPINNER_TEXT = "text-lg font-bold text-[#5b6f87] animate-pulse"

export const SPINNER_SIZES = {
  sm: "w-4 h-4 border-2 border-dotted",
  md: "w-8 h-8 border-4 border-dotted",
  lg: "w-12 h-12 border-5 border-dotted",
  xl: "w-16 h-16 border-7 border-dotted",
}

export const SPINNER_COLORS = {
  primary: "border-t-[#2463eb] border-[#e2eaf5]",
  success: "border-t-[#22b455] border-[#d1f0db]",
  danger: "border-t-[#ec3c3c] border-[#fcd7d7]",
  warning: "border-t-[#f59e0b] border-[#fee6cc]",
  light: "border-t-[#ffffff] border-[#eef2f6]",
}

export const TABLE_HEADER_BG = "bg-[#f8fafd]"
export const TABLE_HEADER_CELL = "px-6 py-4 text-left text-xs font-semibold text-[#5b6f87] uppercase tracking-wider"
export const TABLE_BODY_CELL = "px-6 py-4 whitespace-nowrap text-sm text-[#1e293b]"
export const TABLE_DIVIDER = "divide-y divide-[#eef2f6]"
export const TABLE_ROW_HOVER = "hover:bg-[#f5f9ff] transition-colors duration-150"
export const TABLE_CURSOR_POINTER = "cursor-pointer"
export const TABLE_FOOTER_BG = "bg-[#f8fafd]"
export const TABLE_FOOTER_BORDER = "border-t border-[#eef2f6]"
export const TABLE_FOOTER_TEXT = "px-6 py-3 text-xs text-[#5b6f87]"




