/**
 * API Service untuk News Management System
 * Menangani semua komunikasi dengan backend Laravel
 */

const API_BASE_URL = 'http://localhost:8000/api';

// Helper untuk set Authorization header
const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Helper untuk handle response errors
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || 'An error occurred',
      errors: data.errors || {},
      data,
    };
  }

  return data;
};

/**
 * AUTHENTICATION ENDPOINTS
 */
export const authAPI = {
  // Admin Auth
  adminRegister: (payload) =>
    fetch(`${API_BASE_URL}/admin/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  adminLogin: (email, password) =>
    fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    }).then(handleResponse),

  adminLogout: (token) =>
    fetch(`${API_BASE_URL}/admin/logout`, {
      method: 'POST',
      headers: getHeaders(token),
    }).then(handleResponse),

  // Writer Auth
  writerRegister: (payload) =>
    fetch(`${API_BASE_URL}/writer/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  writerLogin: (email, password) =>
    fetch(`${API_BASE_URL}/writer/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    }).then(handleResponse),

  writerLogout: (token) =>
    fetch(`${API_BASE_URL}/writer/logout`, {
      method: 'POST',
      headers: getHeaders(token),
    }).then(handleResponse),
};

/**
 * USER PROFILE ENDPOINTS (Tier 1)
 */
export const profileAPI = {
  // Get current user profile
  getProfile: (token, userType = 'admin') =>
    fetch(`${API_BASE_URL}/${userType}/me`, {
      headers: getHeaders(token),
    }).then(handleResponse),

  // Update user profile
  updateProfile: (token, payload, userType = 'admin') =>
    fetch(`${API_BASE_URL}/${userType}/profile`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  // Change password
  changePassword: (token, payload, userType = 'admin') =>
    fetch(`${API_BASE_URL}/${userType}/change-password`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }).then(handleResponse),
};

/**
 * NEWS ENDPOINTS
 */
export const newsAPI = {
  // Get all news with filters
  getAll: (token, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.writer_id) params.append('writer_id', filters.writer_id);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.order) params.append('order', filters.order);
    if (filters.page) params.append('page', filters.page);
    if (filters.per_page) params.append('per_page', filters.per_page);

    const url = `${API_BASE_URL}/admin/news?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then(handleResponse);
  },

  // Get writer's news
  getWriterNews: (token, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);

    const url = `${API_BASE_URL}/writer/news?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then(handleResponse);
  },

  // Get public published news
  getPublished: (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.page) params.append('page', filters.page);

    const url = `${API_BASE_URL}/news?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(),
    }).then(handleResponse);
  },

  // Get single news
  getById: (id, token = null) =>
    fetch(`${API_BASE_URL}/news/${id}`, {
      headers: getHeaders(token),
    }).then(handleResponse),

  // Create news (writer)
  create: (token, payload) =>
    fetch(`${API_BASE_URL}/writer/news`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  // Update news (admin or writer)
  update: (token, id, payload, isWriter = false) => {
    const endpoint = isWriter ? 'writer' : 'admin';
    return fetch(`${API_BASE_URL}/${endpoint}/news/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }).then(handleResponse);
  },

  // Delete news (soft delete)
  delete: (token, id) =>
    fetch(`${API_BASE_URL}/admin/news/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    }).then(handleResponse),

  // Restore deleted news
  restore: (token, id) =>
    fetch(`${API_BASE_URL}/admin/news/${id}/restore`, {
      method: 'POST',
      headers: getHeaders(token),
    }).then(handleResponse),

  // Toggle publish status
  togglePublish: (token, id) =>
    fetch(`${API_BASE_URL}/admin/news/${id}/toggle-publish`, {
      method: 'POST',
      headers: getHeaders(token),
    }).then(handleResponse),

  // Approve news (Tier 1)
  approve: (token, id, payload = {}) =>
    fetch(`${API_BASE_URL}/admin/news/${id}/approve`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  // Reject news (Tier 1)
  reject: (token, id, payload = {}) =>
    fetch(`${API_BASE_URL}/admin/news/${id}/reject`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  // Schedule news (Tier 3)
  schedule: (token, id, payload) =>
    fetch(`${API_BASE_URL}/admin/news/${id}/schedule`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  // Cancel scheduled publish (Tier 3)
  cancelSchedule: (token, id) =>
    fetch(`${API_BASE_URL}/admin/news/${id}/cancel-schedule`, {
      method: 'POST',
      headers: getHeaders(token),
    }).then(handleResponse),
};

/**
 * USER MANAGEMENT ENDPOINTS (Tier 2)
 */
export const userAPI = {
  // Get all users
  getAll: (token, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.page) params.append('page', filters.page);

    const url = `${API_BASE_URL}/admin/users?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then(handleResponse);
  },

  // Get single user
  getById: (token, id) =>
    fetch(`${API_BASE_URL}/admin/users/${id}`, {
      headers: getHeaders(token),
    }).then(handleResponse),

  // Create user
  create: (token, payload) =>
    fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  // Update user
  update: (token, id, payload) =>
    fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  // Delete user (soft delete)
  delete: (token, id) =>
    fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    }).then(handleResponse),

  // Get deleted users
  getDeleted: (token, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);

    const url = `${API_BASE_URL}/admin/users/deleted?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then(handleResponse);
  },

  // Restore user
  restore: (token, id) =>
    fetch(`${API_BASE_URL}/admin/users/${id}/restore`, {
      method: 'POST',
      headers: getHeaders(token),
    }).then(handleResponse),
};

/**
 * DASHBOARD ENDPOINTS (Tier 2)
 */
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: (token) =>
    fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: getHeaders(token),
    }).then(handleResponse),

  // Get category statistics
  getCategoryStats: (token) =>
    fetch(`${API_BASE_URL}/admin/dashboard/category-stats`, {
      headers: getHeaders(token),
    }).then(handleResponse),

  // Get writer statistics
  getWriterStats: (token) =>
    fetch(`${API_BASE_URL}/admin/dashboard/writer-stats`, {
      headers: getHeaders(token),
    }).then(handleResponse),
};

/**
 * ACTIVITY LOG ENDPOINTS (Tier 1)
 */
export const activityAPI = {
  // Get all activities
  getAll: (token, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.per_page) params.append('per_page', filters.per_page);

    const url = `${API_BASE_URL}/admin/activities?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then(handleResponse);
  },

  // Get activity history for specific model
  getModelHistory: (token, modelType, modelId) =>
    fetch(`${API_BASE_URL}/admin/activities/${modelType}/${modelId}`, {
      headers: getHeaders(token),
    }).then(handleResponse),

  // Get current user's activities
  getMyActivity: (token, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);

    const url = `${API_BASE_URL}/my-activities?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then(handleResponse);
  },
};

/**
 * BULK OPERATIONS ENDPOINTS (Tier 3)
 */
export const bulkAPI = {
  // Bulk delete news
  deleteNews: (token, ids) =>
    fetch(`${API_BASE_URL}/admin/bulk/news/delete`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ ids }),
    }).then(handleResponse),

  // Bulk publish news
  publishNews: (token, ids) =>
    fetch(`${API_BASE_URL}/admin/bulk/news/publish`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ ids }),
    }).then(handleResponse),

  // Bulk unpublish news
  unpublishNews: (token, ids) =>
    fetch(`${API_BASE_URL}/admin/bulk/news/unpublish`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ ids }),
    }).then(handleResponse),

  // Bulk approve news
  approveNews: (token, ids) =>
    fetch(`${API_BASE_URL}/admin/bulk/news/approve`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ ids }),
    }).then(handleResponse),

  // Bulk update category
  updateCategory: (token, ids, categoryId) =>
    fetch(`${API_BASE_URL}/admin/bulk/news/update-category`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ ids, category_id: categoryId }),
    }).then(handleResponse),
};

/**
 * EXPORT ENDPOINTS (Tier 3)
 */
export const exportAPI = {
  // Export news to CSV
  newsCSV: (token, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.writer_id) params.append('writer_id', filters.writer_id);

    const url = `${API_BASE_URL}/admin/export/news/csv?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then((response) => response.blob());
  },

  // Export news to Excel
  newsExcel: (token, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.writer_id) params.append('writer_id', filters.writer_id);

    const url = `${API_BASE_URL}/admin/export/news/excel?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then((response) => response.blob());
  },

  // Export news to JSON
  newsJSON: (token, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.writer_id) params.append('writer_id', filters.writer_id);

    const url = `${API_BASE_URL}/admin/export/news/json?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then((response) => response.blob());
  },

  // Export news to HTML
  newsHTML: (token, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.writer_id) params.append('writer_id', filters.writer_id);

    const url = `${API_BASE_URL}/admin/export/news/html?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then((response) => response.blob());
  },
};

/**
 * CATEGORY ENDPOINTS
 */
export const categoryAPI = {
  // Get all categories
  getAll: (token = null) =>
    fetch(`${API_BASE_URL}/categories`, {
      headers: getHeaders(token),
    }).then(handleResponse),

  // Get single category
  getById: (id, token = null) =>
    fetch(`${API_BASE_URL}/categories/${id}`, {
      headers: getHeaders(token),
    }).then(handleResponse),
};

/**
 * COMMENT ENDPOINTS (Tier 3)
 */
export const commentAPI = {
  // Get comments for news
  getForNews: (newsId, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.per_page) params.append('per_page', filters.per_page);

    const url = `${API_BASE_URL}/news/${newsId}/comments?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(),
    }).then(handleResponse);
  },

  // Post comment
  create: (newsId, payload) =>
    fetch(`${API_BASE_URL}/news/${newsId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  // Get pending comments for moderation
  getPending: (token, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);

    const url = `${API_BASE_URL}/admin/comments/pending?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then(handleResponse);
  },

  // Approve comment
  approve: (token, id) =>
    fetch(`${API_BASE_URL}/admin/comments/${id}/approve`, {
      method: 'POST',
      headers: getHeaders(token),
    }).then(handleResponse),

  // Mark comment as spam
  markSpam: (token, id) =>
    fetch(`${API_BASE_URL}/admin/comments/${id}/mark-spam`, {
      method: 'POST',
      headers: getHeaders(token),
    }).then(handleResponse),

  // Delete comment
  delete: (token, id) =>
    fetch(`${API_BASE_URL}/admin/comments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    }).then(handleResponse),
};

/**
 * MEDIA MANAGEMENT ENDPOINTS
 */
export const mediaAPI = {
  // Writer: Upload media
  upload: (token, newsId, file, caption, altText) => {
    const formData = new FormData();
    formData.append('news_id', newsId);
    formData.append('file', file);
    if (caption) formData.append('caption', caption);
    if (altText) formData.append('alt_text', altText);

    return fetch(`${API_BASE_URL}/writer/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    }).then(handleResponse);
  },

  // Writer: Get my media
  getMyMedia: (token, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.per_page) params.append('per_page', filters.per_page);

    const url = `${API_BASE_URL}/writer/media?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then(handleResponse);
  },

  // Writer: Delete own media
  delete: (token, mediaId) =>
    fetch(`${API_BASE_URL}/writer/media/${mediaId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    }).then(handleResponse),

  // Admin: Get all media (pending, approved, etc)
  getAllMedia: (token, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.news_id) params.append('news_id', filters.news_id);
    if (filters.page) params.append('page', filters.page);
    if (filters.per_page) params.append('per_page', filters.per_page);

    const url = `${API_BASE_URL}/admin/media?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then(handleResponse);
  },

  // Admin: Approve media
  approve: (token, mediaId, caption, altText) =>
    fetch(`${API_BASE_URL}/admin/media/${mediaId}/approve`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        caption: caption || '',
        alt_text: altText || '',
      }),
    }).then(handleResponse),

  // Admin: Reject media
  reject: (token, mediaId, reason) =>
    fetch(`${API_BASE_URL}/admin/media/${mediaId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
      body: JSON.stringify({ rejection_reason: reason }),
    }).then(handleResponse),
};

/**
 * CONTENT ASSIGNMENT ENDPOINTS (Admin assigns tasks to Writers)
 */
export const assignmentAPI = {
  // Admin: Create assignment for writer
  assign: (token, payload) =>
    fetch(`${API_BASE_URL}/admin/assignments`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  // Writer: Get my assignments
  getMyAssignments: (token, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.overdue) params.append('overdue', filters.overdue);
    if (filters.page) params.append('page', filters.page);
    if (filters.per_page) params.append('per_page', filters.per_page);

    const url = `${API_BASE_URL}/writer/assignments?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then(handleResponse);
  },

  // Writer: Acknowledge assignment
  acknowledge: (token, assignmentId) =>
    fetch(`${API_BASE_URL}/writer/assignments/${assignmentId}/acknowledge`, {
      method: 'POST',
      headers: getHeaders(token),
    }).then(handleResponse),

  // Writer: Mark assignment as in progress
  startWorking: (token, assignmentId) =>
    fetch(`${API_BASE_URL}/writer/assignments/${assignmentId}/start`, {
      method: 'POST',
      headers: getHeaders(token),
    }).then(handleResponse),

  // Writer: Submit completed task
  submit: (token, assignmentId, newsId) =>
    fetch(`${API_BASE_URL}/writer/assignments/${assignmentId}/submit`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ news_id: newsId }),
    }).then(handleResponse),

  // Admin: Get all assignments
  getAll: (token, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.writer_id) params.append('writer_id', filters.writer_id);
    if (filters.page_filter) params.append('page_filter', filters.page_filter);
    if (filters.active) params.append('active', filters.active);
    if (filters.page) params.append('page', filters.page);
    if (filters.per_page) params.append('per_page', filters.per_page);

    const url = `${API_BASE_URL}/admin/assignments?${params.toString()}`;
    return fetch(url, {
      headers: getHeaders(token),
    }).then(handleResponse);
  },

  // Get assignment detail
  show: (token, assignmentId) =>
    fetch(`${API_BASE_URL}/admin/assignments/${assignmentId}`, {
      headers: getHeaders(token),
    }).then(handleResponse),

  // Admin: Update assignment
  update: (token, assignmentId, payload) =>
    fetch(`${API_BASE_URL}/admin/assignments/${assignmentId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  // Admin: Mark as completed
  markCompleted: (token, assignmentId) =>
    fetch(`${API_BASE_URL}/admin/assignments/${assignmentId}/mark-completed`, {
      method: 'POST',
      headers: getHeaders(token),
    }).then(handleResponse),

  // Admin: Cancel assignment
  cancel: (token, assignmentId, reason) =>
    fetch(`${API_BASE_URL}/admin/assignments/${assignmentId}/cancel`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ cancellation_reason: reason }),
    }).then(handleResponse),
};

export default {
  authAPI,
  profileAPI,
  newsAPI,
  userAPI,
  dashboardAPI,
  activityAPI,
  bulkAPI,
  exportAPI,
  categoryAPI,
  commentAPI,
  mediaAPI,
  assignmentAPI,
};
