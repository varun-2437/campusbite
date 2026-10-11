/**
 * Real-time WebSocket / Socket.io client abstraction for CampusBite
 * Listens for:
 * - 'newOrder': student placed order via app or walk-in POS
 * - 'orderStatusChanged': status updated by kitchen, cashier, or counter
 * - 'lowStockAlert': emitted when inventory drops below threshold
 */

import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'https://campusbite-backend-k49x.onrender.com';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket) return;

    try {
      this.socket = io(SOCKET_SERVER_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnectionAttempts: 3,
        timeout: 2000
      });

      this.socket.on('connect', () => {
        console.log('[Socket.io] Connected to CampusBite live dispatch server');
      });

      this.socket.on('connect_error', () => {
        // Fallback silently if standalone mock development
      });
    } catch (e) {
      console.warn('Socket.io connection disabled or server offline:', e);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    // Also dispatch to local listeners so multi-tab / local actions update instantaneously
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => cb(data));
    }
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
export default socketService;
