import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Pre-configured admin credentials
  if (email === 'admin@staffpulse.com' && password === 'admin123') {
    const user = {
      id: 'USR-ADMIN-01',
      name: 'Sarah Connor',
      email: 'admin@staffpulse.com',
      role: 'HR Administrator',
      department: 'Human Resources',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256'
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });

    return res.json({
      token,
      user,
      message: 'Authentication successful',
    });
  }

  // Allow login for any valid email format with password >= 6 characters for user convenience
  if (password.length >= 6) {
    const user = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: 'HR Manager',
      department: 'Operations',
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });

    return res.json({
      token,
      user,
      message: 'Authentication successful',
    });
  }

  return res.status(401).json({
    message: 'Invalid email or password. Hint: admin@staffpulse.com / admin123',
  });
});

export default router;
