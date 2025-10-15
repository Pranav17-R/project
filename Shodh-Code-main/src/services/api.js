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
      // Handle 204 No Content or empty bodies gracefully
      const contentType = response.headers.get('content-type') || '';
      let data = null;
      if (response.status !== 204) {
        if (contentType.includes('application/json')) {
          const text = await response.text();
          data = text ? JSON.parse(text) : null;
        } else {
          // Fallback for non-JSON responses
          data = await response.text();
        }
      }

      if (!response.ok) {
        const message = data && typeof data === 'object' && data.message ? data.message : 'API request failed';
        throw new Error(message);
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

  async getTheme() {
    return this.getProfile();
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

  async updateProblem(id, problemData) {
    return this.request(`/problems/${id}`, {
      method: 'PUT',
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

  async deleteSolvedProblem(id) {
    return this.request(`/solved/${id}`, {
      method: 'DELETE',
    });
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

