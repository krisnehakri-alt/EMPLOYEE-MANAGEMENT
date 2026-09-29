import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[REST API] ${new Date().toISOString().split('T')[1].split('.')[0]} ${req.method} ${req.originalUrl}`);
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), server: 'StaffPulse REST API v1.0' });
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `API route ${req.method} ${req.url} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================`);
  console.log(`🚀 StaffPulse REST API Server Running!`);
  console.log(`📡 URL: http://localhost:${PORT}/api`);
  console.log(`👥 Employees: http://localhost:${PORT}/api/employees`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
  console.log(`=================================================`);
});
