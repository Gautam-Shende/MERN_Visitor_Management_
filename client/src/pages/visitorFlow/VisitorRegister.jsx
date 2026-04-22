
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
  // FaArrowRight,
  FaShieldAlt,
  FaUserPlus,
} from "react-icons/fa"

import toast from "react-hot-toast"

import { registerVisitor } from "../../services/visitorAuthService";
// import { loginVisitor } from "../../services/visitorAuthService"

const VisitorRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
    password: "",
    confirmPassword: "",
  });
  const [photo, setPhoto] = useState(null)
  // const [photoPreview, setPhotoPreview] = useState([])
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()


  const validateForm = () => {
    const newErrors = {};

    // if (!form.name) {
    if (!form.name.trim()) {
  newErrors.name = "Name is required"
}

// if (!form.email) {
if (!form.email.trim()) {
  newErrors.email = "Email is required"
} else if (!/\S+@\S+\.\S+/.test(form.email)) {
  newErrors.email = "Email is invalid"
}

// if (!form.phone) {
if (!form.phone.trim()) {
  newErrors.phone = "Phone number is required"

} else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
  newErrors.phone = "Phone number must be 10 digits"
}

// if (!form.purpose) {
//   newErrors.purpose = "Purpose of visit is required";
// }

if (!form.purpose.trim()) {
  newErrors.purpose = "Purpose of visit is required";
}

if (!form.password) {
  newErrors.password = "Password is required";
} else if (form.password.length < 6) {
  newErrors.password = "Password must be at least 6 characters";
}

if (form.password !== form.confirmPassword) {
  newErrors.confirmPassword = "Passwords do not match";
}
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" })
    }
  }


  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size must be less than 5MB");
        return;
      }
      // if (!file.type.startsWith(".png")) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("purpose", form.purpose);
    formData.append("password", form.password);
    // formData.append("confirmpassword", form.confirmpassword);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await registerVisitor(formData);
      // console.log("Registration success:", response);
      toast.success("Registration successful! Please login.");
      navigate("/visitor/login");
    } catch (err) {
      // console.error("Registration failed:", err);
      const errorMsg =
        err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      // setTimeout(() => {
      //   setLoading(false);
      // }, 1000)
      setLoading(false);
    }
  }

 return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-3 sm:p-4">
      <Card className="w-full max-w-[95%] sm:max-w-md md:max-w-2xl p-0 overflow-hidden shadow-lg rounded-lg">
        
        <div className="bg-blue-600 px-3 sm:px-4 py-2 sm:py-3 text-center rounded-xl">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-1">
            <FaShieldAlt className="text-white text-sm sm:text-base" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">Create Account</h2>
          <p className="text-blue-100 text-[11px] sm:text-xs">Register as a visitor</p>
        </div>

        <form onSubmit={handleSubmit} className="p-3 sm:p-4">
          {/* <div className="flex flex-col md;flex-col-2 gap-3"> */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-3">
            <div className="space-y-3">
              <Input
                name="name"
                label="Full Name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                icon={<FaUser className="text-blue-500 text-xs" />}
                error={errors.name}
                required
                className="text-sm"
              />
              <Input
                name="email"
                type="email"
                label="Email"
                placeholder="mail@.com"
                value={form.email}
                onChange={handleChange}
                icon={<FaEnvelope className="text-blue-500 text-xs" />}
                error={errors.email}
                required
                className="text-sm"
              />
              <Input
                name="phone"
                label="Phone"
                placeholder="+9100000000"
                value={form.phone}
                onChange={handleChange}
                icon={<FaPhone className="text-blue-500 text-xs" />}
                error={errors.phone}
                required
                className="text-sm"
              />
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <Input
                name="purpose"
                label="Purpose"
                placeholder="Meeting / Interview"
                value={form.purpose}
                onChange={handleChange}
                icon={<FaInfoCircle className="text-blue-500 text-xs" />}
                error={errors.purpose}
                required
                className="text-sm"
              />
              <Input
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                icon={<FaLock className="text-blue-500 text-xs" />}
                error={errors.password}
                required
                className="text-sm"
              />
              <Input
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                icon={<FaLock className="text-blue-500 text-xs" />}
                error={errors.confirmPassword}
                required
                className="text-sm"
              />
            </div>
          </div>

          {/* Photo Upload - Full Width */}
          <div className="mt-3 pt-2 border-t border-gray-200">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Profile Photo (Optional)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-red-500 text-white text-[10px] sm:text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-500">
                  <FaCamera className="text-blue-500 text-xs sm:text-sm" />
                </div>
              )}
              <div className="flex-1 sm:flex-none">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("photo-upload").click()
                  }
                  className="border border-blue-500 text-blue-600 hover:bg-blue-50 px-2 py-1 text-xs w-full sm:w-auto"
                >
                  <FaCamera className="mr-1 text-xs" /> Choose Photo
                </Button>
                {/* <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                  JPG, PNG (Max 5MB)
                </p> */}
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-sm font-semibold mt-3"
          >
            {loading ? (
              <Spinner size="sm" color="light" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FaUserPlus className="text-sm" /> Create Account
              </span>
            )}
          </Button>

          <p className="text-center text-xs text-gray-600 mt-2">
            Already have an account?{" "}
            <Link
              to="/visitor/login"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Sign In
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default VisitorRegister;
