import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_attendance_key_2026';

export const verifyToken = (req, res, next) => {
  // Extract token from 'Bearer <TOKEN>' header array layout
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: "Access denied. Token missing." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    // Attach user payload (userId, role) data properties directly to the request object
    req.user = verified;
    next(); // Pass control execution pattern to the next controller function
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token session." });
  }
};