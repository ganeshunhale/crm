import { memo, useState } from "react"
import { data, Link, useNavigate } from "react-router-dom"
import { REGISTER_MT5_USER_API, REGISTER_USER_API } from "../../API/ApiServices"
export default function Register() {

  console.log("ho")
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
    phone_no: "",
    city: "",
    country: "",
    address: "",
    state: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)
 const navigate =useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirm_password) {
      setToast({
        title: "Error",
        description: "Passwords do not match",
        type: "error",
      })
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        event: "register",
        data: formData,
      }

      console.log("Registration payload:", payload)
      const Registration =await REGISTER_USER_API(payload)
      console.log(Registration.status,Registration.data.status,Registration.status == 201 , Registration.data.status == 'success')
      if(Registration.status == 201 && Registration.data.status == 'success'){

        let newPayload = {
          event: "demoAccount",
          data: {
            user_id: Number(Registration.data.result.user_id), // dynamic user_id
            first_name: payload.data.first_name,
            last_name: payload.data.last_name,
            phone_no: payload.data.phone_no,
            city: payload.data.city,
            country: payload.data.country,
            address: payload.data.address,
            state: payload.data.state,
            password: payload.data.password,
          }
        };
        const MT5UserRegistration = await REGISTER_MT5_USER_API(newPayload)
        console.log(MT5UserRegistration)
        navigate("/")
      }
      setToast({
        title: "Registration Attempted",
        description: "Check console for payload structure",
        type: "success",
      })
    } catch (error) {
      setToast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gray-900 text-white p-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          } text-white max-w-sm`}
        >
          <h4 className="font-semibold">{toast.title}</h4>
          <p className="text-sm opacity-90">{toast.description}</p>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img src="/sgfx-logo.png" alt="SGFX Logo" width={120} height={40} className="h-12 w-auto" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Trading Account</h1>
            <p className="text-gray-400">Join thousands of professional traders</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">First Name</label>
                <input
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 h-12 px-4 rounded-md focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Last Name</label>
                <input
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 h-12 px-4 rounded-md focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 h-12 px-4 rounded-md focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Phone Number</label>
              <input
                name="phone_no"
                type="tel"
                placeholder="+91986715437"
                value={formData.phone_no}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 h-12 px-4 rounded-md focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
              />
            </div>

            {/* Address Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Country</label>
                <input
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 h-12 px-4 rounded-md focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">State</label>
                <input
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 h-12 px-4 rounded-md focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">City</label>
                <input
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 h-12 px-4 rounded-md focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 px-4 py-3 rounded-md focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none resize-none"
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 h-12 px-4 rounded-md focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Confirm Password</label>
                <input
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 h-12 px-4 rounded-md focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white h-12 font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                "Create Trading Account"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-green-500 hover:text-green-400 hover:underline transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
