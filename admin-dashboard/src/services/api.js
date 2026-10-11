/**
 * CampusBite Staff/Admin API Client
 * Seamlessly interfaces with Gokul's Backend APIs with intelligent fallback
 * to local persistent mock store if the backend server is offline or in development.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://campusbite-backend-k49x.onrender.com/api';

class ApiClient {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    try {
      const res = await fetch(url, config);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      // In offline/mock mode, throw so caller can fall back to local store
      throw err;
    }
  }

  // --- Auth APIs ---
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // --- Menu APIs ---
  async getMenu() {
    return this.request('/menu');
  }

  async createMenuItem(itemData) {
    return this.request('/menu', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  }

  async updateMenuItem(id, itemData) {
    return this.request(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData)
    });
  }

  async deleteMenuItem(id) {
    return this.request(`/menu/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Order APIs ---
  async getOrders() {
    return this.request('/order');
  }

  async createOrder(orderData) {
    return this.request('/order', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async updateOrderStatus(id, status) {
    return this.request(`/order/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async cancelOrder(id, reason) {
    return this.request(`/order/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  }

  // --- Cashier / Payment APIs ---
  async verifyCashPayment(tokenIdOrOrderId) {
    return this.request('/payment/verify-cash', {
      method: 'POST',
      body: JSON.stringify({ tokenId: tokenIdOrOrderId })
    });
  }

  async verifyToken(tokenId) {
    return this.request('/token/verify', {
      method: 'POST',
      body: JSON.stringify({ tokenId })
    });
  }

  // --- Inventory APIs ---
  async getInventory() {
    return this.request('/inventory');
  }

  async updateInventory(id, quantity, threshold) {
    return this.request(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity, threshold })
    });
  }

  // --- Staff APIs ---
  async getStaff() {
    return this.request('/staff');
  }

  async createStaff(staffData) {
    return this.request('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData)
    });
  }

  async approveStaff(staffId) {
    return this.request(`/staff/${staffId}/approve`, {
      method: 'PUT'
    });
  }

  async rejectStaff(staffId) {
    return this.request(`/staff/${staffId}/reject`, {
      method: 'PUT'
    });
  }

  async toggleStaffStatus(staffId) {
    return this.request(`/staff/${staffId}/status`, {
      method: 'PUT'
    });
  }

  // --- Reports & Analytics ---
  async getRevenueReports(range = 'daily') {
    return this.request(`/reports/revenue?range=${range}`);
  }

  async getTopItems() {
    return this.request('/reports/top-items');
  }

  async getFeedback() {
    return this.request('/feedback');
  }
}

export const api = new ApiClient();
export default api;
