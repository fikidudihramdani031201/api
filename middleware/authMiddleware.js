const jwt = require('jsonwebtoken');
require('dotenv').config();


function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Kesalahan Verifikasi JWT:', err);
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ msg: 'Invalid token.' });
      } else if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token expired.' });
      } else {
        return res.status(403).json({ msg: 'Forbidden' });
      }
    }
    console.log('Payload JWT yang Dideskripsikan:', user);

    req.user = user;
    next();
  });
}

function checkRole(req, res, next) {
  const userRole = req.user.user.role;
  console.log(userRole);
  if (!userRole) {
    return res.status(403).json({ msg: 'Forbidden' });
  }

  next();
}

module.exports = { authenticateToken, checkRole };
