// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API Response interface
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

// HTTP Client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Get authentication headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: this.getHeaders(),
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطای سرور');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload file
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers: HeadersInit = {};

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطای آپلود');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);
    }
    return response;
  },

  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);
    }
    return response;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    apiClient.setToken(null);
    return response;
  },

  getCurrentUser: () => apiClient.get('/auth/me'),

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);
    }
    return response;
  }
};

// Videos API
export const videosAPI = {
  getVideos: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiClient.get(`/videos${queryString ? `?${queryString}` : ''}`);
  },

  getVideo: (id: string) => apiClient.get(`/videos/${id}`),

  uploadVideo: (formData: FormData) => apiClient.upload('/videos', formData),

  updateVideo: (id: string, data: any) => apiClient.put(`/videos/${id}`, data),

  deleteVideo: (id: string) => apiClient.delete(`/videos/${id}`),

  likeVideo: (id: string) => apiClient.post(`/videos/${id}/like`),

  dislikeVideo: (id: string) => apiClient.post(`/videos/${id}/dislike`),

  getTrending: () => apiClient.get('/videos/trending'),

  getCategories: () => apiClient.get('/videos/categories')
};

// Users API
export const usersAPI = {
  getProfile: (id: string) => apiClient.get(`/users/${id}`),

  updateProfile: (data: any) => apiClient.put('/users/profile', data),

  subscribe: (id: string) => apiClient.post(`/users/${id}/subscribe`),

  getUserVideos: (id: string) => apiClient.get(`/users/${id}/videos`),

  changePassword: (currentPassword: string, newPassword: string) => 
    apiClient.post('/users/change-password', { currentPassword, newPassword })
};

// Wallet API
export const walletAPI = {
  getBalance: () => apiClient.get('/wallet/balance'),

  getTransactions: () => apiClient.get('/wallet/transactions'),

  deposit: (amount: number, paymentMethod: string) => 
    apiClient.post('/wallet/deposit', { amount, paymentMethod }),

  withdraw: (amount: number, bankAccount: string) => 
    apiClient.post('/wallet/withdraw', { amount, bankAccount }),

  getStats: () => apiClient.get('/wallet/stats')
};

// Live API
export const liveAPI = {
  getStreams: () => apiClient.get('/live/streams'),

  getStream: (id: string) => apiClient.get(`/live/streams/${id}`),

  createStream: (data: {
    title: string;
    description?: string;
    category: string;
    tags?: string;
  }) => apiClient.post('/live/streams', data),

  endStream: (id: string) => apiClient.put(`/live/streams/${id}/end`),

  sendChatMessage: (streamId: string, message: string) => 
    apiClient.post(`/live/streams/${streamId}/chat`, { message }),

  getChatMessages: (streamId: string) => apiClient.get(`/live/streams/${streamId}/chat`)
};

// Admin API
export const adminAPI = {
  getDashboard: () => apiClient.get('/admin/dashboard'),

  getUsers: () => apiClient.get('/admin/users'),

  updateUserStatus: (id: string, status: string, reason?: string) => 
    apiClient.put(`/admin/users/${id}/status`, { status, reason }),

  updateVideoStatus: (id: string, status: string, reason?: string) => 
    apiClient.put(`/admin/videos/${id}/status`, { status, reason }),

  getAnalytics: () => apiClient.get('/admin/analytics')
};

// Error handling utility
export const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    apiClient.setToken(null);
    window.location.href = '/login';
    return 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید.';
  }

  if (error.response?.status === 403) {
    return 'شما مجاز به انجام این عمل نیستید.';
  }

  if (error.response?.status === 404) {
    return 'منبع درخواستی یافت نشد.';
  }

  if (error.response?.status >= 500) {
    return 'خطای سرور. لطفاً بعداً تلاش کنید.';
  }

  return error.message || 'خطای نامشخص رخ داده است.';
};

// Request interceptor for automatic token refresh
export const setupInterceptors = () => {
  // This would be implemented with axios interceptors in a real project
  console.log('API interceptors setup completed');
};

export default apiClient;