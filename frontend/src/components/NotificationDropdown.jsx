import { useState, useEffect, useRef } from 'react';
import { IoMdNotificationsOutline, IoMdNotifications } from 'react-icons/io';
import { FiX, FiClock, FiAlertCircle, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { useUser } from '@clerk/clerk-react';

export default function NotificationDropdown() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user?.id) {
      console.log('⚠️ No user ID available for fetching notifications');
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔔 Fetching notifications for user:', user.id);
      const response = await userService.getUserNotifications(user.id, false, 20);
      console.log('✅ Notifications fetched:', response);
      setNotifications(response.data || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on mount and when dropdown opens
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    if (!user?.id) return;
    
    try {
      await userService.markNotificationAsRead(user.id, notificationId);
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await userService.markAllNotificationsAsRead(user.id);
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    setIsOpen(false);
    
    // Navigate to the issue detail page
    if (notification.issueId) {
      const issueId = typeof notification.issueId === 'string' 
        ? notification.issueId 
        : notification.issueId._id;
      navigate(`/my-reports/${issueId}`);
    }
  };

  // Get icon and styling based on notification type
  const getNotificationStyle = (type) => {
    switch (type) {
      case 'resolved':
        return {
          icon: <FiCheckCircle size={20} />,
          bgColor: 'bg-green-50',
          iconBgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          borderColor: 'border-green-200'
        };
      case 'rejected':
        return {
          icon: <FiXCircle size={20} />,
          bgColor: 'bg-red-50',
          iconBgColor: 'bg-red-100',
          iconColor: 'text-red-600',
          borderColor: 'border-red-200'
        };
      case 'status_update':
        return {
          icon: <FiClock size={20} />,
          bgColor: 'bg-blue-50',
          iconBgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          borderColor: 'border-blue-200'
        };
      case 'comment':
        return {
          icon: <FiAlertCircle size={20} />,
          bgColor: 'bg-amber-50',
          iconBgColor: 'bg-amber-100',
          iconColor: 'text-amber-600',
          borderColor: 'border-amber-200'
        };
      default:
        return {
          icon: <FiAlertCircle size={20} />,
          bgColor: 'bg-gray-50',
          iconBgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        };
    }
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now - notificationDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notificationDate.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          // Refresh notifications when opening
          if (!isOpen) {
            fetchNotifications();
          }
        }}
        aria-label="Notifications"
        className={`relative rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
          unreadCount > 0 
            ? 'bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-500 hover:border-green-600 hover:shadow-lg' 
            : 'bg-white border border-gray-300 hover:border-green-500 hover:bg-green-50 hover:shadow-md'
        }`}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
      >
        {unreadCount > 0 ? (
          <IoMdNotifications className="h-6 w-6 text-green-600 transition-transform duration-300" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        ) : (
          <IoMdNotificationsOutline className="h-6 w-6 text-gray-600 transition-colors duration-300" />
        )}
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            className="absolute inline-flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg animate-bounce"
            style={{ 
              minWidth: '20px', 
              animation: 'bounce 1s infinite',
              top: '-4px',
              right: '-4px',
              padding: '4px 8px'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="absolute right-0 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          style={{ 
            maxHeight: '550px',
            marginTop: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'slideDown 0.3s ease-out, fadeIn 0.3s ease-out',
            transformOrigin: 'top right'
          }}
        >
          <style>{`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-10px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
          `}</style>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500" style={{ padding: '16px 20px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: '8px' }}>
                <IoMdNotifications className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs font-bold text-green-600 bg-white rounded-full" style={{ padding: '4px 8px' }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-white hover:text-green-100 font-medium underline transition-all duration-200 hover:scale-105 transform"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto bg-gray-50" style={{ maxHeight: '420px' }}>
            {loading ? (
              <div className="flex flex-col justify-center items-center" style={{ padding: '48px 0' }}>
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
                <p className="text-gray-500 text-sm" style={{ marginTop: '12px' }}>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center" style={{ padding: '48px 16px' }}>
                <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center" style={{ padding: '16px', marginBottom: '12px' }}>
                  <IoMdNotificationsOutline className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium" style={{ marginBottom: '4px' }}>No notifications yet</p>
                <p className="text-gray-400 text-sm">We'll notify you when something happens</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification, index) => {
                  const style = getNotificationStyle(notification.type);
                  return (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`cursor-pointer transition-all duration-200 ${
                        notification.isRead 
                          ? 'bg-white hover:bg-gray-100' 
                          : `${style.bgColor} hover:shadow-md border-l-4 ${style.borderColor}`
                      }`}
                      style={{ 
                        padding: '12px 16px',
                        animation: `slideInRight 0.3s ease-out ${index * 0.05}s both`,
                      }}
                    >
                      <style>{`
                        @keyframes slideInRight {
                          from {
                            opacity: 0;
                            transform: translateX(-20px);
                          }
                          to {
                            opacity: 1;
                            transform: translateX(0);
                          }
                        }
                      `}</style>
                      <div className="flex items-start" style={{ gap: '12px' }}>
                        {/* Icon */}
                        <div className={`flex-shrink-0 rounded-lg ${style.iconBgColor} ${style.iconColor}`} style={{ marginTop: '2px', padding: '8px' }}>
                          {style.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-relaxed ${
                            notification.isRead 
                              ? 'text-gray-600' 
                              : 'text-gray-900 font-semibold'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center" style={{ gap: '8px', marginTop: '6px' }}>
                            <p className="text-xs text-gray-500 font-medium">
                              {formatTimeAgo(notification.createdAt)}
                            </p>
                            {!notification.isRead && (
                              <span className="text-xs font-semibold text-blue-700 bg-blue-100 rounded-full" style={{ padding: '2px 8px' }}>
                                NEW
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Unread indicator */}
                        {!notification.isRead && (
                          <div className="flex-shrink-0" style={{ marginTop: '8px' }}>
                            <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-lg"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 bg-white" style={{ padding: '12px 16px' }}>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/my-reports');
                }}
                className="w-full text-center text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                style={{ padding: '10px 0' }}
              >
                View All Reports
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
