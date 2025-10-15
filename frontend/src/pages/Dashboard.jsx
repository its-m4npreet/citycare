import { useState, useEffect } from 'react'
import { FiMoreVertical, FiCheckCircle, FiClock, FiAlertCircle, FiUsers, FiRefreshCw } from 'react-icons/fi'
import { MdPendingActions, MdCheckCircle } from 'react-icons/md'
import { HiDocumentReport } from 'react-icons/hi'
import { issueService } from '../services/issueService'

export default function Dashboard() {
  const [showAllReports, setShowAllReports] = useState(false)
  const [stats, setStats] = useState([
    { 
      label: 'Total Issues', 
      value: '0', 
      icon: HiDocumentReport,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    { 
      label: 'Pending Issues', 
      value: '0', 
      icon: MdPendingActions,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      label: 'Resolved Issues', 
      value: '0', 
      icon: FiCheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
  ])
  const [allReports, setAllReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch dashboard stats
        const statsData = await issueService.getDashboardStats()
        
        // Update stats with fetched data
        setStats([
          { 
            label: 'Total Issues', 
            value: statsData.totalIssues.toString(), 
            icon: HiDocumentReport,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
          },
          { 
            label: 'Pending Issues', 
            value: statsData.pendingIssues.toString(), 
            icon: MdPendingActions,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
          },
          { 
            label: 'Resolved Issues', 
            value: statsData.resolvedIssues.toString(), 
            icon: FiCheckCircle,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
          },
        ])

        // Fetch recent issues
        const issues = await issueService.getAllIssues({ limit: 10, sortBy: 'createdAt', order: 'desc' })
        
        // Transform backend data to match frontend format
        const transformedReports = issues.map((issue) => ({
          id: issue._id,
          issue: issue.title,
          location: issue.location?.address || issue.location || 'Unknown Location',
          status: issue.status,
          time: getRelativeTime(issue.createdAt),
        }))
        
        setAllReports(transformedReports)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data')
        
        // Fallback to localStorage if backend fails
        try {
          const localReports = JSON.parse(localStorage.getItem('citycare_reports') || '[]')
          const transformedLocal = localReports.map((report) => ({
            id: report.id,
            issue: report.title,
            location: report.location,
            status: report.status,
            time: getRelativeTime(report.date),
          }))
          setAllReports(transformedLocal)
        } catch {
          setAllReports([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Helper function to get relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  }

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
            {loading ? (
              <div className="text-center" style={{ padding: '80px 48px' }}>
                <FiRefreshCw
                  className="text-green-600 mx-auto animate-spin"
                  size={48}
                  style={{ marginBottom: '16px' }}
                />
                <h3 className="text-lg font-semibold text-gray-800" style={{ marginBottom: '8px' }}>
                  Loading reports...
                </h3>
                <p className="text-gray-600">
                  Please wait while we fetch the data.
                </p>
              </div>
            ) : error ? (
              <div className="text-center" style={{ padding: '80px 48px' }}>
                <FiAlertCircle
                  className="text-red-500 mx-auto"
                  size={48}
                  style={{ marginBottom: '16px' }}
                />
                <h3 className="text-lg font-semibold text-gray-800" style={{ marginBottom: '8px' }}>
                  Error loading reports
                </h3>
                <p className="text-gray-600" style={{ marginBottom: '16px' }}>
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  style={{ padding: '10px 24px' }}
                >
                  Try Again
                </button>
              </div>
            ) : recentReports.length === 0 ? (
              <div className="text-center" style={{ padding: '80px 48px' }}>
                <FiAlertCircle
                  className="text-gray-400 mx-auto"
                  size={48}
                  style={{ marginBottom: '16px' }}
                />
                <h3 className="text-lg font-semibold text-gray-800" style={{ marginBottom: '8px' }}>
                  No reports yet
                </h3>
                <p className="text-gray-600">
                  Be the first to report a civic issue in your area!
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left text-sm font-semibold text-gray-600 uppercase tracking-wider" style={{ padding: '16px 32px' }}>Issue ID</th>
                    <th className="text-left text-sm font-semibold text-gray-600 uppercase tracking-wider" style={{ padding: '16px 32px' }}>Issue</th>
                    <th className="text-left text-sm font-semibold text-gray-600 uppercase tracking-wider" style={{ padding: '16px 32px' }}>Location</th>
                    <th className="text-left text-sm font-semibold text-gray-600 uppercase tracking-wider" style={{ padding: '16px 32px' }}>Status</th>
                    <th className="text-left text-sm font-semibold text-gray-600 uppercase tracking-wider" style={{ padding: '16px 32px' }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((report) => (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="text-xs text-gray-500 font-mono" style={{ padding: '20px 32px' }}>{report.id.slice(-8)}</td>
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
