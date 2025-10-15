import { useState } from 'react'
import { FiMoreVertical, FiCheckCircle, FiClock, FiAlertCircle, FiUsers } from 'react-icons/fi'
import { MdPendingActions, MdCheckCircle } from 'react-icons/md'
import { HiDocumentReport } from 'react-icons/hi'

export default function Dashboard() {
  const [showAllReports, setShowAllReports] = useState(false)

  // Sample data - replace with real API data
  const stats = [
    { 
      label: 'Total Issues', 
      value: '3,256', 
      icon: HiDocumentReport,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    { 
      label: 'Pending Issues', 
      value: '394', 
      icon: MdPendingActions,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      label: 'Resolved Issues', 
      value: '2,536', 
      icon: FiCheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
  ]
              

  const allReports = [
    { id: 1, issue: 'Pothole on MG Road', location: 'MG Road, Sector 5', status: 'pending', time: '2 hours ago' },
    { id: 2, issue: 'Broken Street Light', location: 'Park Street, Zone B', status: 'in-progress', time: '5 hours ago' },
    { id: 3, issue: 'Overflowing Garbage Bin', location: 'Market Area, Ward 3', status: 'resolved', time: '1 day ago' },
    { id: 4, issue: 'No Water Supply', location: 'Green Valley, Block C', status: 'pending', time: '3 hours ago' },
    { id: 5, issue: 'Damaged Road Sign', location: 'Highway 45, Mile Marker 12', status: 'in-progress', time: '4 hours ago' },
    { id: 6, issue: 'Illegal Dumping', location: 'Industrial Area, Sector 9', status: 'pending', time: '6 hours ago' },
    { id: 7, issue: 'Broken Traffic Signal', location: 'Main Street & 5th Avenue', status: 'resolved', time: '1 day ago' },
    { id: 8, issue: 'Stray Animals', location: 'Residential Area, Block D', status: 'pending', time: '8 hours ago' },
    { id: 9, issue: 'Tree Trimming Needed', location: 'Central Park, East Side', status: 'in-progress', time: '12 hours ago' },
    { id: 10, issue: 'Footpath Repair', location: 'Shopping District, Zone A', status: 'resolved', time: '2 days ago' },
  ]

  // Show only first 5 reports initially, all when "View All" is clicked
  const recentReports = showAllReports ? allReports : allReports.slice(0, 5)

  return (
    <div className="bg-gray-50" style={{ padding: '40px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="text-3xl font-bold text-gray-800" style={{ marginBottom: '8px' }}>Dashboard</h1>
          <p className="text-gray-600">Monitor civic issues in your area</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: '48px' }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-green-500 transition-all duration-300" style={{ padding: '24px' }}>
                <div className="flex items-start gap-4">
                  <div className={`${stat.bgColor} rounded-xl flex-shrink-0`} style={{ padding: '16px' }}>
                    <IconComponent className={stat.iconColor} size={32} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm font-medium" style={{ marginBottom: '8px' }}>{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Reports Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100" style={{ padding: '24px 32px' }}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Recent Reports</h2>
                <p className="text-gray-500 text-sm" style={{ marginTop: '4px' }}>Latest civic issues reported in your area</p>
              </div>
              <button 
                onClick={() => setShowAllReports(!showAllReports)}
                className="text-sm text-green-600 hover:text-green-700 font-semibold hover:bg-green-50 rounded-lg transition-colors" 
                style={{ padding: '8px 16px' }}
              >
                {showAllReports ? 'Show Less' : 'View All →'}
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-sm font-semibold text-gray-600 uppercase tracking-wider" style={{ padding: '16px 32px' }}>Issue</th>
                  <th className="text-left text-sm font-semibold text-gray-600 uppercase tracking-wider" style={{ padding: '16px 32px' }}>Location</th>
                  <th className="text-left text-sm font-semibold text-gray-600 uppercase tracking-wider" style={{ padding: '16px 32px' }}>Status</th>
                  <th className="text-left text-sm font-semibold text-gray-600 uppercase tracking-wider" style={{ padding: '16px 32px' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="text-sm font-medium text-gray-800" style={{ padding: '20px 32px' }}>{report.issue}</td>
                    <td className="text-sm text-gray-600" style={{ padding: '20px 32px' }}>{report.location}</td>
                    <td style={{ padding: '20px 32px' }}>
                      <span 
                        className={`inline-flex items-center gap-1.5 rounded-full text-xs font-semibold ${
                          report.status === 'resolved' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : report.status === 'in-progress'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}
                        style={{ padding: '6px 16px' }}
                      >
                        {report.status === 'resolved' ? <FiCheckCircle size={14} /> : <FiClock size={14} />}
                        {report.status}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500" style={{ padding: '20px 32px' }}>{report.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
