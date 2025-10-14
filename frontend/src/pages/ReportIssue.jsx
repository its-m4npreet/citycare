import { useState } from 'react'
import { FiCamera, FiMapPin, FiAlertCircle } from 'react-icons/fi'

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    urgency: 'medium',
    image: null
  })

  const categories = [
    'Potholes',
    'Street Lights',
    'Garbage Collection',
    'Water Supply',
    'Drainage',
    'Public Property Damage',
    'Other'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Report submitted:', formData)
    // Add API call here
    alert('Issue reported successfully!')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Report an Issue</h1>
          <p className="text-gray-600">Help improve your community by reporting civic problems</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief description of the issue"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about the issue"
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location or use current location"
                  required
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <FiMapPin className="absolute left-3 top-4 text-gray-400" />
              </div>
              <button
                type="button"
                className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
              >
                📍 Use my current location
              </button>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Urgency Level
              </label>
              <div className="flex gap-4">
                {['low', 'medium', 'high', 'critical'].map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      value={level}
                      checked={formData.urgency === level}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className={`capitalize text-sm font-medium ${
                      level === 'critical' ? 'text-red-600' :
                      level === 'high' ? 'text-orange-600' :
                      level === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                <FiCamera className="mx-auto text-gray-400 text-4xl mb-3" />
                <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="mt-4 inline-block px-4 py-2 bg-green-50 text-green-600 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                >
                  Choose File
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FiAlertCircle />
                Submit Report
              </button>
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <span className="text-blue-600 text-xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">What happens next?</h3>
              <p className="text-sm text-blue-700">
                Your report will be reviewed by local authorities within 24-48 hours. 
                You'll receive updates via notifications and can track the status in "My Reports".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
