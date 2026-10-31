import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import { protect } from './middleware/authMiddleware.js';
import { uploadResumePdf } from './middleware/uploadMiddleware.js';
import { analyzeLimiter, apiLimiter } from './middleware/rateLimiter.js';
import { createAnalysis } from './controllers/analysisController.js';
import { errorHandler } from './middleware/errorHandler.js';

// Catch unhandled exceptions & rejections to prevent unexpected process exit
process.on('uncaughtException', (err) => {
  console.error('[Process Uncaught Exception]:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Process Unhandled Rejection]:', reason);
});

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// General rate limiter for all API requests
app.use('/api', apiLimiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ResumeMatch AI Backend'
  });
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Analyze Route (exact path specified: POST /api/analyze)
app.post('/api/analyze', protect, analyzeLimiter, uploadResumePdf, createAnalysis);

// Analyses Collection Routes (GET /api/analyses, GET /:id, DELETE /:id)
app.use('/api/analyses', analysisRoutes);

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Keep-alive heartbeat to prevent premature event loop termination in daemon mode
setInterval(() => {}, 1000 * 60 * 60);

// Start server
const server = app.listen(PORT, () => {
  console.log(`[ResumeMatch AI Server] Running on http://localhost:${PORT}`);
  console.log(`[Environment] Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[AI Model Configured] ${process.env.GEMINI_MODEL || 'gemini-3.5-flash'}`);
});

server.on('error', (err) => {
  console.error('[Server Error Event]:', err);
});
