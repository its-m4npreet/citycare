import { FiHome, FiPhone, FiMail, FiClock } from 'react-icons/fi'
import { MdEngineering } from 'react-icons/md'

export default function Departments() {
  const departments = [
    {
      id: 1,
      name: 'Roads & Infrastructure',
      icon: '🛣️',
      description: 'Handles road maintenance, potholes, and infrastructure repairs',
      phone: '+91 1234567890',
      email: 'roads@citycare.gov',
      openHours: 'Mon-Fri: 9:00 AM - 6:00 PM',
      activeIssues: 45,
      resolvedIssues: 234
    },
    {
      id: 2,
      name: 'Water Supply',
      icon: '💧',
      description: 'Manages water supply, pipe leaks, and quality concerns',
      phone: '+91 1234567891',
      email: 'water@citycare.gov',
      openHours: 'Mon-Sat: 8:00 AM - 8:00 PM',
      activeIssues: 12,
      resolvedIssues: 156
    },
    {
      id: 3,
      name: 'Electricity & Street Lights',
      icon: '💡',
      description: 'Handles power supply issues and street light maintenance',
      phone: '+91 1234567892',
      email: 'electricity@citycare.gov',
      openHours: '24/7 Emergency Service',
      activeIssues: 28,
      resolvedIssues: 189
    },
    {
      id: 4,
      name: 'Sanitation & Waste',
      icon: '🗑️',
      description: 'Manages garbage collection and sanitation services',
      phone: '+91 1234567893',
      email: 'sanitation@citycare.gov',
      openHours: 'Mon-Sat: 7:00 AM - 7:00 PM',
      activeIssues: 34,
      resolvedIssues: 312
    },
    {
      id: 5,
      name: 'Parks & Recreation',
      icon: '🌳',
      description: 'Maintains public parks, gardens, and recreational facilities',
      phone: '+91 1234567894',
      email: 'parks@citycare.gov',
      openHours: 'Mon-Fri: 9:00 AM - 5:00 PM',
      activeIssues: 8,
      resolvedIssues: 67
    },
    {
      id: 6,
      name: 'Public Safety',
      icon: '🚨',
      description: 'Handles public safety concerns and emergency services',
      phone: '+91 1234567895',
      email: 'safety@citycare.gov',
      openHours: '24/7 Emergency Service',
      activeIssues: 15,
      resolvedIssues: 98
    }
  ]

  return (
    <div className="bg-gray-50 min-h-screen" style={{ padding: '40px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="text-3xl font-bold text-gray-800" style={{ marginBottom: '8px' }}>Departments</h1>
          <p className="text-gray-600">Contact information for all civic departments</p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-green-500 transition-all duration-300"
              style={{ padding: '24px' }}
            >
              {/* Department Header */}
              <div className="flex items-start" style={{ marginBottom: '16px', gap: '16px' }}>
                <div className="bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: '56px', height: '56px', fontSize: '28px' }}>
                  {dept.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800" style={{ marginBottom: '4px' }}>
                    {dept.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {dept.description}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-100" style={{ paddingTop: '16px', marginBottom: '16px' }}>
                <div className="flex items-center text-sm text-gray-700" style={{ marginBottom: '8px', gap: '8px' }}>
                  <FiPhone size={14} className="text-green-600" />
                  <span>{dept.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700" style={{ marginBottom: '8px', gap: '8px' }}>
                  <FiMail size={14} className="text-green-600" />
                  <span>{dept.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700" style={{ gap: '8px' }}>
                  <FiClock size={14} className="text-green-600" />
                  <span>{dept.openHours}</span>
                </div>
              </div>

              {/* Statistics */}
              <div className="flex items-center justify-between border-t border-gray-100" style={{ paddingTop: '16px' }}>
                <div>
                  <p className="text-xs text-gray-500 font-medium" style={{ marginBottom: '4px' }}>Active Issues</p>
                  <p className="text-xl font-bold text-yellow-600">{dept.activeIssues}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium" style={{ marginBottom: '4px' }}>Resolved</p>
                  <p className="text-xl font-bold text-green-600">{dept.resolvedIssues}</p>
                </div>
              </div>

              {/* Contact Button */}
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors" style={{ marginTop: '16px', padding: '10px' }}>
                Contact Department
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
