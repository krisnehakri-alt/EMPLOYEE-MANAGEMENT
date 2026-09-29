import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'staffpulse-super-secret-key-2026';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No authorization token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Session expired or invalid authorization token.' });
    }
    req.user = user;
    next();
  });
};

export { JWT_SECRET };
