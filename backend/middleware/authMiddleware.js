const jwt = require('jsonwebtoken');
const { readDB } = require('../utils/mockDb');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const db = readDB();
      const user = db.users.find(u => u._id === decoded.id);
      
      if (!user) throw new Error('User not found');

      req.user = { _id: user._id, name: user.name, email: user.email, role: user.role };
      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(401);
    next(new Error('Not authorized as an admin'));
  }
};

module.exports = { protect, admin };
