import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import apiRoutes from './routes/api.js';
import { setupChatSocket } from './sockets/chatSocket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  },
});

setupChatSocket(io);

// Middlewares
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (_req, expressRes) => {
  expressRes.json({ status: 'ok', name: 'SwapSkill API', timestamp: new Date() });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 SwapSkill Server running on http://localhost:${PORT}`);
});
