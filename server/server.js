import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, isFallbackActive } from './db.js';

// Import routers
import pyqRouter from './routes/pyqs.js';
import aiRouter from './routes/ai.js';
import intelligenceRouter from './routes/intelligence.js';
import communityRouter from './routes/community.js';
import authRouter from './routes/auth.js';

// Setup environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    port: PORT,
    database: isFallbackActive() ? 'Local JSON Fallback' : 'MongoDB Connected',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date()
  });
});

// Mount routers
app.use('/api', pyqRouter); // Handles /api/exams and /api/pyqs
app.use('/api/ai', aiRouter);
app.use('/api/intelligence', intelligenceRouter);
app.use('/api/community', communityRouter);
app.use('/api/auth', authRouter);

// Serve static assets in production (compiled client directory)
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Catch-all route to serve React frontend SPA assets
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ error: 'Internal server error: ' + err.message });
});

// Connect to DB and start listening
const dbUri = process.env.MONGODB_URI;
connectDB(dbUri);

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 QuestIQ Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 Healthcheck endpoint available at http://localhost:${PORT}/api/health`);
    if (isFallbackActive()) {
      console.log("⚠️ Running with LOCAL FALLBACK database (data_fallback.json). MongoDB was not detected or connected.");
    }
  });
}

export default app;
