const { readDB } = require('../utils/mockDb');

const getSystemStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('Admin access required');
    }

    const db = readDB();
    const stats = {
      totalUsers: db.users.length,
      totalTasks: db.tasks.length,
      completedTasks: db.tasks.filter(t => t.status === 'Completed').length,
      recentLogs: db.logs.slice(-10).reverse()
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('Admin access required');
    }

    const db = readDB();
    const users = db.users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role || 'User',
      createdAt: u.createdAt
    }));

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSystemStats, getAllUsers };
