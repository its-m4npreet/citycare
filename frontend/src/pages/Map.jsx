import { useState } from 'react'
import { FiMapPin, FiFilter, FiSearch, FiMaximize2 } from 'react-icons/fi'
import { MdPendingActions, MdCheckCircle } from 'react-icons/md'

export default function Map() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Sample issues data with coordinates
  const issues = [
    { 
      id: 1, 
      title: 'Pothole on MG Road', 
      location: 'MG Road, Sector 5',
      lat: 28.6139, 
      lng: 77.2090,
      status: 'pending',
      category: 'Potholes',
      severity: 'high'
    },
    { 
      id: 2, 
      title: 'Broken Street Light', 
      location: 'Park Street, Zone B',
      lat: 28.6149, 
      lng: 77.2080,
      status: 'in-progress',
      category: 'Street Lights',
      severity: 'medium'
    },
    { 
      id: 3, 
      title: 'Overflowing Garbage Bin', 
      location: 'Market Area, Ward 3',
      lat: 28.6129, 
      lng: 77.2100,
      status: 'resolved',
      category: 'Garbage Collection',
      severity: 'low'
    },
    { 
      id: 4, 
      title: 'No Water Supply', 
      location: 'Green Valley, Block C',
      lat: 28.6119, 
      lng: 77.2110,
      status: 'pending',
      category: 'Water Supply',
      severity: 'critical'
    },
  ]

  const categories = ['All', 'Potholes', 'Street Lights', 'Garbage Collection', 'Water Supply', 'Drainage']
  const statuses = ['All', 'Pending', 'In Progress', 'Resolved']

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    const matchesCategory = selectedCategory === 'all' || issue.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesStatus = selectedStatus === 'all' || issue.status.toLowerCase() === selectedStatus.toLowerCase().replace(' ', '-')
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         issue.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesStatus && matchesSearch
  })

  return (
    <div className="bg-gray-50 min-h-screen" style={{ padding: '40px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="text-3xl font-bold text-gray-800" style={{ marginBottom: '8px' }}>Issue Map</h1>
          <p className="text-gray-600">View all reported civic issues on the map</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100" style={{ padding: '24px', marginBottom: '24px' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search issues or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{ padding: '12px 16px 12px 44px' }}
              />
              <FiSearch className="absolute text-gray-400" style={{ left: '16px', top: '14px' }} size={20} />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{ padding: '12px 16px' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{ padding: '12px 16px' }}
              >
                {statuses.map(status => (
                  <option key={status} value={status.toLowerCase()}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Map Header */}
              <div className="border-b border-gray-100 flex justify-between items-center" style={{ padding: '20px 24px' }}>
                <h2 className="text-xl font-bold text-gray-800">Map View</h2>
                <button className="flex items-center text-sm text-green-600 hover:text-green-700 font-medium transition-colors" style={{ gap: '8px' }}>
                  <FiMaximize2 size={16} />
                  <span>Fullscreen</span>
                </button>
              </div>

              {/* Map Placeholder - Replace with actual map component */}
              <div 
                className="relative bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center"
                style={{ height: '600px' }}
              >
                {/* This is a placeholder - Replace with Google Maps, Mapbox, or Leaflet */}
                <div className="text-center">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200" style={{ padding: '48px', maxWidth: '400px' }}>
                    <div className="bg-green-100 rounded-full inline-flex items-center justify-center" style={{ width: '80px', height: '80px', marginBottom: '24px' }}>
                      <FiMapPin className="text-green-600" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800" style={{ marginBottom: '12px' }}>
                      Interactive Map Coming Soon
                    </h3>
                    <p className="text-gray-600" style={{ marginBottom: '24px' }}>
                      We're integrating Google Maps to show all issue locations. 
                      For now, view the list of issues on the right.
                    </p>
                    <div className="flex flex-col" style={{ gap: '8px' }}>
                      {filteredIssues.slice(0, 3).map(issue => (
                        <div 
                          key={issue.id} 
                          className="flex items-center justify-between bg-gray-50 rounded-lg" 
                          style={{ padding: '12px 16px' }}
                        >
                          <div className="flex items-center" style={{ gap: '12px' }}>
                            <div className={`w-3 h-3 rounded-full ${
                              issue.status === 'resolved' ? 'bg-green-500' :
                              issue.status === 'in-progress' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}></div>
                            <span className="text-sm font-medium text-gray-700">{issue.title}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {issue.lat.toFixed(4)}, {issue.lng.toFixed(4)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map Pins Preview (simulated) */}
                {filteredIssues.map((issue, index) => (
                  <div
                    key={issue.id}
                    className="absolute"
                    style={{
                      top: `${20 + index * 15}%`,
                      left: `${25 + index * 12}%`
                    }}
                  >
                    <div className={`rounded-full border-4 border-white shadow-lg ${
                      issue.status === 'resolved' ? 'bg-green-500' :
                      issue.status === 'in-progress' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`} style={{ width: '16px', height: '16px' }}></div>
                  </div>
                ))}
              </div>

              {/* Map Legend */}
              <div className="border-t border-gray-100 flex items-center justify-between" style={{ padding: '16px 24px' }}>
                <div className="flex items-center" style={{ gap: '24px' }}>
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">In Progress</span>
                  </div>
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Resolved</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  Showing {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Issues List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100" style={{ padding: '20px 24px' }}>
                <h2 className="text-xl font-bold text-gray-800">Issues List</h2>
                <p className="text-sm text-gray-500" style={{ marginTop: '4px' }}>
                  {filteredIssues.length} total
                </p>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                {filteredIssues.length === 0 ? (
                  <div className="text-center" style={{ padding: '48px 24px' }}>
                    <p className="text-gray-500">No issues found matching your filters</p>
                  </div>
                ) : (
                  filteredIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{ padding: '20px 24px' }}
                    >
                      <div className="flex items-start justify-between" style={{ marginBottom: '8px' }}>
                        <h3 className="text-sm font-semibold text-gray-800">{issue.title}</h3>
                        <span className={`inline-flex items-center rounded-full text-xs font-semibold ${
                          issue.status === 'resolved' 
                            ? 'bg-green-50 text-green-700' 
                            : issue.status === 'in-progress'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`} style={{ padding: '4px 12px' }}>
                          {issue.status === 'resolved' ? <MdCheckCircle size={12} /> : <MdPendingActions size={12} />}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500" style={{ gap: '6px', marginBottom: '8px' }}>
                        <FiMapPin size={12} />
                        <span>{issue.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {issue.lat.toFixed(6)}, {issue.lng.toFixed(6)}
                        </span>
                        <span className={`text-xs font-medium ${
                          issue.severity === 'critical' ? 'text-red-600' :
                          issue.severity === 'high' ? 'text-orange-600' :
                          issue.severity === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {issue.severity}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
