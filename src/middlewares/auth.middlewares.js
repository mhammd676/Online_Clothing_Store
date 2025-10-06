const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || "mysecret";

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// التحقق من الدور
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: you don’t have access" });
    }
    next();
  };
};

module.exports = { authMiddleware, authorize };
