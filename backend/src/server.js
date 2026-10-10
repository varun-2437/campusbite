import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import feedbackCouponRoutes from './routes/feedbackCouponRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup Socket.io for live updates
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to incoming requests so controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api', feedbackCouponRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CampusBite Core Backend (Gokul M P)',
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 CampusBite Backend running on port ${PORT}`);
    console.log(`📡 Socket.io server active on ws://localhost:${PORT}`);
    console.log(`📋 Health check available at http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });
});

export { app, server, io };
