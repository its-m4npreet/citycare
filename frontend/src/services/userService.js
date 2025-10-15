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
};
