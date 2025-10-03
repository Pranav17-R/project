const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/me');
  }

  async updateProfile(userData) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/users/me/password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  // Problem endpoints
  async getProblems(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/problems${queryString ? `?${queryString}` : ''}`);
  }

  async createProblem(problemData) {
    return this.request('/problems', {
      method: 'POST',
      body: JSON.stringify(problemData),
    });
  }

  // Solved problem endpoints
  async addSolvedProblem(problemData) {
    return this.request('/solved', {
      method: 'POST',
      body: JSON.stringify(problemData),
    });
  }

  async getSolvedProblems(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/solved${queryString ? `?${queryString}` : ''}`);
  }

  // Recommendation endpoints
  async getRecommendations() {
    return this.request('/recommendations/next');
  }

  // Progress endpoints
  async getProgressSummary() {
    return this.request('/progress/summary');
  }

  async getProgressTimeline(days = 90) {
    return this.request(`/progress/timeline?days=${days}`);
  }
}

export default new ApiService();

