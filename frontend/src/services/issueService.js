import { API_BASE_URL, apiCall, jsonRequest } from './api';

// Issue API Service
export const issueService = {
  // Create new issue with file uploads
  createIssue: async (issueData, files = {}) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(issueData).forEach(key => {
      if (issueData[key] !== null && issueData[key] !== undefined) {
        if (key === 'coordinates' && issueData[key]) {
          formData.append('coordinates', JSON.stringify(issueData[key]));
        } else {
          formData.append(key, issueData[key]);
        }
      }
    });

    // Append image files
    if (files.image) {
      formData.append('images', files.image);
    }

    // Append video files
    if (files.video) {
      formData.append('videos', files.video);
    }

    const response = await apiCall('/issues', {
      method: 'POST',
      body: formData,
    });
    
    return response.data || response; // Extract data from response
  },

  // Get all issues with optional filters
  getAllIssues: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.urgency) queryParams.append('urgency', filters.urgency);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.order) queryParams.append('order', filters.order);

    const queryString = queryParams.toString();
    const response = await apiCall(`/issues${queryString ? `?${queryString}` : ''}`);
    return response.data || response; // Extract data array from response
  },

  // Get lightweight issue locations (fast map load)
  getIssueLocations: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.urgency) queryParams.append('urgency', filters.urgency);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.page) queryParams.append('page', filters.page);

    const queryString = queryParams.toString();
    const response = await apiCall(`/issues/locations${queryString ? `?${queryString}` : ''}`);
    return response.data || response;
  },

  // Get issues for a specific user
  getUserIssues: async (clerkId, status = null) => {
    const queryParams = status ? `?status=${status}` : '';
    const response = await apiCall(`/issues/user/${clerkId}${queryParams}`);
    return response.data || response; // Extract data array from response
  },

  // Get single issue by ID
  getIssueById: async (issueId) => {
    const response = await apiCall(`/issues/${issueId}`);
    return response.data || response; // Extract data from response
  },

  // Update issue
  updateIssue: async (issueId, updateData) => {
    return jsonRequest(`/issues/${issueId}`, 'PUT', updateData);
  },

  // Add update/comment to issue
  addIssueUpdate: async (issueId, updateData) => {
    return jsonRequest(`/issues/${issueId}/updates`, 'POST', updateData);
  },

  // Delete issue
  deleteIssue: async (issueId) => {
    return apiCall(`/issues/${issueId}`, {
      method: 'DELETE',
    });
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await apiCall('/issues/stats/dashboard');
    return response.data || response; // Extract data from response
  },
};
