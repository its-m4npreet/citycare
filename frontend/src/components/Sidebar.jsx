import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiAlertCircle, FiFileText, FiMap, FiUsers, FiLogOut, FiPieChart, FiPlus } from 'react-icons/fi'
import { SignOutButton } from '@clerk/clerk-react'

export default function Sidebar() {
  const location = useLocation()
  
  const menuItems = [
    { path: '/', icon: FiPieChart, label: 'Overview' },
    { path: '/map', icon: FiMap, label: 'Map' },
    { path: '/report-new-issue', icon: FiAlertCircle, label: 'Report New Issue' },
    { path: '/my-reports', icon: FiFileText, label: 'My Reports' },
    { path: '/profile', icon: FiUsers, label: 'Profile' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Report New Issue Button */}
      <div className="border-b border-gray-200 flex-shrink-0" style={{ padding: '24px 16px 16px 16px' }}>
        <Link 
          to="/report-new-issue"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
          style={{ padding: '12px 16px' }}
        >
          <FiPlus size={20} />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-hidden" style={{ padding: '16px 12px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-green-50 text-green-600 font-semibold shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              style={{ padding: '12px 16px', marginBottom: '4px' }}
            >
              <Icon size={20} />
              <span className={isActive ? 'font-semibold' : 'font-medium'}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign Out at bottom */}
      <div className="border-t border-gray-200 mt-auto flex-shrink-0" style={{ padding: '16px 12px' }}>
        <SignOutButton>
          <button
            className="w-full flex items-center gap-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
            style={{ padding: '12px 16px' }}
          >
            <FiLogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  )
}
