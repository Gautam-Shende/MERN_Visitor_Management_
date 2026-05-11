import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import Button from "../../components/common/Button"
import Input from "../../components/common/Input"
import Card from "../../components/common/Card"
import Spinner from "../../components/common/Spinner"

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaInfoCircle,
  FaLock,
  FaCamera,
  FaShieldAlt,
  FaUserPlus,
} from "react-icons/fa"

import toast from "react-hot-toast"
import { registerVisitor } from "../../services/visitorAuthService"

const VisitorRegister = () => {
  // form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
    password: "",
    confirmPassword: "",
  })
  
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}

    // name - empty check only
    if (!form.name?.trim()) {
      newErrors.name = "Name is required"
    }

    // email - empty check only (backend will validate format)
    if (!form.email?.trim()) {
      newErrors.email = "Email is required"
    }

    // phone - empty check only (any format allowed)
    if (!form.phone?.trim()) {
      newErrors.phone = "Phone number is required"
    }

    // purpose - empty check only
    if (!form.purpose?.trim()) {
      newErrors.purpose = "Purpose of visit is required"
    }

    // password - basic length check (backend bhi check karega)
    if (!form.password) {
      newErrors.password = "Password is required"
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // confirm password - user experience ke liye
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" })
    }
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      // size check - 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size must be less than 5MB")
        return
      }
      // type check
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file")
        return
      }
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill all required fields")
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("name", form.name)
    formData.append("email", form.email)
    formData.append("phone", form.phone)
    formData.append("purpose", form.purpose)
    formData.append("password", form.password)
    
    if (photo) {
      formData.append("photo", photo)
    }

    try {
      await registerVisitor(formData)
      toast.success("Registration successful! Please login.")
      navigate("/visitor/login")
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed. Please try again."
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl p-0 overflow-hidden shadow-lg rounded-xl">
        
        {/* header */}
        <div className="bg-blue-600 px-4 py-4 text-center">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
            <FaShieldAlt className="text-white text-lg" />
          </div>
          <h2 className="text-xl font-bold text-white">Create Account</h2>
          <p className="text-blue-100 text-sm mt-1">Register as a visitor</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* left column */}
            <div className="space-y-4">
              <Input
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                icon={<FaUser className="text-blue-500" />}
                error={errors.name}
                required
              />
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                icon={<FaEnvelope className="text-blue-500" />}
                error={errors.email}
                required
              />
              <Input
                name="phone"
                label="Phone Number"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                icon={<FaPhone className="text-blue-500" />}
                error={errors.phone}
                required
              />
            </div>

            {/* right column */}
            <div className="space-y-4">
              <Input
                name="purpose"
                label="Purpose of Visit"
                placeholder="e.g., Meeting, Interview"
                value={form.purpose}
                onChange={handleChange}
                icon={<FaInfoCircle className="text-blue-500" />}
                error={errors.purpose}
                required
              />
              <Input
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                icon={<FaLock className="text-blue-500" />}
                error={errors.password}
                required
              />
              <Input
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                icon={<FaLock className="text-blue-500" />}
                error={errors.confirmPassword}
                required
              />
            </div>
          </div>

          {/* photo upload */}
          <div className="mt-5 pt-3 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-500">
                  <FaCamera className="text-blue-500 text-lg" />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("photo-upload").click()}
                className="border border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <FaCamera className="mr-2" /> Choose Photo
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFile}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">JPG, PNG (Max 5MB)</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-base font-semibold mt-5"
          >
            {loading ? (
              <Spinner size="sm" color="light" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FaUserPlus /> Create Account
              </span>
            )}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/visitor/login" className="text-blue-600 font-semibold hover:text-blue-700">
              Sign In
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}

export default VisitorRegister