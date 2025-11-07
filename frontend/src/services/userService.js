import { apiCall, jsonRequest } from './api';

// User API Service
export const userService = {
  // Create or update user profile
  createOrUpdateUser: async (userData) => {
    const response = await jsonRequest('/users/profile', 'POST', userData);
    return response.data || response; // Extract data from response
  },

  // Get user profile by Clerk ID
  getUserByClerkId: async (clerkId) => {
    const response = await apiCall(`/users/profile/${clerkId}`);
    return response.data || response; // Extract data from response
  },

  // Get user statistics
  getUserStats: async (clerkId) => {
    const response = await apiCall(`/users/stats/${clerkId}`);
    return response.data || response; // Extract data from response
  },

  // Update user address
  updateUserAddress: async (clerkId, addressData) => {
    return jsonRequest(`/users/address/${clerkId}`, 'PUT', addressData);
  },

  // Delete user profile
  deleteUser: async (clerkId) => {
    return apiCall(`/users/profile/${clerkId}`, {
      method: 'DELETE',
    });
  },

  // Get user notifications
  getUserNotifications: async (clerkId, unreadOnly = false, limit = 20) => {
    const queryParams = new URLSearchParams();
    if (unreadOnly) queryParams.append('unreadOnly', 'true');
    if (limit) queryParams.append('limit', limit);
    
    const queryString = queryParams.toString();
    const response = await apiCall(`/users/notifications/${clerkId}${queryString ? `?${queryString}` : ''}`);
    return response;
  },

  // Mark notification as read
  markNotificationAsRead: async (clerkId, notificationId) => {
    return jsonRequest(`/users/notifications/${clerkId}/${notificationId}/read`, 'PUT');
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (clerkId) => {
    return jsonRequest(`/users/notifications/${clerkId}/read-all`, 'PUT');
  },
};
